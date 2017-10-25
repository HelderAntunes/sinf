var fs = require('fs'); 
var jSmart = require('jsmart'); 
var utils = require('../utils');

exports.getSales = function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});

    var headerTpl = fs.readFileSync('./templates/common/header.html', {encoding: 'utf-8'});
    var compiledTemplate = new jSmart(headerTpl);
    var outputHeader = compiledTemplate.fetch({ title: 'Sales Dashboard'});

    var salesTpl = fs.readFileSync('./templates/sales.html', {encoding: 'utf-8'});
    compiledTemplate = new jSmart(salesTpl);
    var outputSales = compiledTemplate.fetch({
        totalSales: utils.formatNumber(154175),
        period: 'year',
        salesPerPeriod: utils.formatNumber(25),
        costumerNames: ['Continente', 'Jerónimo Martins', 'Costumer C', 'Other'],
        costumerSales: [utils.formatNumber(91323), utils.formatNumber(32340), utils.formatNumber(20323), utils.formatNumber(10189)],
    });
    
    var footerTpl = fs.readFileSync('./templates/common/footer.html', {encoding: 'utf-8'});
    compiledTemplate = new jSmart(footerTpl);
    var outputFooter = compiledTemplate.fetch();
    
    res.end(outputHeader + outputSales + outputFooter);
}
