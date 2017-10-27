var fs = require('fs');
var parseString = require('xml2js').parseString;

// DB connection, more in: https://github.com/vitaly-t/pg-promise
var pgp = require('pg-promise')(options);
var connectionString = 'pg://postgres:123456@localhost:5432/sinf_db';
var db = pgp(connectionString);

var promise = require('bluebird');
var options = {
  // Initialization Options
  promiseLib: promise
};

fs.readFile('../assets/SAFT_DEMOSINF_01-01-2016_31-12-2016.xml', function(err, data) {
    parseString(data, function (err, result) {
        result = getSalesInvoices(result);        
        //result = getCustomers(result);
        //writeCustomersInDB(result);
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

function writeCustomersInDB(customersJSON) {
    for (var i = 0; i < customersJSON.length; i++) {
        var customer = customersJSON[i];
       
        var CustomerID = getValueOfAttribute(customer.CustomerID);
        var AccountID = getValueOfAttribute(customer.AccountID);
        var CustomerTaxID = getValueOfAttribute(customer.CustomerTaxID);
        var CompanyName = getValueOfAttribute(customer.CompanyName);
        var Telephone = getValueOfAttribute(customer.Telephone);
        var Fax = getValueOfAttribute(customer.Fax);
        
        console.log(CustomerID + " " + AccountID + " " + CustomerTaxID + " " + CustomerTaxID + " " + CompanyName + " " + Telephone + " " + Fax);

        db.none('INSERT INTO public.customer(customer_id, account_id, customer_tax_id, company_name, telephone, fax)' +
                ' VALUES(${customer_id}, ${account_id}, ${customer_tax_id}, ${company_name}, ${telephone}, ${fax})', {
            customer_id: CustomerID,
            account_id: AccountID,  
            customer_tax_id: CustomerTaxID,  
            company_name: CompanyName,  
            telephone: Telephone,  
            fax: Fax,  
        });

    }
}

function getValueOfAttribute(attr) {
    if (attr != null) return attr[0];
    else return null;
}

// TEST
function getAllPuppies(req, res, next) {
    db.any('select * from pups')
      .then(function (data) {
        res.status(200)
          .json({
            status: 'success',
            data: data,
            message: 'Retrieved ALL puppies',
          });
      })
      .catch(function (err) {
        return next(err);
      });
}
// TEST


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
