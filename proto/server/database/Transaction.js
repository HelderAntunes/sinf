var mongoose = require('mongoose');

var debitLineSchema = mongoose.Schema({
    RecordID: String,
    AccountID: String,
    SourceDocumentID: String,
    SystemEntryDate: Date,
    Description: String,
    DebitAmount: Number,
});

var creditLineSchema = mongoose.Schema({
    RecordID: String,
    AccountID: String,
    SourceDocumentID: String,
    SystemEntryDate: Date,
    Description: String,
    CreditAmount: Number,
});

var transactionSchema = mongoose.Schema({
    TransactionID: String,
    Period: String,  
    TransactionDate: Date,  
    SourceID: String,  
    Description: String,  
    DocArchivalNumber: String,
    TransactionType: String, 
    GLPostingDate: Date,
    DebitLines: [debitLineSchema], 
    CreditLines: [creditLineSchema], 
});

var DebitLine = mongoose.model('debitLine', debitLineSchema);
var CreditLine = mongoose.model('creditLine', creditLineSchema);
var Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = {
  DebitLine : DebitLine,
  CreditLine : CreditLine,
  Transaction : Transaction,
}