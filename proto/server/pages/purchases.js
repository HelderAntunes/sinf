var fs = require('fs'); 
var jSmart = require('jsmart'); 
var utils = require('../utils');

exports.getPurchases = function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});

    var headerTpl = fs.readFileSync('./templates/common/header.html', {encoding: 'utf-8'});
    var compiledTemplate = new jSmart(headerTpl);
    var outputHeader = compiledTemplate.fetch({ title: 'Purchases Dashboard'});

    var salesTpl = fs.readFileSync('./templates/purchases.html', {encoding: 'utf-8'});
    compiledTemplate = new jSmart(salesTpl);
    
    var outputPurchases = compiledTemplate.fetch({
        totalPurchases: utils.formatNumber(154175),
        growth: '12.4',
        //costumerNames: ['Continente', 'Jerónimo Martins', 'Costumer C', 'Other'],
        //costumerSales: [utils.formatNumber(91323), utils.formatNumber(32340), utils.formatNumber(20323), utils.formatNumber(10189)],
    });
    
    var footerTpl = fs.readFileSync('./templates/common/footer.html', {encoding: 'utf-8'});
    compiledTemplate = new jSmart(footerTpl);
    var outputFooter = compiledTemplate.fetch();
    
    res.end(outputHeader + outputPurchases + outputFooter);
}
