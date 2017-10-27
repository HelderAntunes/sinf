var fs = require('fs'); 
var jSmart = require('jsmart'); 
var express = require('express');

// PAGES
var sales = require('./pages/sales');

var app = express();

app.use(express.static(__dirname + '/public')); // css and javascript files are public files

app.get('/', function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    
    var tpl = fs.readFileSync('./templates/demo.html', {encoding: 'utf-8'});
    var compiledTemplate = new jSmart(tpl);
    var output = compiledTemplate.fetch({name: 'SINF'});
    
    console.log(output);
    res.end(output);
});

app.get('/main', function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    
    var tpl = fs.readFileSync('./templates/main.html', {encoding: 'utf-8'});
    var compiledTemplate = new jSmart(tpl);
    var output = compiledTemplate.fetch();
    
    res.end(output);
});

app.get('/sales', function (req, res) {
    sales.getSales(req, res);
});

app.get('/finances', function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    
    var tpl = fs.readFileSync('./templates/finances.html', {encoding: 'utf-8'});
    var compiledTemplate = new jSmart(tpl);
    var output = compiledTemplate.fetch();
    
    res.end(output);
});

app.get('/inventory', function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    
    var tpl = fs.readFileSync('./templates/inventory.html', {encoding: 'utf-8'});
    var compiledTemplate = new jSmart(tpl);
    var output = compiledTemplate.fetch();
    
    res.end(output);
});

app.get('/purchases', function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    
    var tpl = fs.readFileSync('./templates/purchases.html', {encoding: 'utf-8'});
    var compiledTemplate = new jSmart(tpl);
    var output = compiledTemplate.fetch();
    
    res.end(output);
});

// TEST
var db = require('./queries');

app.get('/puppies', function (req, res) {
    db.getAllPuppies(req, res);
});
// TEST

var server = app.listen(8081, function () {
   var port = server.address().port;
   console.log("Listening at port %s", port)
});