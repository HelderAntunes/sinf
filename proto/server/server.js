var fs = require('fs'); 
var jSmart = require('jsmart'); 
var express = require('express');
var utils = require('./utils');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

// PAGES
var sales = require('./pages/sales');
var purchases = require('./pages/purchases');
var main = require('./pages/main');

var app = express();
var addr = 'http://localhost:8081/';

app.set('json spaces', 2);
app.use(express.static(__dirname + '/public')); // css and javascript files are public files

app.get('/', function (req, res) {
    res.redirect(addr + 'main');
});

app.get('/main', function (req, res) {
    main.getMain(req, res);
});

app.get('/sales', function (req, res) {
    sales.getSales(req, res);
});

app.get('/finances', function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    
    var tpl = fs.readFileSync('./templates/finances.html', {encoding: 'utf-8'});
    var compiledTemplate = new jSmart(tpl);
    var output = compiledTemplate.fetch();
    
    res.end(output);
});

app.get('/inventory', function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    
    var tpl = fs.readFileSync('./templates/inventory.html', {encoding: 'utf-8'});
    var compiledTemplate = new jSmart(tpl);
    var output = compiledTemplate.fetch();
    
    res.end(output);
});

app.get('/purchases', function (req, res) {
    purchases.getPurchases(req, res);
});

app.get('/purchases_detailed', function (req, res) {
    purchases.getPurchasesDetailed(req, res);
});

app.get('/getSalesByMonth', function(req, res) {
    var month = req.query.month, year = req.query.year;
    var dataRange = utils.getMonthDateRange(year, month);
    var Sales = require('./database/Sales');

    Sales.SalesInvoices.find({
        InvoiceDate: {
            $gte: dataRange.start,
            $lt: dataRange.end },
        InvoiceType: {$in: ['FT', 'VD']},
        }, 
        function (err, salesInvoices) {
            if (err) return console.error(err);
            res.json(salesInvoices);
        }
    );
});

app.get('/getSalesByYear', function(req, res) {
    var year = req.query.year;
    var dataRange = utils.getYearDateRange(year);

    var Sales = require('./database/Sales');
    Sales.SalesInvoices.find({
        InvoiceDate: {
            $gte: dataRange.start,
            $lt: dataRange.end }}, 
        function (err, salesInvoices) {
            if (err) console.error(err);
            else res.json(salesInvoices);
        }
    );
});

app.get('/getCustomers', function(req, res) {
    var month = req.query.month, year = req.query.year;
    var dataRange = month == null ? utils.getYearDateRange(year) : utils.getMonthDateRange(year, month);

    var Customer = require('./database/Customer');
    var Sales = require('./database/Sales');
    
    Customer.find({}, function(err, customers) {
        if (err) console.error(err);

        Sales.SalesInvoices.find({
            InvoiceDate: {
                $gte: dataRange.start,
                $lt: dataRange.end }}, 
            function(err, salesInvoices) {
                if (err) console.error(err);
                
                customers = utils.setCustomerSales(JSON.parse(JSON.stringify(customers)), 
                            JSON.parse(JSON.stringify(salesInvoices)))
                            .sort(utils.compareCustomersBySalesDec);
                res.json(customers);
        });
    });
});

var server = app.listen(8081, function () {
   var port = server.address().port;
   console.log("Listening at port %s", port)
});