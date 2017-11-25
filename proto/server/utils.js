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

    return creditLines;
}

function calcBalancete(transactions, accounts) {
    var debitLines = getDebtLinesFromTransactions(transactions);
    var creditLines = getCreditLinesFromTransactions(transactions); 

    for (var i = 0; i < accounts.length; i++) {
        accounts[i]['DebtMovements'] = 0;
        accounts[i]['CreditMovements'] = 0;
    }
    
    for (var j = 0; j < creditLines.length; j++) {
        var accountID = creditLines[j].AccountID;
        var creditAmount = creditLines[j].CreditAmount;

        for (var k = 0; k < accounts.length; k++) 
            if (accounts[k].AccountID == accountID)
                accounts[k]['CreditMovements'] += creditAmount;
    }

    for (var j = 0; j < debitLines.length; j++) {
        var accountID = debitLines[j].AccountID;
        var debitAmount = debitLines[j].DebitAmount;

        for (var k = 0; k < accounts.length; k++)
            if (accounts[k].AccountID == accountID)
                accounts[k]['DebtMovements'] += debitAmount;
    }

    // Hierarquical accounts
    accounts = accounts.sort(compareAccountsIdDec);
    for (var i = 0; i < accounts.length; i++) {
        var accountID1 = accounts[i].AccountID;
        for (var j = i+1; j < accounts.length; j++) {
            var accountID2 = accounts[j].AccountID;
            if (isSubString(accountID2, accountID1)) {
                accounts[j]['DebtMovements'] += accounts[i]['DebtMovements'];
                accounts[j]['CreditMovements'] += accounts[i]['CreditMovements'];
                break;
            }
        }
    }

    return accounts;
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
    calcBalancete: calcBalancete,
}