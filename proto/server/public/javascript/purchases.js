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

        //console.log($scope);
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
            var date = new Date(purchase.DocumentDate)

            dates.push(date.toLocaleDateString());
            purchasesTotal.push(purchase.TotalValue);
        }

        createGraph(dates, purchasesTotal);

        //console.log($scope);
    },function (error){
        $scope.contents = [{heading:"Error",description:"Could not load json data"}];
        //console.log($scope);
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

        $scope.growth = (($scope.total - totalLastYear)/totalLastYear);

        //console.log($scope);
    },function (error){
        $scope.contents = [{heading:"Error",description:"Could not load json data"}];
        //console.log($scope);
    });
}

var updateData= function($scope, $http){
    updateSuppliers($scope, $http);
    updateGraph($scope, $http);
    updateGrowth($scope, $http);
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

app.controller('purchases_controller', function($scope, $http) {
    $scope.chosenYear = 2017;
    $scope.chosenMonth = null;
    $scope.years = [2015,2016,2017,2018];
    $scope.months = [{value: null, name: 'None'},{value: 1, name: 'Jan'},{value: 2, name: 'Feb'},{value: 3, name: 'Mar'},{value: 4, name: 'Apr'},{value: 5, name: 'May'},{value: 6, name: 'Jun'},
    {value: 7, name: 'Jul'},{value: 8, name: 'Aug'},{value: 9, name: 'Sep'},{value: 10, name: 'Oct'},{value: 11, name: 'Nov'},{value: 12, name: 'Dec'}];

    $scope.chooseYear = function(year){
        $scope.chosenYear = year;        
        updateData($scope, $http);
    };

    $scope.chooseMonth = function(month){
        $scope.chosenMonth = month;
        console.log($scope.chosenYear + '/' + $scope.chosenMonth);
        updateData($scope, $http);
    };

    updateData($scope,$http);

});