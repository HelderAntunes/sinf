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

                var balancete = utils.calcBalancete(transactions, accounts);
                res.json(balancete);
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
                var demonstracaoResultados = {'gastos':[], 'rendimentos': []};
                var netIncome = 0;
                var netExpense = 0;

                for (var i = 0; i < balancete.length; i++) {
                    if (balancete[i].AccountID.length != 2)
                        continue;

                    if (balancete[i].AccountID[0] == '6') 
                        demonstracaoResultados.gastos.push(balancete[i]);
                    if (balancete[i].AccountID[0] == '7')
                        demonstracaoResultados.rendimentos.push(balancete[i]);
                }
                
                for (var i = 0; i < demonstracaoResultados.gastos.length; i++)
                    netExpense += demonstracaoResultados.gastos[i].DebtMovements;
                for (var i = 0; i < demonstracaoResultados.rendimentos.length; i++)
                    netIncome += demonstracaoResultados.rendimentos[i].CreditMovements;
                
                demonstracaoResultados['netIncome'] = netIncome;
                demonstracaoResultados['netExpense'] = netExpense;
                demonstracaoResultados['netResult'] = netIncome - netExpense;

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
                var balanco = {
                    'assets':{
                        'accounts': [],
                        'value': 0,
                    },
                    'liabilities': {
                        'accounts': [],
                        'value': 0,
                    },
                    'equity': {
                        'accounts': [],
                        'value': 0,
                    },
                };

                for (var i = 0; i < balancete.length; i++) {

                    if (balancete[i].AccountID.length != 2 || 
                        balancete[i].AccountID[0] === '6' ||
                        balancete[i].AccountID[0] === '7' ||
                        balancete[i].AccountID[0] === '8' ||
                        balancete[i].AccountID[0] === '9') 
                        continue;
                        
                    balancete[i].ClosingDebitBalance = balancete[i].OpeningDebitBalance + balancete[i].DebtMovements;
                    balancete[i].ClosingCreditBalance = balancete[i].OpeningCreditBalance + balancete[i].CreditMovements;

                    if (balancete[i].ClosingDebitBalance > balancete[i].ClosingCreditBalance) {
                        balancete[i].ClosingDebitBalance = balancete[i].ClosingDebitBalance - balancete[i].ClosingCreditBalance;
                        balancete[i].ClosingCreditBalance = 0;
                        balanco.assets.accounts.push(balancete[i])
                        balanco.assets.value += balancete[i].ClosingDebitBalance;
                    }
                    else {
                        balancete[i].ClosingCreditBalance = balancete[i].ClosingCreditBalance - balancete[i].ClosingDebitBalance;
                        balancete[i].ClosingDebitBalance = 0;
                        balanco.liabilities.accounts.push(balancete[i]);
                        balanco.liabilities.value += balancete[i].ClosingCreditBalance;
                    }
                }
                balanco.equity.value = balanco.assets.value - balanco.liabilities.value;
                res.json(balanco);
        });
    });
});



var server = app.listen(8081, function () {
   var port = server.address().port;
   console.log("Listening at port %s", port)
});