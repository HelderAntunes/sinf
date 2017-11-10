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

/*$.ajax({
    url: address + "getSalesByYear",
    type: "GET",
    dataType: "json",
    data: {"year": 2016},
    success: function(data) {
        updateChartYear(data, 2016);
    },
    error: function(error) {
         console.log("Error:");
         console.log(error);
    }
});*/

/*$.ajax({
    url: address + "getSalesByMonth",
    type: "GET",
    dataType: "json",
    data: {"year": 2016, 'month': 1},
    success: function(data) {
        updateChartMonth(data, 2016, 1);
    },
    error: function(error) {
         console.log("Error:");
         console.log(error);
    }
});*/

var updateData= function($scope, $http) {
    //updateOverview($scope, $http);
    updateGraph($scope, $http);
    //updateSuppliers($scope, $http);
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

var updateGraph = function($scope, $http){
    if ($scope.chosenMonth != null) {
        $.ajax({
            url: address + "getSalesByMonth",
            type: "GET",
            dataType: "json",
            data: {"year": $scope.chosenYear, 'month': $scope.chosenMonth},
            success: function(data) {
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
                updateChartYear(data, $scope.chosenYear);
            },
            error: function(error) {
                console.log("Error: " + error);
            }
        });
    }
}

var updateOverview = function($scope, $http) {
    $scope.growth = 0;
    $scope.total = 0;
    var url = 'http://localhost:49822/api/Purchases/groupByDate?year=' + ($scope.chosenYear - 1);

    if($scope.chosenMonth != null) {
        url += '&month=' + $scope.chosenMonth;
    }

    $http.get(url).then(function (success) {
        var totalLastYear = 0;

        for (i in success.data) {
            var purchase = success.data[i];
            
            totalLastYear += purchase.TotalValue;
        }

        $scope.growth = (($scope.total - totalLastYear)/totalLastYear);

        //console.log($scope);
    },function (error) {
        $scope.contents = [{heading:"Error",description:"Could not load json data"}];
        //console.log($scope);
    });
}

function updateChartYear(data, year) {
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

function updateChartMonth(data, year, month) {
    var numDaysOfMonth = daysInMonth(month, year);
    var monthSales = Array.apply(null, Array(numDaysOfMonth)).map(Number.prototype.valueOf,0);

    for (var i = 0; i < data.length; i++) {
        var ammount = data[i].GrossTotal;
        var InvoiceDate = data[i].InvoiceDate;
        console.log(InvoiceDate);
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
function daysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
}

function getArrayWithDays(numDays) {
    var days = [];
    for (var i = 1; i <= numDays; i++) days.push(i);
    return days;
}

function getMonthName(index) {
    var monthNames = [null, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return monthNames[index]; 
}
