var fs = require('fs'); 
var jSmart = require('jsmart'); 
var utils = require('../utils');

exports.getMain = function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});

    var headerTpl = fs.readFileSync('./templates/common/header.html', {encoding: 'utf-8'});
    var compiledTemplate = new jSmart(headerTpl);
    var outputHeader = compiledTemplate.fetch({ title: 'Product ' + req.params.id});

    var mainTpl = fs.readFileSync('./templates/product.html', {encoding: 'utf-8'});
    compiledTemplate = new jSmart(mainTpl);
    var outputMain = compiledTemplate.fetch({ title: 'Product ' + req.params.id, id: req.params.id});
    
    var footerTpl = fs.readFileSync('./templates/common/footer.html', {encoding: 'utf-8'});
    compiledTemplate = new jSmart(footerTpl);
    var outputFooter = compiledTemplate.fetch();
    
    res.end(outputHeader + outputMain + outputFooter);
}