var fs = require('fs'); 
var parseString = require('xml2js').parseString;

// DB connection, more in: https://github.com/vitaly-t/pg-promise
var pgp = require('pg-promise')(options);
var connectionString = 'pg://postgres:123456@localhost:5432/puppies';
var db = pgp(connectionString);

var promise = require('bluebird');
var options = {
  // Initialization Options
  promiseLib: promise
};

fs.readFile('../assets/SAFT_DEMOSINF_01-01-2016_31-12-2016.xml', function(err, data) {
    parseString(data, function (err, result) {
        //result = getSalesInvoices(result);        
        result = getCostumers(result);
        writeCostumersInDB(result);
        fs.writeFile('saft_in_json.js', JSON.stringify(result, null, 2), function (err) {
            if (err) throw err;
            console.log('SAF-T xml parsed.');
        });
    });
});

function getCostumers(saftParsed) {
    return saftParsed['AuditFile']['MasterFiles'][0]['Customer'];
}

function getSalesInvoices(saftParsed) {
    return saftParsed['AuditFile']['SourceDocuments'][0]['SalesInvoices'][0]['Invoice'];
}

function writeCostumersInDB(costumersJSON) {
    for (var i = 0; i < costumersJSON.length; i++) {
        var costumer = costumersJSON[i];
       
        var CostumerID_ = getValueOfAttribute(costumer.CustomerID);
        var AccountID_ = getValueOfAttribute(costumer.AccountID);
        var CustomerTaxID_ = getValueOfAttribute(costumer.CustomerTaxID);
        var CompanyName_ = getValueOfAttribute(costumer.CompanyName);
        var Telephone_ = getValueOfAttribute(costumer.Telephone);
        var Fax_ = getValueOfAttribute(costumer.Fax);
        
        console.log(CostumerID + " " + AccountID + " " + CustomerTaxID + " " + CustomerTaxID + " " + CompanyName + " " + Telephone + " " + Fax);

        db.none('INSERT INTO customer(CustomerID, AccountID, CustomerTaxID, CompanyName, Telephone, Fax)' +
                ' VALUES(${CustomerID}, ${AccountID}, ${CustomerTaxID}, ${CompanyName}, ${Telephone}, ${Fax})', {
            CustomerID: CostumerID_,
            AccountID: AccountID_,  
            CustomerTaxID: CustomerTaxID_,  
            CompanyName: CompanyName_,  
            Telephone: Telephone_,  
            Fax: Fax_,  
        })

    }
}

function getValueOfAttribute(attr) {
    if (attr != null) return attr[0];
    else return null;
}





// add query functions
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

