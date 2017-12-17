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

app.get('/sales_detailed', function (req, res) {
    sales.getSalesDetailed(req, res);
});

app.get('/finances', function (req, res) {
    finances.getFinances(req, res);
});

app.get('/income_statement', function(req, res) {
    finances.getIncomeStatment(req, res);
});

app.get('/balance_sheet', function(req, res) {
    finances.getBalanceSheet(req, res);
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

app.get('/getCustomerInfo', function(req, res) {
    var Customer = require('./database/Customer');

    Customer.find({}, function(err, customers) {
        if (err) console.error(err);
        customers = JSON.parse(JSON.stringify(customers));
        res.json(customers);
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
                var dr = utils.calcDemonstracaoResultados(balancete);

                dr.netSales = 0;
                for (var i = 0; i < dr.rendimentos.length; i++) {
                    var accountID = dr.rendimentos[i].AccountID;
                    if (accountID === "71" || accountID === "72")
                        dr.netSales += dr.rendimentos[i].CreditMovements;
                }

                dr.costOfGoodSold = 0;
                for (var i = 0; i < dr.gastos.length; i++) {
                    var accountID = dr.gastos[i].AccountID;
                    if (accountID === "61" || accountID === "62")
                        dr.costOfGoodSold += dr.gastos[i].DebtMovements;
                }

                dr.grossMargin = dr.netSales - dr.costOfGoodSold;

                dr.sellingGeneralAdmin = 0;
                for (var i = 0; i < dr.gastos.length; i++) {
                    if (dr.gastos[i].AccountID === "63")
                        dr.sellingGeneralAdmin += dr.gastos[i].DebtMovements;
                }   

                dr.depreciation = 0;
                for (var i = 0; i < dr.gastos.length; i++) {
                    if (dr.gastos[i].AccountID === "64")
                        dr.depreciation += dr.gastos[i].DebtMovements;
                }

                dr.interest = 0;
                for (var i = 0; i < dr.gastos.length; i++) {
                    if (dr.gastos[i].AccountID === "69")
                        dr.interest += dr.gastos[i].DebtMovements;
                }

                dr.totalExpenses = dr.sellingGeneralAdmin + dr.depreciation + dr.interest;

                dr.preTaxEarnings = dr.grossMargin - dr.totalExpenses;

                dr.incomeTax = 0;
                for (var i = 0; i < dr.gastos.length; i++) {
                    if (dr.gastos[i].AccountID === "68")
                        dr.incomeTax += dr.gastos[i].DebtMovements;
                }

                dr.netEarnings = dr.preTaxEarnings - dr.incomeTax;

                dr.incomes = 0;
                dr.expenses = 0;
                for (var i = 0; i < dr.gastos.length; i++) 
                    dr.expenses += dr.gastos[i].DebtMovements;
                for (var i = 0; i < dr.rendimentos.length; i++) 
                    dr.incomes += dr.rendimentos[i].CreditMovements;
                dr.netIncome = dr.incomes - dr.expenses;

                res.json(dr);
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
                var balancetes = utils.calcCumulativeBalancetes(transactions, accounts, year, month);
                
                var balancos = [];
                for (var i = 0; i < balancetes.length; i++) 
                    balancos.push(utils.calcBalanco(balancetes[i]));
                
                res.json(balancos);
        });
    });
});

app.get('/getSalesByProductGroup', function (req, res) {
    var month = req.query.month, year = req.query.year;
    var dataRange = month == null ? utils.getYearDateRange(year) : utils.getMonthDateRange(year, month);

    var Sales = require('./database/Sales');

    Sales.SalesInvoices.find({
        InvoiceDate: {
            $gte: dataRange.start,
            $lt: dataRange.end },
        InvoiceType: {$in: ['FT', 'VD']},
        }, 
        function (err, salesInvoices) {
            if (err) return console.error(err);

            Sales.Product.find({}, function (err, products) {
                salesInvoices = JSON.parse(JSON.stringify(salesInvoices));
                products = JSON.parse(JSON.stringify(products));

                for (var i = 0; i < products.length; i++) {
                    products[i]['itemsSelled'] = 0;
                }

                for (var i = 0; i < salesInvoices.length; i++) {
                    var lines = salesInvoices[i].Lines;
                    
                    for (var j = 0; j < lines.length; j++) {
                        var productCode = lines[j].productCode;
                        var quantity = parseInt(lines[j].quantity);

                        for (var k = 0; k < products.length; k++) 
                            if (products[k].ProductCode == productCode) 
                                products[k]['itemsSelled'] += quantity;
                    }
                }

                var productGroups = [];
                for (var i = 0; i < products.length; i++) {
                    var found = false;
                    for (var j = 0; j < productGroups.length; j++) 
                        if (productGroups[j]['name'] == products[i].ProductGroup) {
                            found = true;
                            break;
                        }
                    if (found) continue;

                    productGroups.push({'name': products[i].ProductGroup, 'itemsSelled': 0});
                }

                for (var i = 0; i < products.length; i++) {
                    if (products[i]['itemsSelled'] > 0) {
                        var productGroup = products[i].ProductGroup;

                        for (var j = 0; j < productGroups.length; j++) 
                            if (productGroups[j]['name'] == products[i].ProductGroup) 
                                productGroups[j]['itemsSelled'] += products[i].itemsSelled;
                    }
                }

                productGroups = productGroups.sort(utils.compareProductGroupBySalesDec);
                res.json(productGroups);
            });
        });
});

