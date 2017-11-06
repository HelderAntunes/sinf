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

module.exports = {
  formatNumber : formatNumber,
  getMonthDateRange : getMonthDateRange,
  getYearDateRange : getYearDateRange,
}