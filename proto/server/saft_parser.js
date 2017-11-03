var fs = require('fs');
var parseString = require('xml2js').parseString;

fs.readFile('../assets/SAFT_DEMOSINF_01-01-2016_31-12-2016.xml', function(err, data) {
    parseString(data, function (err, result) {
        //result = getSalesInvoices(result);        
        result = getCustomers(result);
        //writeCustomersInDB(result);
        writeCustomers(result);
        fs.writeFile('saft_in_json.js', JSON.stringify(result, null, 2), function (err) {
            if (err) throw err;
            console.log('SAF-T xml parsed.');
        });
    });
});

function getCustomers(saftParsed) {
    return saftParsed['AuditFile']['MasterFiles'][0]['Customer'];
}

function getSalesInvoices(saftParsed) {
    return saftParsed['AuditFile']['SourceDocuments'][0]['SalesInvoices'][0]['Invoice'];
}

function getValueOfAttribute(attr) {
    if (attr != null) return attr[0];
    else return null;
}

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {});

function writeCustomers(customersJSON) {

    var customerSchema = mongoose.Schema({
        customer_id: String,
        account_id: String,  
        customer_tax_id: String,  
        company_name: String,  
        telephone: String,  
        fax: String, 
    });

    var Customer = mongoose.model('Custom', customerSchema);
    // TODO: DROP IF EXISTS
    for (var i = 0; i < customersJSON.length; i++) {
        var customer = customersJSON[i];
         
        var customer_doc = new Customer({ 
            customer_id:  getValueOfAttribute(customer.CustomerID),
            account_id: getValueOfAttribute(customer.AccountID),  
            customer_tax_id: getValueOfAttribute(customer.CustomerTaxID),  
            company_name: getValueOfAttribute(customer.CompanyName),  
            telephone: getValueOfAttribute(customer.Telephone),  
            fax: getValueOfAttribute(customer.Fax), 
        });
        console.log(customer_doc); // 'Silence'
    
        customer_doc.save();
    }

    Customer.find(function (err, customers) {
        if (err) return console.error(err);
        console.log(customers);
    });
    
}

//encomendas
function getPurchaseOrders(saftParsed) {
    //ir buscar work docs
    workingDoc = saftParsed['AuditFile']['SourceDocuments'][0]['WorkingDocuments'][0]['WorkDocument'];
    docType = workingDoc[0]['WorkType'][0];

    //verificar que e encomenda e adicionar a array ret
    var ret = new Array();
    if(docType == "NE"){
        ret.push(workingDoc);
        //console.log("ne: " + JSON.stringify(workingDoc, null, 2));
    }

    return ret;
}

//divida total
function getTotalClientDebt(SaftParsed){
    //preencher array com todas as invoices
    invoices = getSalesInvoices(SaftParsed);

    //preencher ret com dividaTotal
    ret = 0;
    for (var i = 0, len = invoices.length; i < len; i++) {
        ret +=  parseInt(invoices[i]["Line"][0]["CreditAmount"][0]);
    }

    return ret;
}