app.get('/getSalesByProduct', function (req, res) {
    var month = req.query.month, year = req.query.year;
    var dataRange = month == null ? utils.getYearDateRange(year) : utils.getMonthDateRange(year, month);

    var Sales = require('./database/Sales');

    Sales.SalesInvoices.find({
        InvoiceDate: {
            $gte: dataRange.start,
            $lt: dataRange.end },
        InvoiceType: {$in: ['FT', 'VD']},
        }, 
        function (err, salesInvoices) {
            if (err) return console.error(err);

            Sales.Product.find({}, function (err, products) {
                salesInvoices = JSON.parse(JSON.stringify(salesInvoices));
                products = JSON.parse(JSON.stringify(products));

                for (var i = 0; i < products.length; i++) {
                    products[i]['itemsSelled'] = 0;
                }

                for (var i = 0; i < salesInvoices.length; i++) {
                    var lines = salesInvoices[i].Lines;
                    
                    for (var j = 0; j < lines.length; j++) {
                        var productCode = lines[j].productCode;
                        var quantity = parseInt(lines[j].quantity);

                        for (var k = 0; k < products.length; k++) 
                            if (products[k].ProductCode == productCode) 
                                products[k]['itemsSelled'] += quantity;
                    }
                }

                products = products.sort(utils.compareProductGroupBySalesDec);
                res.json(products);
            });
        });
});

app.get('/getSalesOfProduct', function (req, res) {
    var code = req.query.code;
    var sales = [];

    var Sales = require('./database/Sales');
    var Customer = require('./database/Customer');

    Sales.SalesInvoices.find({
        InvoiceType: {$in: ['FT', 'VD']},
        }, 
        function (err, salesInvoices) {
            if (err) return console.error(err);

            Sales.Product.find({
                ProductCode: ""+code
            }, function (err, products) {
                if (err) console.error(err);

                Customer.find({}, function(err, customers) {
                    if (err) console.error(err);
                    
                    products = JSON.parse(JSON.stringify(products));
                    customers = JSON.parse(JSON.stringify(customers));
                    
                    var customer_map = [];

                    for(i in customers){
                        customer_map[customers[i].customer_id] = customers[i].company_name
                    }

                    var product = products[0];

                    for (var i = 0; i < salesInvoices.length; i++) {
                        var found = false;
                        var lines = salesInvoices[i].Lines;
                        
                        for (var j = 0; j < lines.length && !found; j++) {
                            if (product.ProductCode == lines[j].productCode) {
                                var new_sale = {};
    
                                new_sale.Id = salesInvoices[i].InvoiceNo;
                                new_sale.DocumentDate = salesInvoices[i].InvoiceDate;
                                new_sale.Entity = salesInvoices[i].CustomerID;
                                new_sale.EntityName = customer_map[new_sale.Entity];
                                new_sale.TotalValue =  salesInvoices[i].NetTotal;
    
                                var saleItem = {};
                                saleItem.Product = lines[j].productCode;
                                saleItem.Description = lines[j].productDescription;
                                saleItem.Quantity = lines[j].quantity * (-1);
                                saleItem.UnitPrice = lines[j].unitPrice;
                                saleItem.Value = lines[j].creditAmount;
    
                                new_sale.Items = [saleItem];
    
                                sales.push(new_sale);
                                break;
                            }
                        }
                    }
                    res.json(sales);
                });
            });
        });
});

var server = app.listen(8081, function () {
   var port = server.address().port;
   console.log("Listening at port %s", port)
});