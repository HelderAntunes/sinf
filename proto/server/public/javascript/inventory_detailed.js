var app = angular.module('inventory_detailed_app', []).config(['$interpolateProvider', function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
  }]);

  app.filter('euro', ['$filter', function ($filter) {
    return function (input) {
      return $filter('number')(input, 2) + '€';
    };
  }]);

  app.filter('qty', ['$filter', function ($filter) {
    return function (input) {
      return $filter('number')(input, 2) + ' UN';
    };
  }]);

app.controller('inventory_detailed_controller', function($scope, $http) {
    //init vars
    var today = new Date();

    var url_string = window.location.href
    var url = new URL(url_string);

    $scope.chosenYear = url.searchParams.get("year");
    if($scope.chosenYear == null){
        $scope.chosenYear = today.getFullYear();
    }    
    $scope.chosenMonth = url.searchParams.get("month");
    
    $scope.years = [];
    for(var i = 2015; i <= today.getFullYear(); i++){
        $scope.years.push(i);
    }
    $scope.months = [{value: null, name: 'None'}, {value: 1, name: 'Jan'},{value: 2, name: 'Feb'},{value: 3, name: 'Mar'},{value: 4, name: 'Apr'},{value: 5, name: 'May'},{value: 6, name: 'Jun'},
    {value: 7, name: 'Jul'},{value: 8, name: 'Aug'},{value: 9, name: 'Sep'},{value: 10, name: 'Oct'},{value: 11, name: 'Nov'},{value: 12, name: 'Dec'}];
    
    $scope.inventory = [];

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

updateData = function($scope, $http){
    //Blur container and show spinner
    $('#loader').show();
    $('.container').addClass('blur');

    var url = 'http://localhost:49822/api/Inventory/date/' + $scope.chosenYear;
    if($scope.chosenMonth != null){
        url += '/' + $scope.chosenMonth;
    }

    $http.get(url).then(function (success){
        $scope.inventory= success.data;

        //Unblur container and hide spinner
        $('#loader').hide();
        $('.container').removeClass('blur');
    },function (error){
        $scope.contents = [{heading:"Error",description:"Could not load json data"}];
    });
}

