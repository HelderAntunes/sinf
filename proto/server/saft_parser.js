var fs = require('fs');
var parseString = require('xml2js').parseString;

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var Customer = require('./database/Customer');
var Sales = require('./database/Sales');

fs.readFile('../assets/SAFT_DEMOSINF_01-01-2016_31-12-2016.xml', function(err, data) {
    parseString(data, function (err, result) {
        writeCustomers(getCustomers(result));
        writeSalesInvoices(getSalesInvoices(result));       
        /*fs.writeFile('saft_in_json.js', JSON.stringify(result, null, 2), function (err) {
            if (err) throw err;
            console.log('SAF-T xml parsed.');
        });*/
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
    // FOR TEST
        /*Customer.find(function (err, customers) {
            if (err) return console.error(err);
            console.log(customers);
        });*/
    
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
        
            customer_doc.save(function (err) { if (err) console.log(err);});
        }
    });
}

function writeSalesInvoices(SalesInvoicesJSON) {
    // FOR TEST
    /*Sales.SalesInvoices.find(function (err, saleInvoices) {
        if (err) return console.error(err);
        console.log(JSON.stringify(saleInvoices, null, 2));
    });
    return;*/

    Sales.Line.remove({}, function (err) {

        if (err) return handleError(err);

        Sales.SalesInvoices.remove({}, function (err) {

            if (err) return handleError(err);
            else saveSalesInvoices(SalesInvoicesJSON);

        });
    });
}

function saveSalesInvoices(SalesInvoicesJSON) {
    for (var i = 0; i < SalesInvoicesJSON.length; i++) {
        var saleInvoiceJSON = SalesInvoicesJSON[i];
        var saleInvoice_doc = getSaleInvoiceDoc(saleInvoiceJSON);
        
        for (var j = 0; j < saleInvoiceJSON.Line.length; j++) 
            saleInvoice_doc.Lines.push(getLineOfSaleInvoice(saleInvoiceJSON.Line[j]));
    
        saleInvoice_doc.save(function (err) { if (err) console.log(err);});
    }
}

function getSaleInvoiceDoc(saleInvoiceJSON) {
    return new Sales.SalesInvoices({ 
        InvoiceNo:  getValueOfAttribute(saleInvoiceJSON.InvoiceNo),
        InvoiceStatus: getValueOfAttribute(saleInvoiceJSON.DocumentStatus[0].InvoiceStatus),  
        InvoiceStatusDate: getValueOfAttribute(saleInvoiceJSON.DocumentStatus[0].InvoiceStatusDate),  
        InvoiceDate: getValueOfAttribute(saleInvoiceJSON.InvoiceDate),  
        InvoiceType: getValueOfAttribute(saleInvoiceJSON.InvoiceType),  
        CustomerID: getValueOfAttribute(saleInvoiceJSON.CustomerID),
        Lines: [{}], 
        TaxPayable: getValueOfAttribute(saleInvoiceJSON.DocumentTotals[0].TaxPayable),
        NetTotal: getValueOfAttribute(saleInvoiceJSON.DocumentTotals[0].NetTotal),
        GrossTotal: getValueOfAttribute(saleInvoiceJSON.DocumentTotals[0].GrossTotal),
    });
}

function getLineOfSaleInvoice(lineJSON) {
    return {
        lineNumber: lineJSON.LineNumber,
        productCode: lineJSON.ProductCode,
        productDescprition: lineJSON.ProductDescription,
        quantity: lineJSON.Quantity,
        unitOfMeasure: lineJSON.UnitOfMeasure,
        unitPrice: lineJSON.UnitPrice[0],
        creditAmount: lineJSON.CreditAmount != null ? lineJSON.CreditAmount[0]:null,
        debitAmount: lineJSON.DebitAmount != null ? lineJSON.DebitAmount[0]:null,
        taxType: lineJSON.Tax[0].TaxType,
        taxPercentage: lineJSON.Tax[0].TaxPercentage[0], 
    };
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
