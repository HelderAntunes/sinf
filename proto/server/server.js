var fs = require('fs'); 
var jSmart = require('jsmart'); 
var express = require('express');
var utils = require('./utils');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

// PAGES
var sales = require('./pages/sales');
var purchases = require('./pages/purchases');
var inventory = require('./pages/inventory');
var finances = require('./pages/finances');
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
                var debitLines = utils.getDebtLinesFromTransactions(transactions);
                var creditLines = utils.getCreditLinesFromTransactions(transactions); 
                console.log(debitLines);

                for (var i = 0; i < accounts.length; i++) {
                    accounts[i]['DebtMovements'] = 0;
                    accounts[i]['CreditMovements'] = 0;
                }
                
                for (var j = 0; j < creditLines.length; j++) {
                    var accountID = creditLines[j].AccountID;
                    var creditAmount = creditLines[j].CreditAmount;

                    for (var k = 0; k < accounts.length; k++) 
                        if (accounts[k].AccountID == accountID)
                            accounts[k]['CreditMovements'] += creditAmount;
                }

                for (var j = 0; j < debitLines.length; j++) {
                    var accountID = debitLines[j].AccountID;
                    var debitAmount = debitLines[j].DebitAmount;

                    for (var k = 0; k < accounts.length; k++)
                        if (accounts[k].AccountID == accountID)
                            accounts[k]['DebtMovements'] += debitAmount;
                }
            
                accounts = accounts.sort(utils.compareAccountsIdDec);
                for (var i = 0; i < accounts.length; i++) {
                    var accountID1 = accounts[i].AccountID;
                    for (var j = i+1; j < accounts.length; j++) {
                        var accountID2 = accounts[j].AccountID;
                        if (utils.isSubString(accountID2, accountID1)) {
                            accounts[j]['DebtMovements'] += accounts[i]['DebtMovements'];
                            accounts[j]['CreditMovements'] += accounts[i]['CreditMovements'];
                            break;
                        }
                    }
                }
                
                res.json(accounts);
        });
    });

});


var server = app.listen(8081, function () {
   var port = server.address().port;
   console.log("Listening at port %s", port)
});