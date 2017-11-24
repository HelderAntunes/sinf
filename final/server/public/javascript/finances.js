$('#finances-tab').addClass('active');

var app = angular.module('finances_app', []).config(['$interpolateProvider', function ($interpolateProvider) {
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
        return $filter('number')(input, 2) + ' €';
    };
}]);

app.controller('finances_controller', function($scope, $http) {
    $scope.chosenYear = 2016;
    $scope.chosenMonth = null;
    $scope.years = [2015,2016,2017];
    $scope.months = [{value: null, name: 'None'},{value: 1, name: 'Jan'},{value: 2, name: 'Feb'},{value: 3, name: 'Mar'},{value: 4, name: 'Apr'},{value: 5, name: 'May'},{value: 6, name: 'Jun'},
    {value: 7, name: 'Jul'},{value: 8, name: 'Aug'},{value: 9, name: 'Sep'},{value: 10, name: 'Oct'},{value: 11, name: 'Nov'},{value: 12, name: 'Dec'}];

    $scope.chooseYear = function(year){
        $scope.chosenYear = year;        
        //updateData($scope, $http);
    };

    $scope.chooseMonth = function(month){
        $scope.chosenMonth = month;
        //updateData($scope, $http);
    };

    //updateData($scope, $http);
});

Highcharts.chart('container', {

    title: {
        text: 'Finances'
    },

    subtitle: {
        text: 'Equity, Assets and Liabilities'
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

    plotOptions: {
        series: {
            pointStart: 2010
        }
    },

    series: [{
        name: 'Equity',
        data: [23344, 25544, 20343, 40344, 60344, 90000, 111034, 114455]
    }, {
        name: 'Assets',
        data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
    }, {
        name: 'Liabilities',
        data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
    }],

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

