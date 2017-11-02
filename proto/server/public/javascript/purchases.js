var formatNumber = function (x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.join(".");
}

var createGraph = function (dates, purchasesTotal) {
    Highcharts.chart('total-purchases', {
        
                title: {
                    text: 'Purchases'
                },

                xAxis: {
                    categories: dates,
                },
        
                yAxis: {
                    title: {
                        text: 'Euros €'
                    }
                },
        
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle'
                },
        
                plotOptions: {
                    line: {
                        dataLabels: {
                            enabled: true
                        },
                    }
                },
        
                series: [{
                    name: 'Purchases',
                    data: purchasesTotal
                }],
        
                responsive: {
                    rules: [{
                        condition: {
                            maxWidth: 500
                        },
                        chartOptions: {
                            legend: {
                                layout: 'horizontal',
                                align: 'center',
                                verticalAlign: 'bottom'
                            }
                        }
                    }]
                }
        
            });
}

$(document).ready(function () {
    $.getJSON('http://localhost:49822/api/Purchases/groupBySupplier/', function(data) {
        var total = 0;
        
        for (i in data) {
            var purchase = data[i];
        
            $('#supplier-purchases').append('<tr><td>'+ purchase.EntityName + '</td><td>' + formatNumber(purchase.TotalValue) + ' €</td></tr>');

            total += purchase.TotalValue;
        }

        $('#total-purchases-value').html(formatNumber(total) +' €');
    });

    $.getJSON('http://localhost:49822/api/Purchases/groupByDate/', function(data) {
        var dates = [];
        var purchasesTotal = [];
        var total = 0;
        
        for (i in data) {
            var purchase = data[i];

            var date = new Date(purchase.DocumentDate)

            dates.push(date.toLocaleDateString());
            purchasesTotal.push(purchase.TotalValue);
        }
        createGraph(dates, purchasesTotal);
    });
});