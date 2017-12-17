var mongoose = require('mongoose');

var customerSchema = mongoose.Schema({
    customer_id: String,
    account_id: String,  
    customer_tax_id: String,  
    company_name: String,  
    telephone: String,  
    fax: String, 
});

var Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;