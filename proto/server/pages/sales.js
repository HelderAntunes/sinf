var fs = require('fs'); 
var jSmart = require('jsmart'); 
var utils = require('../utils');

var Customer = require('../database/Customer');
var Sales = require('../database/Sales');

exports.getSales = function (req, res) {
    
    Customer.find({}, function(err, customers) {
        if (err) throw err;

        Sales.SalesInvoices.find({}, function(err, salesInvoices) {

            customers = setCustomerSales(customers, salesInvoices);
            customers.sort(compareCustomersBySalesDec);

            res.writeHead(200, {'Content-Type': 'text/html'});
            
            var headerTpl = fs.readFileSync('./templates/common/header.html', {encoding: 'utf-8'});
            var compiledTemplate = new jSmart(headerTpl);
            var outputHeader = compiledTemplate.fetch({ title: 'Sales Dashboard'});
        
            var salesTpl = fs.readFileSync('./templates/sales.html', {encoding: 'utf-8'});
            compiledTemplate = new jSmart(salesTpl);
            var outputSales = compiledTemplate.fetch({
                totalSales: getTotalSales(salesInvoices),
                period: 'year',
                salesPerPeriod: utils.formatNumber(25),
                costumerNames: getTopCustomersNames(customers, 5),
                costumerSales: getTopCustomersSales(customers, 5),
            });
            
            var footerTpl = fs.readFileSync('./templates/common/footer.html', {encoding: 'utf-8'});
            compiledTemplate = new jSmart(footerTpl);
            var outputFooter = compiledTemplate.fetch();
            
            res.end(outputHeader + outputSales + outputFooter);

        });
        
    });

}

function getTotalSales(salesInvoices) {
    var totalSales = 0;
    for (var i = 0; i < salesInvoices.length; i++) 
        totalSales += salesInvoices[i]['GrossTotal'];
    return utils.formatNumber(Math.round(totalSales));
}

function getTopCustomersNames(customers, topSize) {
    var customersNames = [];
    for (var i = 0; i < customers.length && i < topSize; i++) 
        customersNames.push(customers[i].company_name);
    return customersNames;
}

function getTopCustomersSales(customers, topSize) {
    var customersSales = [];
    for (var i = 0; i < customers.length && i < topSize; i++) 
        customersSales.push(utils.formatNumber(Math.round(customers[i].sales)));
    return customersSales;
}

// TODO: precalculate this in saft_parser, it is too bad.
function setCustomerSales(customers, salesInvoices) {
    for (var i = 0; i < customers.length; i++) 
    for (var j = 0; j < salesInvoices.length; j++) 
        if (salesInvoices[j].CustomerID == customers[i].customer_id) {
            if (customers[i]['sales'] == null) customers[i]['sales'] = salesInvoices[j]['GrossTotal'];
            else customers[i]['sales'] += salesInvoices[j]['GrossTotal'];
            //console.log(customers[i]);
        }

    return customers;
}

// decreasing order
function compareCustomersBySalesDec(a,b) {
  if (a.sales < b.sales) return 1;
  if (a.sales > b.sales) return -1;
  return 0;
}