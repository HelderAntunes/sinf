var fs = require('fs'); 
var jSmart = require('jsmart'); 
var utils = require('../utils');

exports.getMain = function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});

    var headerTpl = fs.readFileSync('./templates/common/header.html', {encoding: 'utf-8'});
    var compiledTemplate = new jSmart(headerTpl);
    var outputHeader = compiledTemplate.fetch({ title: 'Main Dashboard'});

    var mainTpl = fs.readFileSync('./templates/main.html', {encoding: 'utf-8'});
    compiledTemplate = new jSmart(mainTpl);
    
    var outputMain = compiledTemplate.fetch();
    
    var footerTpl = fs.readFileSync('./templates/common/footer.html', {encoding: 'utf-8'});
    compiledTemplate = new jSmart(footerTpl);
    var outputFooter = compiledTemplate.fetch();
    
    res.end(outputHeader + outputMain + outputFooter);
}