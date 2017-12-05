function PagerService() {
    // service definition
    var service = {};
 
    service.GetPager = GetPager;
 
    return service;
 
    // service implementation
    function GetPager(totalItems, currentPage, pageSize) {
        // default to first page
        currentPage = currentPage || 1;
 
        // default page size is 10
        pageSize = pageSize || 10;
 
        // calculate total pages
        var totalPages = Math.ceil(totalItems / pageSize);
 
        var startPage, endPage;
        if (totalPages <= 10) {
            // less than 10 total pages so show all
            startPage = 1;
            endPage = totalPages;
        } else {
            // more than 10 total pages so calculate start and end pages
            if (currentPage <= 6) {
                startPage = 1;
                endPage = 10;
            } else if (currentPage + 4 >= totalPages) {
                startPage = totalPages - 9;
                endPage = totalPages;
            } else {
                startPage = currentPage - 5;
                endPage = currentPage + 4;
            }
        }
 
        // calculate start and end item indexes
        var startIndex = (currentPage - 1) * pageSize;
        var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
 
        // create an array of pages to ng-repeat in the pager control
        var pages = _.range(startPage, endPage + 1);
 
        // return object with all pager properties required by the view
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    }
}

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
        $scope.purchases = success.data

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
    $scope.purchases=[];
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
    var pager_service = PagerService();
    $scope.pager = null;

    $scope.$watch('step', function() {
        console.log(pager_service);
        if($scope.step == 3){                    
            //Unblur container and hide spinner
            $('#loader').hide();
            $('.container').removeClass('blur');

            //Join purchases and sales and order by date
            $scope.transactions= $scope.sales.concat($scope.purchases);
            $scope.transactions.sort(function(a,b) {return (a.DocumentDate < b.DocumentDate) ? 1 : ((b.DocumentDate < a.DocumentDate) ? -1 : 0);} );
            
            // get pager object from service
            $scope.pager = pager_service.GetPager($scope.transactions.length, 1);
            $scope.setPage(1);
        }
    });

    $scope.setPage = function(page) {
        if (page < 1 || page > $scope.pager.totalPages) {
            return;
        }
        
        // get pager object from service
        $scope.pager = pager_service.GetPager($scope.transactions.length, page);
        // get current page of items
        $scope.page = $scope.transactions.slice($scope.pager.startIndex, $scope.pager.endIndex + 1);
    };

    updateData($scope, $http);
});
