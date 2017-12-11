var createInventoryMovementsChart= function(inMovements, outMovements, month) {
    var subtitle = 'in Euros per day';
    var tooltip = '{point.x:%e/%b}: {point.y:.2f} €'

    if(month == null){
        subtitle = 'in Euros per month';
        tooltip = '{point.x:%b}: {point.y:.2f} €'
    }
    Highcharts.chart('inventory-movements', {
        chart: {
            type: 'spline'
        },
        title: {
            text: 'Inventory Movements'
        },
        subtitle: {
            text: subtitle
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: { // don't display the dummy year
                day: '%e/%b',
                week: '%e/%b',
                month: '%b',
                year: '%b'
            },
            title: {
                text: 'Date'
            }
        },
        yAxis: {
            title: {
                text: 'Total (€)'
            },
            min: 0
        },
        tooltip: {
            headerFormat: '<b>{series.name}</b><br>',
            pointFormat: tooltip
        },
    
        plotOptions: {
            spline: {
                marker: {
                    enabled: true
                }
            }
        },
    
        series: [{
            name: 'Out Movements',
            data: outMovements
        }, {
            name: 'In Movements',
            data: inMovements
        }]
    });
}

var best = function(array, n){
    var sArray = array.sort(function(a, b){
        return b.value - a.value;
    });

    var res = [];
    var others = 0;
    var i = 0;

    for (s of sArray) {
        if(i < n){
            res.push({
                name: s.name,
                value: s.value
            })
        }
        else{
            others += s.value;
        }
        i++;
    }
    if(others>0)
        res.push({
            name: "Others",
            value: others
        })
    return res;
}

var createPizza= function(categories){
    var data = [];
    for (i of categories) {
        data.push([i.name, i.value]);
    }

    Highcharts.chart('inventory-value', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false
        },
        title: {
            text: 'Inventory Value'
        },
        subtitle: {
            text: 'by Category'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: false,
                    distance: -30,
                    style: {
                        fontWeight: 'bold',
                        color: 'white'
                    }
                },
                startAngle: -180,
                endAngle: 180,
                showInLegend: true,
                center: ['50%', '50%']
            }
        },
        series: [{
            type: 'pie',
            name: 'Inventory Value Percentage',
            innerSize: '50%',
            data: data
        }]
    });
}
var updateValue= function($scope, $http){
    var url = 'http://localhost:49822/api/Inventory/date/' + $scope.chosenYear;
    
    if($scope.chosenMonth != null){
        url += "/" + $scope.chosenMonth;
    }
    
    $http.get(url).then(function (success){
        var data = [];
        var categories = [];
        var value = 0;
        for (i of success.data) {
            var name = i.Family || "";
            if(data[name] !=null)
                data[name] += i.TotalValue;
            else
                data[name] = i.TotalValue; 
        }
        
        for (i in data) {
            categories.push({
                name: i,
                value: data[i] 
            })
            value += data[i] ;
        }
        $scope.totalValue = value;
        $scope.step++;
        createPizza(best(categories, 5));
    },function (error){
        $scope.contents = [{heading:"Error",description:"Could not load json data"}];
    });
}

var updateStockMovements= function($scope, $http){
    var url = 'http://localhost:49822/api/Inventory/';
    var date_selection = '?year=' + $scope.chosenYear;
    
    if($scope.chosenMonth != null){
        date_selection += "&month=" + $scope.chosenMonth;
    }
   
    $scope.inMovements = [];
    $scope.outMovements = [];
    
    $http.get(url+'outMovements'+date_selection).then(function (success){
        var outMoves = success.data;

        outMoves.forEach(function(movement) {
            var date = new Date(movement.data);

            $scope.outMovements.push([Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()), movement.valor],)
        })

        console.log($scope.outMovements);
        
        $scope.step++;
    },function (error){
        $scope.contents = [{heading:"Error",description:"Could not load json data"}];
    });

    $http.get(url+'inMovements'+date_selection).then(function (success){
        var inMoves = success.data;

        inMoves.forEach(function(movement) {
            var date = new Date(movement.data);
            console.log(date);
            console.log(movement.data);
            $scope.inMovements.push([Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()), movement.valor],)
        })

        console.log($scope.inMovements);
  
        $scope.step++;
    },function (error){
        $scope.contents = [{heading:"Error",description:"Could not load json data"}];
    });
}

var updateOutOfStock= function($scope, $http){
    $scope.step = 1
    var url = 'http://localhost:49822/api/Inventory/outOfStock/';
    
    $http.get(url).then(function (success){
        for (i in success.data) {
            var stock = success.data[i];

            if(i < 5){
                $scope.prodOutOfStock.push(stock);
            }
        }
        $scope.step++;
    },function (error){
        $scope.contents = [{heading:"Error",description:"Could not load json data"}];
    });
}

var updateData= function($scope, $http){
    if($scope.step > 2)
        $scope.step = 2
    //Blur container and show spinner
    $('#loader').show();
    $('.container').addClass('blur');
    
    updateValue($scope, $http);
    updateStockMovements($scope, $http);
}

var app = angular.module('inventory_app', []).config(['$interpolateProvider', function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
  }]);

  app.filter('percentage', ['$filter', function ($filter) {
    return function (input, decimals) {
      return $filter('number')(input * 100, decimals) + '%';
    };
  }]);

  app.filter('euro', ['$filter', function ($filter) {
    return function (input) {
      return $filter('number')(input, 2) + '€';
    };
  }]);

app.controller('inventory_controller', function($scope, $http) {
    //init vars
    var today = new Date();
    
    $scope.chosenYear = today.getFullYear() - 1;
    $scope.chosenMonth = null;
    $scope.prodOutOfStock = [];
    $scope.inMovements = [];
    $scope.outMovements = [];
        
    $scope.years = [];
    for(var i = 2015; i <= today.getFullYear(); i++){
           $scope.years.push(i);
    }
    $scope.months = [{value: null, name: 'None'}, {value: 1, name: 'Jan'},{value: 2, name: 'Feb'},{value: 3, name: 'Mar'},{value: 4, name: 'Apr'},{value: 5, name: 'May'},{value: 6, name: 'Jun'},
    {value: 7, name: 'Jul'},{value: 8, name: 'Aug'},{value: 9, name: 'Sep'},{value: 10, name: 'Oct'},{value: 11, name: 'Nov'},{value: 12, name: 'Dec'}];
    
    $scope.$watch('step', function() {
        if($scope.step == 5){
            createInventoryMovementsChart($scope.inMovements,$scope.outMovements, $scope.chosenMonth);                    
            //Unblur container and hide spinner
            $('#loader').hide();
            $('.container').removeClass('blur');
        }
    });

    $scope.chooseYear = function(year){
        $scope.chosenYear = year;        
        updateData($scope, $http);
    };

    $scope.getQuery = function(){
        var query = 'year=' + $scope.chosenYear;
        if($scope.chosenMonth != null){
            query+='&month=' + $scope.chosenMonth;
        }

        return query;
    }

    $scope.update = function(){
        updateData($scope, $http);
    }

    updateOutOfStock($scope,$http);
    updateData($scope,$http);

});