$('#purchases-tab').addClass('active');

var createGraph = function (dates, purchasesTotal) {
    Highcharts.chart('total-purchases', {
        
                title: {
                    text: 'Purchases'
                },

                xAxis: {
                    categories: dates,
                },
        
                yAxis: {
                    title: {
                        text: 'Euros €'
                    }
                },
        
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle'
                },
        
                series: [{
                    name: 'Purchases',
                    data: purchasesTotal
                }],

                tooltip: {
                    pointFormat: "{point.y:,.2f} €"
                },
        
                responsive: {
                    rules: [{
                        condition: {
                            maxWidth: 500
                        },
                        chartOptions: {
                            legend: {
                                layout: 'horizontal',
                                align: 'center',
                                verticalAlign: 'bottom'
                            }
                        }
                    }]
                }
        
            });
}

var updateSuppliers = function ($scope, $http) {
    $scope.purchases = [];
    $scope.total = 0;

    var url = 'http://localhost:49822/api/Purchases/groupBySupplier?year=' + $scope.chosenYear;

    if($scope.chosenMonth != null){
        url += '&month=' + $scope.chosenMonth;
    }

    $http.get(url).then(function (success){
        $scope.purchases= [];

        for (i in success.data) {
            var purchase = success.data[i];

            if(i < 3){
                $scope.purchases.push(purchase);
            }

            $scope.total += purchase.TotalValue;
        }

        $scope.step++;
        
        updateGrowth($scope, $http);
    },function (error){
        $scope.contents = [{heading:"Error",description:"Could not load json   data"}];
        //console.log($scope);
    });
}

var updateGraph = function($scope, $http){
    var url = 'http://localhost:49822/api/Purchases/groupByDate?year=' + $scope.chosenYear;

    if($scope.chosenMonth != null){
        url += '&month=' + $scope.chosenMonth;
    }

    $http.get(url).then(function (success){
        var dates = [];
        var purchasesTotal = [];

        for (i in success.data) {
            var purchase = success.data[i];
            var date = new Date(purchase.DocumentDate);

            dates.push(date.toLocaleDateString());
            purchasesTotal.push(purchase.TotalValue);
        }

        $scope.step++;

        createGraph(dates, purchasesTotal);
    },function (error){
        $scope.contents = [{heading:"Error",description:"Could not load json data"}];
    });
}

var updateGrowth = function($scope, $http){
    $scope.growth = 0;
    var url = 'http://localhost:49822/api/Purchases/groupByDate?year=' + ($scope.chosenYear - 1);

    if($scope.chosenMonth != null){
        url += '&month=' + $scope.chosenMonth;
    }

    $http.get(url).then(function (success){
        var totalLastYear = 0;

        for (i in success.data) {
            var purchase = success.data[i];
            
            totalLastYear += purchase.TotalValue;
        }
        
        if(success.data.length != 0){
            $scope.growth = (($scope.total - totalLastYear)/totalLastYear);
        }
        else{
            $scope.growth = null;
        }

        $scope.step++;
    },function (error){
        $scope.contents = [{heading:"Error",description:"Could not load json data"}];
    });
}

var updateData= function($scope, $http){
    $scope.step = 0
    //Blur container and show spinner
    $('#loader').show();
    $('.container').addClass('blur');

    updateSuppliers($scope, $http);
    updateGraph($scope, $http);
}

var app = angular.module('purchases_app', []).config(['$interpolateProvider', function ($interpolateProvider) {
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

app.controller('purchases_controller', function($scope, $http) {
    //init vars
    var today = new Date();
    
    $scope.chosenYear = today.getFullYear();
    $scope.chosenMonth = null;
        
    $scope.years = [];
    for(var i = 2015; i <= today.getFullYear(); i++){
           $scope.years.push(i);
    }
    $scope.months = [{value: 1, name: 'Jan'},{value: 2, name: 'Feb'},{value: 3, name: 'Mar'},{value: 4, name: 'Apr'},{value: 5, name: 'May'},{value: 6, name: 'Jun'},
    {value: 7, name: 'Jul'},{value: 8, name: 'Aug'},{value: 9, name: 'Sep'},{value: 10, name: 'Oct'},{value: 11, name: 'Nov'},{value: 12, name: 'Dec'}];
    
    $scope.$watch('step', function() {
        if($scope.step == 3){                    
            //Unblur container and hide spinner
            $('#loader').hide();
            $('.container').removeClass('blur');
        }
    });

    $scope.chooseYear = function(year){
        $scope.chosenYear = year;        
        updateData($scope, $http);
    };

    $scope.update = function(){
        $('.month-selector input[type="radio"]').parent().removeClass('active');
        $('.month-selector input[type="radio"]:checked').parent().addClass('active');
        updateData($scope, $http);
    }

    updateData($scope,$http);

});