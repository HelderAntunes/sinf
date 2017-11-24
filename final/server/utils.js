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

// decreasing order
function compareCustomersBySalesDec(a,b) {
    if (a.sales < b.sales) return 1;
    if (a.sales > b.sales) return -1;
    return 0;
}

module.exports = {
    formatNumber : formatNumber,
    getMonthDateRange : getMonthDateRange,
    getYearDateRange : getYearDateRange,
    setCustomerSales: setCustomerSales,
    compareCustomersBySalesDec: compareCustomersBySalesDec,
}