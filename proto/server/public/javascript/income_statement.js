var app = angular.module('income_statement_app', []).config(['$interpolateProvider', function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
  }]);

  app.filter('euro', ['$filter', function ($filter) {
    return function (input) {
      return $filter('number')(input, 2) + '€';
    };
  }]);

app.controller('income_statement_controller', function($scope, $http) {
    //init vars
    var today = new Date();

    var url_string = window.location.href;
    var url = new URL(url_string);

    $scope.chosenYear = url.searchParams.get("year");
    if($scope.chosenYear == null){
        $scope.chosenYear = today.getFullYear();
    }    
    $scope.chosenMonth = url.searchParams.get("month");
    $scope.dateTable = $scope.chosenYear;
    if ($scope.chosenMonth)
        $scope.dateTable += " - " + $scope.chosenMonth;

    $scope.years = [];
    for(var i = 2015; i <= today.getFullYear(); i++){
        $scope.years.push(i);
    }
    $scope.months = [{value: null, name: 'None'}, {value: 1, name: 'Jan'},{value: 2, name: 'Feb'},{value: 3, name: 'Mar'},{value: 4, name: 'Apr'},{value: 5, name: 'May'},{value: 6, name: 'Jun'},
    {value: 7, name: 'Jul'},{value: 8, name: 'Aug'},{value: 9, name: 'Sep'},{value: 10, name: 'Oct'},{value: 11, name: 'Nov'},{value: 12, name: 'Dec'}];
    
    $scope.purchases = [];

    //Functions
    $scope.chooseYear = function(year){
        $scope.chosenYear = year;        
        updateData($scope, $http);
    };
    $scope.update = function(){
        $('.month-selector input[type="radio"]').parent().removeClass('active');
        $('.month-selector input[type="radio"]:checked').parent().addClass('active');

        updateData($scope, $http);
    };
    $scope.dateFormat = function(date){
        return date.slice(0,10);
    }
    updateData($scope, $http);
});

var updateData = function($scope, $http){
    //Blur container and show spinner
    //$('#loader').show();
    //  $('.container').addClass('blur');

    var requestUrl = address + 'getDemonstracaoResultados?year=' + $scope.chosenYear;
    if ($scope.chosenMonth ) requestUrl += '&month=' + $scope.chosenMonth;
    $http.get(requestUrl).then(
        function (success) {
            incomeStatementCallback($scope, $http, success.data);
        },
        function (error){
            $scope.contents = [{heading:"Error",description:"Could not load json data"}];
        }
    );
    
}

var incomeStatementCallback = function($scope, $http, income_statement) {
    console.log(income_statement);
    
    $scope.netSales = 0;
    for (var i = 0; i < income_statement.rendimentos.length; i++) {
        var accountID = income_statement.rendimentos[i].AccountID;
        if (accountID === "71" || accountID === "72")
            $scope.netSales += income_statement.rendimentos[i].CreditMovements;
    }

    $scope.costOfGoodSold = 0;
    for (var i = 0; i < income_statement.gastos.length; i++) {
        var accountID = income_statement.gastos[i].AccountID;
        if (accountID === "61" || accountID === "62")
            $scope.costOfGoodSold += income_statement.gastos[i].DebtMovements;
    }

    $scope.grossMargin = $scope.netSales - $scope.costOfGoodSold;

    $scope.sellingGeneralAdmin = 0;
    for (var i = 0; i < income_statement.gastos.length; i++) {
        if (income_statement.gastos[i].AccountID === "63")
            $scope.sellingGeneralAdmin += income_statement.gastos[i].DebtMovements;
    }   

    $scope.depreciation = 0;
    for (var i = 0; i < income_statement.gastos.length; i++) {
        if (income_statement.gastos[i].AccountID === "64")
            $scope.depreciation += income_statement.gastos[i].DebtMovements;
    }

    $scope.interest = 0;
    for (var i = 0; i < income_statement.gastos.length; i++) {
        if (income_statement.gastos[i].AccountID === "69")
            $scope.interest += income_statement.gastos[i].DebtMovements;
    }

    $scope.totalExpenses = $scope.sellingGeneralAdmin + $scope.depreciation + $scope.interest;

    $scope.preTaxEarnings = $scope.grossMargin - $scope.totalExpenses;

    $scope.incomeTax = 0;
    for (var i = 0; i < income_statement.gastos.length; i++) {
        if (income_statement.gastos[i].AccountID === "68")
            $scope.incomeTax += income_statement.gastos[i].DebtMovements;
    }

    $scope.netEarnings = $scope.preTaxEarnings - $scope.incomeTax;

    $scope.incomes = 0;
    $scope.expenses = 0;
    for (var i = 0; i < income_statement.gastos.length; i++) 
        $scope.expenses += income_statement.gastos[i].DebtMovements;
    for (var i = 0; i < income_statement.rendimentos.length; i++) 
        $scope.incomes += income_statement.rendimentos[i].CreditMovements;
    $scope.netIncome = $scope.incomes - $scope.expenses;

    $scope.dateTable = $scope.chosenYear;
    if ($scope.chosenMonth)
        $scope.dateTable += ", " + getMonthName($scope.chosenMonth);
}

var getMonthName = function(index) {
    var monthNames = [null, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return monthNames[index]; 
}


