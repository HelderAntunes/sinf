var fs = require('fs'); 
var jSmart = require('jsmart'); 
var express = require('express');
var utils = require('./utils');
var moment = require('moment');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

// PAGES
var sales = require('./pages/sales');
var purchases = require('./pages/purchases');
var inventory = require('./pages/inventory');
var finances = require('./pages/finances');
var product = require('./pages/product');
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
    finances.getFinances(req, res);
});

app.get('/inventory', function (req, res) {
    inventory.getInventory(req, res);
});

app.get('/inventory_detailed', function (req, res) {
    inventory.getInventoryDetailed(req, res);
});

app.get('/purchases', function (req, res) {
    purchases.getPurchases(req, res);
});

app.get('/purchases_detailed', function (req, res) {
    purchases.getPurchasesDetailed(req, res);
});

app.get('/product/:id', function (req, res) {
    console.log(req.params.id);
    console.log(__dirname);
    product.getMain(req, res);
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

app.get('/getTransactionsAndAccounts', function(req, res) {
    var month = req.query.month, year = req.query.year;
    var dataRange = month == null ? utils.getYearDateRange(year) : utils.getMonthDateRange(year, month);
    
    var Transaction = require('./database/Transaction');
    var Account = require('./database/Account');

    Account.find({}, function(err, accounts) {
        if (err) console.error(err);

        Transaction.Transaction.find({
            TransactionDate: {
                $gte: dataRange.start,
                $lt: dataRange.end }}, 
            function(err, transactions) {
                if (err) {
                    console.error(err);
                    return;
                }

                accounts = JSON.parse(JSON.stringify(accounts));
                transactions = JSON.parse(JSON.stringify(transactions));

                var transactionsAndAccounts = {
                    'transactions': transactions,
                    'accounts': accounts,
                }
                res.json(transactionsAndAccounts);
        });
    });

});

app.get('/getBalancete', function(req, res) {
    var month = req.query.month, year = req.query.year;
    var dataRange = month == null ? utils.getYearDateRange(year) : utils.getMonthDateRange(year, month);
    
    var Transaction = require('./database/Transaction');
    var Account = require('./database/Account');

    Account.find({}, function(err, accounts) {
        if (err) console.error(err);

        Transaction.Transaction.find({
            TransactionDate: {
                $gte: dataRange.start,
                $lt: dataRange.end }}, 
            function(err, transactions) {
                if (err) {
                    console.error(err);
                    return;
                }

                accounts = JSON.parse(JSON.stringify(accounts));
                transactions = JSON.parse(JSON.stringify(transactions));

                var balancete = utils.calcBalancete(transactions, accounts);
                res.json(balancete);
        });
    });

});

app.get('/getBalancetes', function(req, res) {
    var month = req.query.month, year = req.query.year;
    var dataRange = month == null ? utils.getYearDateRange(year) : utils.getMonthDateRange(year, month);
    
    var Transaction = require('./database/Transaction');
    var Account = require('./database/Account');

    Account.find({}, function(err, accounts) {
        if (err) console.error(err);

        Transaction.Transaction.find({
            TransactionDate: {
                $gte: dataRange.start,
                $lt: dataRange.end }}, 
            function(err, transactions) {
                if (err) {
                    console.error(err);
                    return;
                }

                accounts = JSON.parse(JSON.stringify(accounts));
                transactions = JSON.parse(JSON.stringify(transactions));
                
                var balancetes = utils.calcBalancetes(transactions, accounts, year, month);
                res.json(balancetes);
        });
    });

});

app.get('/getDemonstracaoResultados', function(req, res) {
    var month = req.query.month, year = req.query.year;
    var dataRange = month == null ? utils.getYearDateRange(year) : utils.getMonthDateRange(year, month);

    var Transaction = require('./database/Transaction');
    var Account = require('./database/Account');

    Account.find({}, function(err, accounts) {
        if (err) console.error(err);

        Transaction.Transaction.find({
            TransactionDate: {
                $gte: dataRange.start,
                $lt: dataRange.end }}, 
            function(err, transactions) {
                if (err) {
                    console.error(err);
                    return;
                }

                accounts = JSON.parse(JSON.stringify(accounts));
                transactions = JSON.parse(JSON.stringify(transactions));

                var balancete = utils.calcBalancete(transactions, accounts);
                var demonstracaoResultados = utils.calcDemonstracaoResultados(balancete);

                res.json(demonstracaoResultados);
        });
    });
});

app.get('/getBalanco', function(req, res) {
    var month = req.query.month, year = req.query.year;
    var dataRange = month == null ? utils.getYearDateRange(year) : utils.getMonthDateRange(year, month);

    var Transaction = require('./database/Transaction');
    var Account = require('./database/Account');

    Account.find({}, function(err, accounts) {
        if (err) console.error(err);

        Transaction.Transaction.find({
            TransactionDate: {
                $gte: dataRange.start,
                $lt: dataRange.end }}, 
            function(err, transactions) {
                if (err) {
                    console.error(err);
                    return;
                }

                accounts = JSON.parse(JSON.stringify(accounts));
                transactions = JSON.parse(JSON.stringify(transactions));
                var balancete = utils.calcBalancete(transactions, accounts);
                var balanco = utils.calcBalanco(balancete);
                res.json(balanco);
        });
    });
});

app.get('/getBalancos', function(req, res) {
    var month = req.query.month, year = req.query.year;
    var dataRange = month == null ? utils.getYearDateRange(year) : utils.getMonthDateRange(year, month);

    var Transaction = require('./database/Transaction');
    var Account = require('./database/Account');

    Account.find({}, function(err, accounts) {
        if (err) console.error(err);

        Transaction.Transaction.find({
            TransactionDate: {
                $gte: dataRange.start,
                $lt: dataRange.end }}, 
            function(err, transactions) {
                if (err) {
                    console.error(err);
                    return;
                }

                accounts = JSON.parse(JSON.stringify(accounts));
                transactions = JSON.parse(JSON.stringify(transactions));
                var balancetes = utils.calcBalancetes(transactions, accounts, year, month);
                
                var balancos = [];
                for (var i = 0; i < balancetes.length; i++) 
                    balancos.push(utils.calcBalanco(balancetes[i]));
                
                res.json(balancos);
        });
    });
});

var server = app.listen(8081, function () {
   var port = server.address().port;
   console.log("Listening at port %s", port)
});