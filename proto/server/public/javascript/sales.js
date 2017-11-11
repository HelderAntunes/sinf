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

app.controller('sales_controller', function($scope, $http) {
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

var updateData= function($scope, $http) {
    var sales = getSales($scope);

    updateOverview($scope, sales);
    updateChart($scope, sales);
    //updateSuppliers($scope, $http);
}

var getSales = function($scope){
    var sales = null;

    if ($scope.chosenMonth != null) {
        $.ajax({
            url: address + "getSalesByMonth",
            type: "GET",
            dataType: "json",
            data: {"year": $scope.chosenYear, 'month': $scope.chosenMonth},
            success: function(data) {
                sales = data;
                updateChartMonth(data, $scope.chosenYear, $scope.chosenMonth);
            },
            error: function(error) {
                console.log("Error: " + error);
            }
        });
    }
    else {
        $.ajax({
            url: address + "getSalesByYear",
            type: "GET",
            dataType: "json",
            data: {"year": $scope.chosenYear},
            success: function(data) {
                sales = data;
                updateChartYear(data, $scope.chosenYear);
            },
            error: function(error) {
                console.log("Error: " + error);
            }
        });
    }

    return sales;
}

var updateOverview = function($scope, data) {
    $scope.totalSales = 0;
    for (sale in data) $scope.totalSales += sale.NetTotal;

    $scope.salesPerPeriod = 0;
    if ($scope.chooseMonth == null) {
        
    }
}

var updateChart = function($scope, data) {
    if ($scope.chooseMonth == null) updateChartYear(data, $scope.chosenYear);
    else updateChartMonth(data, $scope.chosenYear, $scope.chosenMonth);
}

var updateChartYear = function(data, year) {
    var yearSales = Array.apply(null, Array(12)).map(Number.prototype.valueOf,0); // init array to zero

    for (var i = 0; i < data.length; i++) {
        var ammount = data[i].GrossTotal;
        var InvoiceDate = data[i].InvoiceDate;
        var month = moment(InvoiceDate).month();
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
    var numDaysOfMonth = daysInMonth(month, year);
    var monthSales = Array.apply(null, Array(numDaysOfMonth)).map(Number.prototype.valueOf,0);

    for (var i = 0; i < data.length; i++) {
        var ammount = data[i].GrossTotal;
        var InvoiceDate = data[i].InvoiceDate;
        var day = moment(InvoiceDate).day();
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

//Month is 1 based
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

var updateSuppliers = function ($scope, $http) {
    $scope.purchases = [];
    $scope.total = 0;

    var url = address + 'getSalesByMonth?year=' + $scope.chosenYear;

    if ($scope.chosenMonth != null) {

        url += 'getSalesByMonth?year=' + $scope.chosenYear + '&month=' + $scope.chosenMonth;
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
