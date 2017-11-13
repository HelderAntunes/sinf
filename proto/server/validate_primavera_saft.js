var fs = require('fs');

var Ajv = require('ajv');
var parseString = require('xml2js').parseString;
var xml2json = require('jgexml/xml2json').xml2json;
var getJsonSchema = require('jgexml/xsd2json').getJsonSchema;

var jsonSchema;
fs.readFile('../assets/SAFTPT1.04_01.xsd', function(err, data) {
    parseString(data, function (err, result) {
console.log("xsd start");
    //    var j = xml2json(result);
        jsonSchema = JSON.stringify(getJsonSchema(result), null, '  ');

//        console.log("schema: " + jsonSchema);
console.log("xsd end");

    });
});

fs.readFile('../assets/SAFT_DEMOSINF_01-01-2016_31-12-2016.xml', function(err, data) {
    parseString(data, function (err, result) {
        console.log("xml start");

        var ajv = new Ajv();
        var valid = ajv.validate(jsonSchema, result);
        //if (!valid) console.log("errors: " + ajv.errors);
        //else console.log("yey");
        console.log("xml end");

    });
});
