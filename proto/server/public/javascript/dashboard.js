$('#dashboard-tab').addClass('active');

var app = angular.module('main_app', []).config(['$interpolateProvider', function ($interpolateProvider) {
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

app.controller('main_controller', function($scope, $http) {
    //init vars
    var today = new Date();
    $scope.chosenYear = today.getFullYear();
    $scope.chosenMonth = null;
    $scope.years = [];
    for(var i = 2015; i <= today.getFullYear(); i++) $scope.years.push(i);
    $scope.months = [{value: 1, name: 'Jan'},{value: 2, name: 'Feb'},{value: 3, name: 'Mar'},{value: 4, name: 'Apr'},{value: 5, name: 'May'},{value: 6, name: 'Jun'},
    {value: 7, name: 'Jul'},{value: 8, name: 'Aug'},{value: 9, name: 'Sep'},{value: 10, name: 'Oct'},{value: 11, name: 'Nov'},{value: 12, name: 'Dec'}]; 
    $scope.total_purchases = 134342;
    
    $scope.chooseYear = function(year){
        $scope.chosenYear = year;        
        updateData($scope, $http);
    };

    $scope.chooseMonth = function(month){
        $('.month-selector').removeClass('active');
        event.target.className += ' active';

        $scope.chosenMonth = month;
        updateData($scope, $http);
    };

    $scope.$watch('step', function() {
        if($scope.step == 4){                    
            //Unblur container and hide spinner
            $('#loader').hide();
            $('.container').removeClass('blur');
        }
    });

    updateData($scope,$http);
});

var updateData= function($scope, $http){
    $scope.step = 0
    //Blur container and show spinner
    $('#loader').show();
    $('.container').addClass('blur');

    updateTotalPurchases($scope, $http);
    updateTotaSales($scope, $http);
    updateCustomersInfo($scope, $http);
    updateInventoryValue($scope, $http);
    updateGrossProfitRatio($scope, $http);

    var data = [
        {
            name: 'Plants',
            y: 60
        },
        {
            name: 'Chairs',
            y: 20
        },
        {
            name: 'Windows',
            y: 13.02
        },
        {
            name: 'Tables',
            y: 7.07
        }]
        
    createChart(data);
}

var createChart = function (data) {
    Highcharts.chart('sales-by-product', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Product Sales Distribution'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                showInLegend: true
            }
        },
        series: [{
            name: 'Categories',
            colorByPoint: true,
            data: data,
        }]
    });
}

var updateTotalPurchases = function ($scope, $http) {
    $scope.total_purchases = 0;

    var url = 'http://localhost:49822/api/Purchases/groupBySupplier?year=' + $scope.chosenYear;

    if($scope.chosenMonth != null){
        url += '&month=' + $scope.chosenMonth;
    }

    $http.get(url).then(function (success){
        for (i in success.data) {
            var purchase = success.data[i];

            $scope.total_purchases += purchase.TotalValue;
        }

        $scope.step++;
    },function (error){
        $scope.contents = [{heading:"Error",description:"Could not load json   data"}];
        //console.log($scope);
    });
}

var updateTotaSales = function ($scope, $http) {
    var url = address;
    if ($scope.chosenMonth) 
        url += 'getSalesByMonth?year=' + $scope.chosenYear + '&month=' + $scope.chosenMonth;
    else 
        url += 'getSalesByYear?year=' + $scope.chosenYear;

    $http.get(url).then(
        function (success) {
            $scope.total_sales = 0;
            for (i in success.data) $scope.total_sales += success.data[i].NetTotal;

            $scope.step++;
        },
        function (error) {
            $scope.contents = [{heading:"Error",description:"Could not load json data"}];
        }
    );
}

var updateCustomersInfo = function ($scope, $http) {
    var url = address + 'getCustomers?year=' + $scope.chosenYear;
    if ($scope.chosenMonth ) url += '&month=' + $scope.chosenMonth;

    $http.get(url).then(function (success) {
        $scope.activeCustomers = 0;
        for (var i = 0; i < success.data.length; i++) 
            if (success.data[i].sales > 0) $scope.activeCustomers++;
            else break;
        
        $scope.mostValuableCustomer = 'No customer';
        if (success.data.length > 0 && success.data[0].sales > 0)
            $scope.mostValuableCustomer = success.data[0].company_name;

        $scope.step++;
    }
    , function (error) {
        $scope.contents = [{heading:"Error",description:"Could not load json   data"}];
    }); 
}

var updateInventoryValue= function($scope, $http){
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
        $scope.inventory_value = value;
        $scope.step++;
    },function (error){
        $scope.contents = [{heading:"Error",description:"Could not load json data"}];
    });
}

var updateGrossProfitRatio= function($scope, $http){
    var requestUrl = address + 'getBalancetes?year=' + $scope.chosenYear;
    if ($scope.chosenMonth ) requestUrl += '&month=' + $scope.chosenMonth;
    
    $http.get(requestUrl).then(function (success){
        var balancetes = success.data;
        var netSales = 0;
        var costOfGoodsSold = 0;
    
        for (var i = 0; i < balancetes.length; i++) {
            var balancete = balancetes[i];    
            for (var j = 0; j < balancete.length; j++) 
                if (balancete[j].AccountID == '61') {
                    costOfGoodsSold += balancete[j].DebtMovements;
                }
                else if (balancete[j].AccountID == '71') {
                    netSales += balancete[j].CreditMovements;
                }
        }

        if(netSales == 0){
            $scope.gross_profit_ratio = null;
        }else{
            $scope.gross_profit_ratio = (netSales - costOfGoodsSold)/ netSales;
        }
        $scope.step++;

    },function (error){
        $scope.contents = [{heading:"Error",description:"Could not load json data"}];
    });
}