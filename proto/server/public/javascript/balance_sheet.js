var app = angular.module('balance_sheet_app', []).config(['$interpolateProvider', function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
  }]);

  app.filter('euro', ['$filter', function ($filter) {
    return function (input) {
      return $filter('number')(input, 2) + '€';
    };
  }]);

app.controller('balance_sheet_controller', function($scope, $http) {
    //init vars
    var today = new Date();

    var url_string = window.location.href
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
        updateData($scope, $http);
    };
    $scope.dateFormat = function(date){
        return date.slice(0,10);
    }
    updateData($scope, $http);
});

var updateData = function($scope, $http){
    //Blur container and show spinner
    $('#loader').show();
    $('.container').addClass('blur');

    var requestUrl = address + 'getBalanco?year=' + $scope.chosenYear;
    if ($scope.chosenMonth ) requestUrl += '&month=' + $scope.chosenMonth;
    $http.get(requestUrl).then(
        function (success) {
            balanceSheetCallback($scope, $http, success.data);
            
            //Unblur container and hide spinner
            $('#loader').hide();
            $('.container').removeClass('blur');
        },
        function (error){
            $scope.contents = [{heading:"Error",description:"Could not load json data"}];
        }
    );
}

var balanceSheetCallback = function($scope, $http, balanceSheet) {
    console.log(balanceSheet);

    var currAssets = balanceSheet.assets.curr;
    var nonCurrAssets = balanceSheet.assets.nonCurr;
    $scope.cashAndBankDeposits = currAssets.cashAndBankDeposits;
    $scope.inventory = currAssets.inventory;
    $scope.clients = currAssets.clients;
    $scope.stateAndOtherPubEntAssets = currAssets.stateAndOtherPubEntAssets;
    $scope.otherCurrAssets = currAssets.otherCurrAssets;
    $scope.totalCurrAssets = currAssets.totalCurrAssets;
    $scope.shareholders_partners = nonCurrAssets.shareholders_partners;
    $scope.tangibleFixedAssets = nonCurrAssets.tangibleFixedAssets;
    $scope.otherNonCurrAssets = nonCurrAssets.otherNonCurrAssets;
    $scope.totalNonCurrAssets = nonCurrAssets.totalNonCurrAssets;

    var liabilities = balanceSheet.liabilities;
    $scope.suppliers = liabilities.suppliers;
    $scope.customerDownPayment = liabilities.customerDownPayment;
    $scope.stateAndOtherPubEntAssetsLiabilities = liabilities.stateAndOtherPubEntAssetsLiabilities;
    $scope.otherLiabilities = liabilities.otherLiabilities;
    $scope.totalLiabilities = liabilities.value;
    
    $scope.assets = balanceSheet.assets.value;
    $scope.liabilities = balanceSheet.liabilities.value;
    $scope.equity = balanceSheet.equity.value;
}

var getMonthName = function(index) {
    var monthNames = [null, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return monthNames[index]; 
}
