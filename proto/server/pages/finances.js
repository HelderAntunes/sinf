var fs = require('fs'); 
var jSmart = require('jsmart'); 
var utils = require('../utils');

exports.getFinances = function (req, res) {
    
    res.writeHead(200, {'Content-Type': 'text/html'});
    
    var headerTpl = fs.readFileSync('./templates/common/header.html', {encoding: 'utf-8'});
    var compiledTemplate = new jSmart(headerTpl);
    var outputHeader = compiledTemplate.fetch({ title: 'Finances Dashboard'});

    var financesTpl = fs.readFileSync('./templates/finances.html', {encoding: 'utf-8'});
    compiledTemplate = new jSmart(financesTpl);
    var outputFinances = compiledTemplate.fetch();
    
    var footerTpl = fs.readFileSync('./templates/common/footer.html', {encoding: 'utf-8'});
    compiledTemplate = new jSmart(footerTpl);
    var outputFooter = compiledTemplate.fetch();
    
    res.end(outputHeader + outputFinances + outputFooter);

}

exports.getIncomeStatment = function (req, res) {

    res.writeHead(200, {'Content-Type': 'text/html'});
    
    var headerTpl = fs.readFileSync('./templates/common/header.html', {encoding: 'utf-8'});
    var compiledTemplate = new jSmart(headerTpl);
    var outputHeader = compiledTemplate.fetch({ title: 'Finances Dashboard'});

    var financesTpl = fs.readFileSync('./templates/income_statement.html', {encoding: 'utf-8'});
    compiledTemplate = new jSmart(financesTpl);
    var outputFinances = compiledTemplate.fetch();
    
    var footerTpl = fs.readFileSync('./templates/common/footer.html', {encoding: 'utf-8'});
    compiledTemplate = new jSmart(footerTpl);
    var outputFooter = compiledTemplate.fetch();
    
    res.end(outputHeader + outputFinances + outputFooter);

}

exports.getBalanceSheet = function (req, res) {

    res.writeHead(200, {'Content-Type': 'text/html'});
    
    var headerTpl = fs.readFileSync('./templates/common/header.html', {encoding: 'utf-8'});
    var compiledTemplate = new jSmart(headerTpl);
    var outputHeader = compiledTemplate.fetch({ title: 'Finances Dashboard'});

    var financesTpl = fs.readFileSync('./templates/balance_sheet.html', {encoding: 'utf-8'});
    compiledTemplate = new jSmart(financesTpl);
    var outputFinances = compiledTemplate.fetch();
    
    var footerTpl = fs.readFileSync('./templates/common/footer.html', {encoding: 'utf-8'});
    compiledTemplate = new jSmart(footerTpl);
    var outputFooter = compiledTemplate.fetch();
    
    res.end(outputHeader + outputFinances + outputFooter);

}