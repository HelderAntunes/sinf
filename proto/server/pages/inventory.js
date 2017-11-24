var fs = require('fs'); 
var jSmart = require('jsmart'); 
var utils = require('../utils');

exports.getInventory = function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});

    var headerTpl = fs.readFileSync('./templates/common/header.html', {encoding: 'utf-8'});
    var compiledTemplate = new jSmart(headerTpl);
    var outputHeader = compiledTemplate.fetch({ title: 'Inventory Dashboard'});

    var inventoryTpl = fs.readFileSync('./templates/inventory.html', {encoding: 'utf-8'});
    compiledTemplate = new jSmart(inventoryTpl);
    
    var outputPurchases = compiledTemplate.fetch({
        totalPurchases: utils.formatNumber(154175),
        growth: '12.4',
        years: ['2015','2016','2017'],
    });
    
    var footerTpl = fs.readFileSync('./templates/common/footer.html', {encoding: 'utf-8'});
    compiledTemplate = new jSmart(footerTpl);
    var outputFooter = compiledTemplate.fetch();
    
    res.end(outputHeader + outputPurchases + outputFooter);
}


exports.getInventoryDetailed = function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});

    var headerTpl = fs.readFileSync('./templates/common/header.html', {encoding: 'utf-8'});
    var compiledTemplate = new jSmart(headerTpl);
    var outputHeader = compiledTemplate.fetch({ title: 'Inventory Dashboard'});

    var salesTpl = fs.readFileSync('./templates/inventory_detailed.html', {encoding: 'utf-8'});
    compiledTemplate = new jSmart(salesTpl);
    
    var outputPurchases = compiledTemplate.fetch({
        totalPurchases: utils.formatNumber(154175),
        growth: '12.4',
    });
    
    var footerTpl = fs.readFileSync('./templates/common/footer.html', {encoding: 'utf-8'});
    compiledTemplate = new jSmart(footerTpl);
    var outputFooter = compiledTemplate.fetch();
    
    res.end(outputHeader + outputPurchases + outputFooter);
}