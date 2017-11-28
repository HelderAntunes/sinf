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
        updateData($scope, $http);
    };

    $scope.chooseMonth = function(month){
        $scope.chosenMonth = month;
        updateData($scope, $http);
    };

    updateData($scope, $http);
});

var updateData = function($scope, $http) {
    //Blur container and show spinner
    //$('#loader').show();
    //$('.container').addClass('blur');

    var requestUrl = address + 'getBalancetes?year=' + $scope.chosenYear;
    if ($scope.chosenMonth ) requestUrl += '&month=' + $scope.chosenMonth;
    $http.get(requestUrl).then(
        function (success) {
            balancetesCallback($scope, $http, success.data);
        },
        function (error){
            $scope.contents = [{heading:"Error",description:"Could not load json data"}];
        }
    );

    requestUrl = address + 'getBalancos?year=' + $scope.chosenYear;
    if ($scope.chosenMonth ) requestUrl += '&month=' + $scope.chosenMonth;
    $http.get(requestUrl).then(
        function (success) {
            balancosCallback($scope, $http, success.data);
        },
        function (error){
            $scope.contents = [{heading:"Error",description:"Could not load json data"}];
        }
    );
}

var balancosCallback = function($scope, $http, balancos) {
    if ($scope.chosenMonth) updateAssetsAndLiabilitiesMonth($scope, balancos);
    else updateAssetsAndLiabilitiesYear($scope, balancos);
}

var updateAssetsAndLiabilitiesYear = function($scope, balancos) {    
    var assets = [];
    var liabilities = [];
    for (var i = 0; i < balancos.length; i++) {
        assets.push(balancos[i].assets.value);
        liabilities.push(balancos[i].liabilities.value);
    }
    
    $scope.assets = balancos[balancos.length-1].assets.value;
    $scope.liabilities = balancos[balancos.length-1].liabilities.value;
    $scope.equity = $scope.assets - $scope.liabilities;
    
    Highcharts.chart('AssetsAndLiabilitiesChart', {
        chart: {
            type: 'line'
        },
        title: {
            text: 'Assets and Liabilities, ' + $scope.chosenYear
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
                enableMouseTracking: true
            }
        },
        series: [{
            name: 'Assets',
            data: assets
        },
        {
            name: 'Liabilities',
            data: liabilities
        },]
    });
}

var updateAssetsAndLiabilitiesMonth = function($scope, balancos) { 
    var assets = [];
    var liabilities = [];
    for (var i = 0; i < balancos.length; i++) {
        assets.push(balancos[i].assets.value);
        liabilities.push(balancos[i].liabilities.value);
    }
    
    $scope.assets = balancos[balancos.length-1].assets.value;
    $scope.liabilities = balancos[balancos.length-1].liabilities.value;
    $scope.equity = $scope.assets - $scope.liabilities;
    
    Highcharts.chart('AssetsAndLiabilitiesChart', {
        chart: {
            type: 'line'
        },
        title: {
            text: 'Assets and Liabilities, ' + $scope.chosenYear + "/" + $scope.chosenMonth
        },
        xAxis: {
            categories: getArrayWithDays(daysInMonth($scope.chosenYear, $scope.chosenMonth))
        },
        yAxis: {
            title: {
                text: 'Euros €'
            }
        },
        plotOptions: {
            line: {
                enableMouseTracking: true
            }
        },
        series: [{
            name: 'Assets',
            data: assets
        },
        {
            name: 'Liabilities',
            data: liabilities
        },]
    });
}

var balancetesCallback = function($scope, $http, balancetes) {
    if ($scope.chosenMonth) updateGrossMarginMonth($scope, balancetes);
    else updateGrossMarginYear($scope, balancetes);
}

var updateGrossMarginMonth = function($scope, balancetes) {    
    var costsOfGoodSold = [];
    var netSales = [];
    $scope.netSales = 0;
    $scope.costOfGoodsSold = 0;

    for (var i = 0; i < balancetes.length; i++) {
        var balancete = balancetes[i];

        for (var j = 0; j < balancete.length; j++) 
            if (balancete[j].AccountID == '61') {
                costsOfGoodSold.push(balancete[j].DebtMovements);
                $scope.costOfGoodsSold += balancete[j].DebtMovements;
            }
            else if (balancete[j].AccountID == '71') {
                netSales.push(balancete[j].CreditMovements);
                $scope.netSales += balancete[j].CreditMovements;
            }
    }
    $scope.grossProfit = $scope.netSales - $scope.costOfGoodsSold;
    
    Highcharts.chart('grossMarginChart', {
        chart: {
            type: 'line'
        },
        title: {
            text: 'Net Sales and Cost of goods sold, ' + $scope.chosenYear + "/" + $scope.chosenMonth
        },
        xAxis: {
            categories: getArrayWithDays(daysInMonth($scope.chosenYear, $scope.chosenMonth))
        },
        yAxis: {
            title: {
                text: 'Euros €'
            }
        },
        plotOptions: {
            line: {
                enableMouseTracking: true
            }
        },
        series: [{
            name: 'Net Sales',
            data: netSales
        },
        {
            name: 'Cost of goods sold',
            data: costsOfGoodSold
        },]
    });
}

var updateGrossMarginYear = function($scope, balancetes) {    
    var costsOfGoodSold = [];
    var netSales = [];
    $scope.netSales = 0;
    $scope.costOfGoodsSold = 0;

    for (var i = 0; i < balancetes.length; i++) {
        var balancete = balancetes[i];

        for (var j = 0; j < balancete.length; j++) 
            if (balancete[j].AccountID == '61') {
                costsOfGoodSold.push(balancete[j].DebtMovements);
                $scope.costOfGoodsSold += balancete[j].DebtMovements;
            }
            else if (balancete[j].AccountID == '71') {
                netSales.push(balancete[j].CreditMovements);
                $scope.netSales += balancete[j].CreditMovements;
            }
    }
    $scope.grossProfit = $scope.netSales - $scope.costOfGoodsSold;
    
    Highcharts.chart('grossMarginChart', {
        chart: {
            type: 'line'
        },
        title: {
            text: 'Net Sales and Cost of goods sold, ' + $scope.chosenYear
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
                enableMouseTracking: true
            }
        },
        series: [
        {
            name: 'Net Sales',
            data: netSales
        },
        {
            name: 'Cost of goods sold',
            data: costsOfGoodSold
        },]
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
