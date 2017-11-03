this.year = 2017;
this.month = null;

var formatNumber = function (x) {
    return x.toFixed(2);
}

var chooseYear = function (year) {
   $('.dropdown-toggle').text(year);
   $('.dropdown-toggle').append(' <span class="caret"></span></button>');

   this.year = year;

   console.log(this.month + "/" + this.year);
}

var chooseMonth = function (month) {
    this.month = month;
 
    console.log(this.month + "/" + this.year);
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
        
                series: [{
                    name: 'Purchases',
                    data: purchasesTotal
                }],

                tooltip: {
                    pointFormat: "{point.y:,.2f} €"
                },
        
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
    $('input[type=radio][name=options]').change(function() {
        chooseMonth(this.value);
    });

    $.getJSON('http://localhost:49822/api/Purchases/groupBySupplier/', function(data) {
        var total = 0;
        
        for (i in data) {
            var purchase = data[i];

            if(i < 3){
                $('#supplier-purchases').append('<tr><td>'+ purchase.EntityName + '</td><td>' + formatNumber(purchase.TotalValue) + '€</td></tr>');
            }

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