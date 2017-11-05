this.year = 2017;
this.month = null;

var formatNumber = function (x) {
    return x.toFixed(2);
}

var chooseYear = function (year) {
   $('.dropdown-toggle').text(year);
   $('.dropdown-toggle').append(' <span class="caret"></span></button>');

   this.year = year;

   updateData();
}

var chooseMonth = function (month) {
    if(month != 'null'){
        this.month = month;
    }else{
        this.month = null;
    }

    updateData();
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

var updateData = function () {
    var groupBySupplierURL = 'http://localhost:49822/api/Purchases/groupBySupplier?year='+ this.year;
    var groupByDateURL = 'http://localhost:49822/api/Purchases/groupByDate?year=' + this.year;

    if(this.month!=null){
        groupBySupplierURL += '&month=' + this.month;
        groupByDateURL += '&month=' + this.month;
    }

    $.getJSON(groupBySupplierURL, function(data) {
        var total = 0;

        if(data.length == 0){
            $('#supplier-purchases').html('<p>No Suppliers<p>');
        }
        else{
            $('#supplier-purchases').html('');
            
            for (i in data) {
                var purchase = data[i];

                if(i < 3){
                    $('#supplier-purchases').append('<tr><td>'+ purchase.EntityName + '</td><td>' + formatNumber(purchase.TotalValue) + '€</td></tr>');
                }

                total += purchase.TotalValue;
            }
        }

        $('#total-purchases-value').html(formatNumber(total) +' €');
    });

    $.getJSON(groupByDateURL, function(data) {
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
}

$(document).ready(function () {
    $('input[type=radio][name=options]').change(function() {
        chooseMonth(this.value);
    });

    updateData();
});