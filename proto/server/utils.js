var moment = require('moment');

function formatNumber(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.join(".");
}

function getDayDateRange(year, month, day) {
    var startDate = moment([year, month - 1, day]);
    var endDate = startDate.add(1, 'days');
    return { start: startDate.toDate(), end: endDate.toDate() };

}

function getMonthDateRange(year, month) {
    var startDate = moment([year, month - 1]);
    var endDate = moment(startDate).endOf('month');
    return { start: startDate.toDate(), end: endDate.toDate() };
}

function getYearDateRange(year) {
    var startDate = moment([year]);
    var endDate = moment(startDate).endOf('year');
    return { start: startDate.toDate(), end: endDate.toDate() };
}

function setCustomerSales(customers, salesInvoices) {
    for (var i = 0; i < customers.length; i++) customers[i]['sales'] = 0;

    for (var i = 0; i < customers.length; i++) 
    for (var j = 0; j < salesInvoices.length; j++) 
        if (salesInvoices[j].CustomerID == customers[i].customer_id) 
           customers[i]['sales'] += salesInvoices[j]['NetTotal'];

    return customers;
}

function getDebtLinesFromTransactions(transactions) {
    var debitLines = [];
    for (var i = 0; i < transactions.length; i++) {
        var transaction = transactions[i];
        var debitLines_ = transaction.DebitLines;

        for (var j = 0; j < debitLines_.length; j++) {
            var debitLine_ = debitLines_[j];
            debitLine_['date'] = transaction.TransactionDate;
            debitLines.push(debitLine_);
        }
    }
    console.log(debitLines);

    for (var i = 0; i < debitLines.length; i++)     
        for (var j = i+1; j < debitLines.length; j++) 
            if (debitLines[i].SourceDocumentID == debitLines[j].SourceDocumentID) {
                debitLines.splice(j, 1);
                j--;
            }

    return debitLines;
}

function getCreditLinesFromTransactions(transactions) {
    var creditLines = [];
    for (var i = 0; i < transactions.length; i++) {
        var transaction = transactions[i];
        var creditLines_ = transaction.CreditLines;

        for (var j = 0; j < creditLines_.length; j++) {
            var creditLine_ = creditLines_[j];
            creditLine_['date'] = transaction.TransactionDate;
            creditLines.push(creditLine_);
        }
    }

    for (var i = 0; i < creditLines.length; i++)     
        for (var j = i+1; j < creditLines.length; j++) 
            if (creditLines[i].SourceDocumentID == creditLines[j].SourceDocumentID) {
                creditLines.splice(j, 1);
                j--;
            }

    return creditLines;
}

// decreasing order
function compareCustomersBySalesDec(a,b) {
    if (a.sales < b.sales) return 1;
    if (a.sales > b.sales) return -1;
    return 0;
}

function compareAccountsIdDec(account1, account2) {
    if (account1.AccountID < account2.AccountID) return 1;
    if (account1.AccountID > account2.AccountID) return -1;
    return 0;
}

function isSubString(subStringTest, stringTest) {
    if (subStringTest.length > stringTest) return false;

    for (var i = 0; i < subStringTest.length; i++) 
        if (subStringTest[i] != stringTest[i])
            return false;
    
    return true;
}

module.exports = {
    formatNumber : formatNumber,
    getMonthDateRange : getMonthDateRange,
    getYearDateRange : getYearDateRange,
    setCustomerSales: setCustomerSales,
    compareCustomersBySalesDec: compareCustomersBySalesDec,
    getDebtLinesFromTransactions: getDebtLinesFromTransactions,
    getCreditLinesFromTransactions: getCreditLinesFromTransactions,
    compareAccountsIdDec: compareAccountsIdDec,
    isSubString: isSubString,
}