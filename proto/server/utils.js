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

function calcBalancete(transactions, accounts_) {
    var debitLines = getDebtLinesFromTransactions(transactions);
    var creditLines = getCreditLinesFromTransactions(transactions); 
    var accounts = JSON.parse(JSON.stringify(accounts_)); // clone hack
    
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

function calcDemonstracaoResultados(balancete) {
    var demonstracaoResultados = {'gastos':[], 'rendimentos': []};
    var netIncome = 0;
    var netExpense = 0;

    for (var i = 0; i < balancete.length; i++) {
        if (balancete[i].AccountID.length != 2)
            continue;

        if (balancete[i].AccountID[0] == '6') 
            demonstracaoResultados.gastos.push(balancete[i]);
        if (balancete[i].AccountID[0] == '7')
            demonstracaoResultados.rendimentos.push(balancete[i]);
    }
    
    for (var i = 0; i < demonstracaoResultados.gastos.length; i++)
        netExpense += demonstracaoResultados.gastos[i].DebtMovements;
    for (var i = 0; i < demonstracaoResultados.rendimentos.length; i++)
        netIncome += demonstracaoResultados.rendimentos[i].CreditMovements;
    
    demonstracaoResultados['netIncome'] = netIncome;
    demonstracaoResultados['netExpense'] = netExpense;
    demonstracaoResultados['netResult'] = netIncome - netExpense;

    return demonstracaoResultados;
}

function calcBalancetes(transactions, accounts, year, month) {
    var balancetes = [];
    
    if (month == null) {
        var transactionsByMonth = [];
        for (var i = 0; i < 12; i++) 
            transactionsByMonth.push([]);
        for (var i = 0; i < transactions.length; i++) {
            var month = moment(transactions[i].TransactionDate).month();
            transactionsByMonth[month].push(transactions[i]);
        }

        for (var i = 0; i < 12; i++) 
            balancetes.push(calcBalancete(transactionsByMonth[i], accounts));
    }
    else {
        var transactionsByDay = [];
        var numDays = daysInMonth(year, month);
        for (var i = 0; i < numDays; i++) 
            transactionsByDay.push([]);
        for (var i = 0; i < transactions.length; i++) {
            var day = moment(transactions[i].TransactionDate).day();
            transactionsByDay[day].push(transactions[i]);
        }

        for (var i = 0; i < numDays; i++) 
            balancetes.push(calcBalancete(transactionsByDay[i], accounts));
    }

    return balancetes;
}

function calcBalanco(balancete) {
    var balanco = {
        'assets':{
            'accounts': [],
            'value': 0,
        },
        'liabilities': {
            'accounts': [],
            'value': 0,
        },
        'equity': {
            'accounts': [],
            'value': 0,
        },
    };

    for (var i = 0; i < balancete.length; i++) {

        if (balancete[i].AccountID.length != 2 || 
            balancete[i].AccountID[0] === '6' ||
            balancete[i].AccountID[0] === '7' ||
            balancete[i].AccountID[0] === '8' ||
            balancete[i].AccountID[0] === '9') 
            continue;
            
        balancete[i].ClosingDebitBalance = balancete[i].OpeningDebitBalance + balancete[i].DebtMovements;
        balancete[i].ClosingCreditBalance = balancete[i].OpeningCreditBalance + balancete[i].CreditMovements;

        if (balancete[i].ClosingDebitBalance > balancete[i].ClosingCreditBalance) {
            balancete[i].ClosingDebitBalance = balancete[i].ClosingDebitBalance - balancete[i].ClosingCreditBalance;
            balancete[i].ClosingCreditBalance = 0;
            balanco.assets.accounts.push(balancete[i])
            balanco.assets.value += balancete[i].ClosingDebitBalance;
        }
        else {
            balancete[i].ClosingCreditBalance = balancete[i].ClosingCreditBalance - balancete[i].ClosingDebitBalance;
            balancete[i].ClosingDebitBalance = 0;
            balanco.liabilities.accounts.push(balancete[i]);
            balanco.liabilities.value += balancete[i].ClosingCreditBalance;
        }
    }
    balanco.equity.value = balanco.assets.value - balanco.liabilities.value;

    return balanco;
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

function daysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
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
    daysInMonth: daysInMonth,
    calcDemonstracaoResultados: calcDemonstracaoResultados,
    calcBalanco: calcBalanco,
    calcBalancetes: calcBalancetes,
}