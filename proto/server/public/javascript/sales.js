$(document).ready(function () {

    /*$.ajax({
        url: address + "getSalesByYear",
        type: "GET",
        dataType: "json",
        data: {"year": 2016},
        success: function(data) {
            updateChartYear(data, 2016);
        },
        error: function(error) {
             console.log("Error:");
             console.log(error);
        }
    });*/

    $.ajax({
        url: address + "getSalesByMonth",
        type: "GET",
        dataType: "json",
        data: {"year": 2016, 'month': 1},
        success: function(data) {
            updateChartMonth(data, 2016, 1);
        },
        error: function(error) {
             console.log("Error:");
             console.log(error);
        }
    });
    
});

function updateChartYear(data, year) {
    var yearSales = Array.apply(null, Array(12)).map(Number.prototype.valueOf,0);

    for (var i = 0; i < data.length; i++) {
        var ammount = data[i].GrossTotal;
        var InvoiceStatusDate = data[i].InvoiceStatusDate;
        var month = moment(InvoiceStatusDate).month();
        yearSales[month] += ammount;
    }

    Highcharts.chart('sales-by-product', {
        chart: {
            type: 'line'
        },
        title: {
            text: 'Sales, 2016'
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
            title: {
                text: 'Euros €'
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: false
                },
                enableMouseTracking: true
            }
        },
        series: [{
            name: 'Sales by month',
            data: yearSales
        }]
    });
}

function updateChartMonth(data, year, month) {
    var numDaysOfMonth = daysInMonth(month, year);
    var monthSales = Array.apply(null, Array(numDaysOfMonth)).map(Number.prototype.valueOf,0);

    for (var i = 0; i < data.length; i++) {
        var ammount = data[i].GrossTotal;
        var InvoiceStatusDate = data[i].InvoiceStatusDate;
        var day = moment(InvoiceStatusDate).day();
        monthSales[month] += ammount;
    }

    Highcharts.chart('sales-by-product', {
        chart: {
            type: 'line'
        },
        title: {
            text: 'Sales, 2016 Jan'
        },
        xAxis: {
            categories: getArrayWithDays(numDaysOfMonth)
        },
        yAxis: {
            title: {
                text: 'Euros €'
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: false
                },
                enableMouseTracking: true
            }
        },
        series: [{
            name: 'Sales by day',
            data: monthSales
        }]
    });
}

//Month is 1 based
function daysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
}

function getArrayWithDays(numDays) {
    var days = [];
    for (var i = 1; i <= numDays; i++) days.push(i);
    return days;
}
