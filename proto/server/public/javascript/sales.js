$('#sales-tab').addClass('active');

var app = angular.module('sales_app', []).config(['$interpolateProvider', function ($interpolateProvider) {
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

app.controller('sales_controller', function($scope, $http) {
    $scope.chosenYear = 2016;
    $scope.chosenMonth = null;
    $scope.years = [2015,2016,2017];
    $scope.months = [{value: null, name: 'None'},{value: 1, name: 'Jan'},{value: 2, name: 'Feb'},{value: 3, name: 'Mar'},{value: 4, name: 'Apr'},{value: 5, name: 'May'},{value: 6, name: 'Jun'},
    {value: 7, name: 'Jul'},{value: 8, name: 'Aug'},{value: 9, name: 'Sep'},{value: 10, name: 'Oct'},{value: 11, name: 'Nov'},{value: 12, name: 'Dec'}];

    $scope.chooseYear = function(year){
        $scope.chosenYear = year;        
        updateData($scope, $http);
    };

    $scope.chooseMonth = function(month){
        $scope.chosenMonth = month;
        updateData($scope, $http);
    };

    updateData($scope, $http);
});

var updateData = function($scope, $http) {
    var requestUrl = address;
    if ($scope.chosenMonth) 
        requestUrl += 'getSalesByMonth?year=' + $scope.chosenYear + '&month=' + $scope.chosenMonth;
    else 
        requestUrl += 'getSalesByYear?year=' + $scope.chosenYear;

    $http.get(requestUrl).then(
        function (success) {
            updateDataCallback($scope, $http, success.data);
        },
        function (error){
            $scope.contents = [{heading:"Error",description:"Could not load json data"}];
        }
    );
}

var updateDataCallback = function($scope, $http, data) {
    updateOverview($scope, data);
    updateChart($scope, data);
    updateCustomers($scope, $http, data);
} 

var updateOverview = function($scope, data) {
    $scope.totalSales = 0;
    for (i in data) $scope.totalSales += data[i].NetTotal;

    $scope.salesPerPeriod = 0;
    if ($scope.chosenMonth == null) {
        $scope.periodType = 'Sales per month';
        $scope.salesPerPeriod = $scope.totalSales / 12;
    }
    else {
        $scope.periodType = 'Sales per day';
        var days = daysInMonth($scope.chosenYear, $scope.chosenMonth);
        $scope.salesPerPeriod = $scope.totalSales / days;
    }
}

var updateChart = function($scope, data) {
    if ($scope.chosenMonth) updateChartMonth(data, $scope.chosenYear, $scope.chosenMonth);
    else updateChartYear(data, $scope.chosenYear);
}

var updateChartYear = function(data, year) {
    var yearSales = Array.apply(null, Array(12)).map(Number.prototype.valueOf,0); // init array to zero

    for (var i = 0; i < data.length; i++) {
        var ammount = data[i].GrossTotal;
        var month = moment(data[i].InvoiceDate).month();
        yearSales[month] += ammount;
    }

    Highcharts.chart('sales-by-product', {
        chart: {
            type: 'line'
        },
        title: {
            text: 'Sales, ' + year
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
            title: {
                text: 'Euros €'
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: false
                },
                enableMouseTracking: true
            }
        },
        series: [{
            name: 'Sales by month',
            data: yearSales
        }]
    });
}

var updateChartMonth = function(data, year, month) {
    var numDaysOfMonth = daysInMonth(year, month);
    var monthSales = Array.apply(null, Array(numDaysOfMonth)).map(Number.prototype.valueOf,0); // init array to zero

    for (var i = 0; i < data.length; i++) {
        var ammount = data[i].GrossTotal;
        var day = moment(data[i].InvoiceDate).day();
        monthSales[day] += ammount;
    }

    Highcharts.chart('sales-by-product', {
        chart: {
            type: 'line'
        },
        title: {
            text: 'Sales, ' + year + ' ' + getMonthName(month)
        },
        xAxis: {
            categories: getArrayWithDays(numDaysOfMonth)
        },
        yAxis: {
            title: {
                text: 'Euros €'
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: false
                },
                enableMouseTracking: true
            }
        },
        series: [{
            name: 'Sales by day',
            data: monthSales
        }]
    });
}

var updateCustomers = function ($scope, $http) {
    var url = address + 'getCustomers?year=' + $scope.chosenYear;
    if ($scope.chosenMonth ) url += '&month=' + $scope.chosenMonth;

    $http.get(url).then(function (success) {
        $scope.customers = [];
        for (var i = 0; i < success.data.length; i++) {
            if (success.data[i].sales <= 0) break;
            $scope.customers.push(success.data[i]);
        }
    }
    , function (error) {
        $scope.contents = [{heading:"Error",description:"Could not load json   data"}];
    });
}


var daysInMonth = function(year, month) {
    return new Date(year, month, 0).getDate();
}

var getArrayWithDays = function(numDays) {
    var days = [];
    for (var i = 1; i <= numDays; i++) days.push(i);
    return days;
}

var getMonthName = function(index) {
    var monthNames = [null, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return monthNames[index]; 
}
