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

    
}

