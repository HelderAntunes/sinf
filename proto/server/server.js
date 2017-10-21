var fs = require('fs'); 
var parseString = require('xml2js').parseString;
var jSmart = require('jsmart'); 
var express = require('express');

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
    res.writeHead(200, {'Content-Type': 'text/html'});
    
    var tpl = fs.readFileSync('./templates/sales.html', {encoding: 'utf-8'});
    var compiledTemplate = new jSmart(tpl);
    var output = compiledTemplate.fetch();
    
    res.end(output);
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

var server = app.listen(8081, function () {
   var port = server.address().port;
   console.log("Listening at port %s", port)
});

// SAF-T xml -> jason object
fs.readFile('../assets/SAFT_DEMOSINF_01-01-2016_31-12-2016.xml', function(err, data) {
    parseString(data, function (err, result) {
        result = result['AuditFile']['Header'];
        fs.writeFile('saft_in_json.js', JSON.stringify(result, null, 2), function (err) {
            if (err) throw err;
            console.log('SAF-T xml parsed.');
        });
    });
});
