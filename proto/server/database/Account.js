var mongoose = require('mongoose');

var accountSchema = mongoose.Schema({
    AccountID: String,
    AccountDescription: String,  
    OpeningDebitBalance: Number,  
    OpeningCreditBalance: Number,  
    ClosingDebitBalance: Number,  
    ClosingCreditBalance: Number, 
    GroupingCategory: String, 
    GroupingCode: String, 
    TaxonomyCode: String, 
});

var Account = mongoose.model('Account', accountSchema);

module.exports = Account;