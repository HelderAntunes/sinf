var mongoose = require('mongoose');

var productSchema = mongoose.Schema({
    ProductType: String,
    ProductCode: String, 
    ProductGroup: String,
    ProductDescription: String,
    ProductNumberCode: String
});

var lineSchema = mongoose.Schema({
    lineNumber: String,
    productCode: String,
    productDescprition: String, 
    quantity: String, 
    unitOfMeasure: String, 
    unitPrice: Number, 
    creditAmount: Number, 
    debitAmount: Number,
    taxType: String,
    taxPercentage: Number, 
});

var salesInvoicesSchema = mongoose.Schema({
    InvoiceNo: String,
    InvoiceStatus: String,  
    InvoiceStatusDate: Date,  
    InvoiceDate: Date,  
    InvoiceType: String,  
    CustomerID: String,
    Lines: [lineSchema], 
    TaxPayable: Number,
    NetTotal: Number,
    GrossTotal: Number, 
});

var SalesInvoices = mongoose.model('SalesInvoices', salesInvoicesSchema);
var Line = mongoose.model('Line', lineSchema);
var Product = mongoose.model('Product', productSchema);

module.exports = {
  SalesInvoices : SalesInvoices,
  Line : Line,
  Product: Product
}