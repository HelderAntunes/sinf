var app = angular.module('purchases_detailed_app', []).config(['$interpolateProvider', function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
  }]);

app.controller('purchases_detailed_controller', function($scope, $http) {
    //init vars
    var today = new Date();

    $scope.chosenYear = today.getFullYear();
    $scope.chosenMonth = null;
    
    $scope.years = [];
    for(var i = 2015; i <= today.getFullYear(); i++){
        $scope.years.push(i);
    }
    $scope.months = [{value: null, name: 'None'},{value: 1, name: 'Jan'},{value: 2, name: 'Feb'},{value: 3, name: 'Mar'},{value: 4, name: 'Apr'},{value: 5, name: 'May'},{value: 6, name: 'Jun'},
    {value: 7, name: 'Jul'},{value: 8, name: 'Aug'},{value: 9, name: 'Sep'},{value: 10, name: 'Oct'},{value: 11, name: 'Nov'},{value: 12, name: 'Dec'}];
    
    $scope.purchases = [];


    //Functions
    $scope.chooseYear = function(year){
        $scope.chosenYear = year;        
        updateData($scope, $http);
    };
    $scope.chooseMonth = function(month){
        $scope.chosenMonth = month;
        updateData($scope, $http);
    };
    $scope.dateFormat = function(date){
        return date.slice(0,10);
    }
   
    updateData($scope, $http);
});

updateData = function($scope, $http){
    var url = 'http://localhost:49822/api/Purchases/date/' + $scope.chosenYear;
    if($scope.chosenMonth != null){
        url += '/' + $scope.chosenMonth;
    }

    $http.get(url).then(function (success){
        $scope.purchases= success.data;
    },function (error){
        $scope.contents = [{heading:"Error",description:"Could not load json data"}];
    });
}

