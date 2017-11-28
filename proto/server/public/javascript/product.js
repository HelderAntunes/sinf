var updateInfo= function($scope, $http){
    var id = $('#id-input').val(); 
    var url = 'http://localhost:49822/api/Inventory/' + id + '/';
    
    $http.get(url).then(function (success){
        console.log(success.data);
        var article = success.data[0];
        $scope.name = article.Description;
        $scope.family = article.Family;
        $scope.subfamily = article.SubFamily;
        $scope.minStock = article.MinStock;
        $scope.actStock = article.CurrentStock;

        $scope.step++;
    },function (error){
        $scope.contents = [{heading:"Error",description:"Could not load json data"}];
    });
}

var updateTransactions= function($scope, $http){
    var id = $('#id-input').val(); 
    var url = 'http://localhost:49822/api/Purchases/' + id + '/';
    
    $http.get(url).then(function (success){
        console.log(success.data);
        $scope.transactions = success.data

        $scope.step++;
    },function (error){
        $scope.contents = [{heading:"Error",description:"Could not load json data"}];
    });
}

var updateSales= function($scope, $http){
    var id = $('#id-input').val(); 
    var url = 'http://localhost:49822/api/DocVenda/' + id + '/';
    
    $http.get(url).then(function (success){
        console.log(success.data);
        $scope.sales = success.data

        $scope.step++;
    },function (error){
        $scope.contents = [{heading:"Error",description:"Could not load json data"}];
    });
}

var updateData= function($scope, $http){
    $scope.step = 0

    $scope.transactions=[];
    $scope.sales=[];

    //Blur container and show spinner
    $('#loader').show();
    $('.container').addClass('blur');
    
    updateInfo($scope, $http);
    updateTransactions($scope, $http);
    updateSales($scope, $http);
}

var app = angular.module('product_app', []).config(['$interpolateProvider', function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
}]);

app.filter('euro', ['$filter', function ($filter) {
    return function (input) {
      return $filter('number')(input, 2) + '€';
    };
}]);

app.controller('product_controller', function($scope, $http) {
    $scope.$watch('step', function() {
        if($scope.step == 3){                    
            //Unblur container and hide spinner
            $('#loader').hide();
            $('.container').removeClass('blur');
        }
    });

    updateData($scope, $http);
});
