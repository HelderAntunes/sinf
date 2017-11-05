var fs = require('fs');
var parseString = require('xml2js').parseString;
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var Customer = require('./database/Customer');
var Sales = require('./database/Sales');

fs.readFile('../assets/SAFT_DEMOSINF_01-01-2016_31-12-2016.xml', function(err, data) {
    parseString(data, function (err, result) {
        result = getSalesInvoices(result);
        writeSalesInvoices(result);       
        //result = getCustomers(result);
        //writeCustomers(result);
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

function writeCustomers(customersJSON) {

    Customer.remove({ }, function (err) {
        if (err) return handleError(err);

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
        
            customer_doc.save();
        }
    
        Customer.find(function (err, customers) {
            if (err) return console.error(err);
            console.log(customers);
        });

    });
}

function writeSalesInvoices(SalesInvoicesJSON) {
    Sales.SalesInvoices.find(function (err, saleInvoices) {
        if (err) return console.error(err);
        console.log(JSON.stringify(saleInvoices, null, 2));
    });
    return;
    Sales.Line.remove({}, function (err){
        if (err) return handleError(err);

        Sales.SalesInvoices.remove({ }, function (err) {
            if (err) return handleError(err);

            for (var i = 0; i < SalesInvoicesJSON.length; i++) {
                var saleInvoice = SalesInvoicesJSON[i];

                var saleInvoice_doc = new Sales.SalesInvoices({ 
                    InvoiceNo:  getValueOfAttribute(saleInvoice.InvoiceNo),
                    InvoiceStatus: getValueOfAttribute(saleInvoice.DocumentStatus[0].InvoiceStatus),  
                    InvoiceStatusDate: getValueOfAttribute(saleInvoice.DocumentStatus[0].InvoiceStatusDate),  
                    InvoiceDate: getValueOfAttribute(saleInvoice.InvoiceDate),  
                    InvoiceType: getValueOfAttribute(saleInvoice.InvoiceType),  
                    CustomerID: getValueOfAttribute(saleInvoice.CustomerID),
                    Lines: [{}], 
                    TaxPayable: getValueOfAttribute(saleInvoice.DocumentTotals[0].TaxPayable),
                    NetTotal: getValueOfAttribute(saleInvoice.DocumentTotals[0].NetTotal),
                    GrossTotal: getValueOfAttribute(saleInvoice.DocumentTotals[0].GrossTotal),
                });

                for (var j = 0; j < saleInvoice.Line.length; j++) {
                    var line = saleInvoice.Line[j];
                    saleInvoice_doc.Lines.push({
                        lineNumber: line.LineNumber,
                        productCode: line.ProductCode,
                        productDescprition: line.ProductDescription,
                        quantity: line.Quantity,
                        unitOfMeasure: line.UnitOfMeasure,
                        unitPrice: line.UnitPrice[0],
                        creditAmount: line.CreditAmount != null ? line.CreditAmount[0]:null,
                        debitAmount: line.DebitAmount != null ? line.DebitAmount[0]:null,
                        taxType: line.Tax[0].TaxType,
                        taxPercentage: line.Tax[0].TaxPercentage[0], 
                    });
                    
                }
            
                saleInvoice_doc.save(function (err) {
                    if (err) console.log(err);
                });
            }
        });
    });
    console.log('666');

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
