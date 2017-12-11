$('#sales-detailed-tab').addClass('active');

var app = angular.module('sales_detailed_app', []).config(['$interpolateProvider', function ($interpolateProvider) {
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

app.controller('sales_detailed_controller', function($scope, $http) {
    $scope.chosenYear = 2016;
    $scope.chosenMonth = null;
    $scope.years = [2015,2016,2017];
    $scope.months = [{value: null, name: 'None'},{value: 1, name: 'Jan'},{value: 2, name: 'Feb'},{value: 3, name: 'Mar'},{value: 4, name: 'Apr'},{value: 5, name: 'May'},{value: 6, name: 'Jun'},
    {value: 7, name: 'Jul'},{value: 8, name: 'Aug'},{value: 9, name: 'Sep'},{value: 10, name: 'Oct'},{value: 11, name: 'Nov'},{value: 12, name: 'Dec'}];

    $scope.chooseYear = function(year){
        $scope.chosenYear = year;        
        getTableData($scope, $http);
    };

    $scope.chooseMonth = function(month){
        $scope.chosenMonth = month;
        getTableData($scope, $http);
    };

    //Blur container and show spinner
    $('#loader').show();
    $('.container').addClass('blur');

    //ultimately creates an array with only the info needed for the table
    getTableData($scope, $http);

});


var getTableData = function($scope, $http) {
    //Blur container and show spinner
    $('#loader').show();
    $('.container').addClass('blur');

    var requestUrl = address;
    if ($scope.chosenMonth) {
        requestUrl += 'getSalesByMonth?year=' + $scope.chosenYear + '&month=' + $scope.chosenMonth;
        console.log("month");}
    else 
        requestUrl += 'getSalesByYear?year=' + $scope.chosenYear;
        

    $http.get(requestUrl).then(
        function (success) {
            var invoices = success.data;
            //Sort invoices by costumer
            $scope.invoicesSorted = sortInvoicesByCustomerID(invoices);
            //Make array with only customers and their invoices
            getCustomersAndInvoices($scope, $http);
        },
        function (error){
            $scope.contents = [{heading:"Error",description:"Could not load json data"}];
        }
    );
}

var getCustomersAndInvoices = function($scope, $http) {
    requestUrl = 'getCustomerInfo';
        
    $http.get(requestUrl).then(
        function (success) {
            var customers = success.data;
            //Match costumers with invoices
            $scope.customersAndInvoices = matchCustomersAndInvoices(customers, $scope.invoicesSorted);
            //Put all table info into one array
            console.log($scope.customersAndInvoices);
            makeArrayWithTableData($scope);
        },
        function (error){
            var contents = [{heading:"Error",description:"Could not load json data"}];
        }
    );
}

var makeArrayWithTableData = function($scope) {

    $scope.detailedTableData = [];
    var d = 0;
    //= $scope.customersAndInvoices.map( function( customerWithInvoices ) {
    for(var c = 0; c < $scope.customersAndInvoices.length; c++){
        var customerWithInvoices = $scope.customersAndInvoices[c];
        
        var customerUsefulArray = [];
        var companyName = customerWithInvoices[0].company_name;
        var totalValue = 0;
        var pIndex = 0;
        var numProducts = 0;
        var pInfo = [];

        //customer invoices
        var invoices = customerWithInvoices[1];
        for(var i = 0; i < invoices.length; i++){
            
            var pTotalPrice = 0;
            var pDescription = 0;
            var pQuantity = 0;
            var pUnitPrice = 0;
            var pDate = 0;

            var products = invoices[i].Lines;
            numProducts += products.length;

            totalValue += invoices[i].NetTotal;
            //decimal places
            totalValue = +totalValue.toFixed(2);

            for(var p = 0; p < products.length; p++){
                pDescription = products[p].productDescprition;
                pQuantity = products[p].quantity;
                pUnitPrice = products[p].unitPrice;

                pTotalPrice = pUnitPrice * pQuantity; 
                pTotalPrice = +pTotalPrice.toFixed(2);

                pDate = dateFormat(invoices[i].InvoiceDate);

                var newProductInfo = [pTotalPrice,
                                        pDescription,
                                        pQuantity,
                                        pUnitPrice,
                                        pDate];

                pInfo[pIndex] = newProductInfo;
                pIndex++;
            }        
        }


        if(totalValue != 0){

            var productsSortedByDate = sortProductsByDate(pInfo);

            customerUsefulArray = [companyName,
                                    totalValue, 
                                    numProducts,
                                    productsSortedByDate];

            //var sortedByDateArray = sortProductsByDate(customerUsefulArray);

            $scope.detailedTableData[d] = customerUsefulArray;
            d++;
            
        }

    }
    //Unblur container and hide spinner
    $('#loader').hide();
    $('.container').removeClass('blur');

}
var matchCustomersAndInvoices = function(customers, invoicesSorted) {
    //go through customers
    var namedInvoices = customers.map( function( customer ) {
        var customerInvoices = [];   
        var index = 0;

        //go through invoices
        invoicesSorted.find((invoice, i) => {
            //save this customer's invoices into array
            if (invoice.CustomerID === customer.customer_id) {
                customerInvoices[index] = invoice;
                index++;
            }
        });
        index = 0;
        
        //put together customer and invoices and return that
        var allInvoicesToMapToThisCustomer = [customer, customerInvoices];
        return allInvoicesToMapToThisCustomer;
    } ); 

    //[customer, [all their invoices]]
    return namedInvoices;
}

var sortInvoicesByCustomerID = function(invoices) {
    function byEntity(a,b) {
        return a.CustomerID.localeCompare(b.CustomerID);
    }
    invoices.sort(byEntity);
    return invoices;
}

var sortProductsByDate = function(customerUsefulArray){
    function byDate(a,b) {
        return a[4].localeCompare(b[4]);
    }
    customerUsefulArray.sort(byDate).reverse();
    return customerUsefulArray;
}

var getArrayWithLegthOfProducts = function(numProds){
    console.log("Workaround returning " + numProds);
    return new Array[numProds];
}

var daysInMonth = function(year, month) {
    return new Date(year, month, 0).getDate();
}

var getArrayWithDays = function(numDays) {
    var days = [];
    for (var i = 1; i <= numDays; i++) days.push(i);
    return days;
}

var getMonthName = function(index) {
    var monthNames = [null, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return monthNames[index]; 
}

var dateFormat = function(date){
        return date.slice(0,10);
    }
