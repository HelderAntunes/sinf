/*$(document).ready(function () {
    $.getJSON('http://localhost:49822/api/Purchases/all', function(data) {
        console.log(data);
    });
});
*/
var app = angular.module('purchases_detailed_app', []).config(['$interpolateProvider', function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
  }]);
app.controller('purchases_detailed_controller', function($scope, $http) {
    $scope.purchases = [];
    $scope.dateFormat = function(date){
        return date.slice(0,10);
    }
    $http.get('http://localhost:49822/api/Purchases/all').then(function (success){
        $scope.purchases= success.data;
        console.log($scope);
    },function (error){
        $scope.contents = [{heading:"Error",description:"Could not load json   data"}];
        console.log($scope);
    });
});

/*$.getJSON('http://localhost:49822/api/Purchases/all', function(data) {
    console.log(2);
    app.controller('purchases_detailed_controller', function($scope) {
        console.log($scope);
        $scope.data = data;
        console.log($scope);
    });
});

//*/

//var app = angular.module('purchases_detailed_app', []);
