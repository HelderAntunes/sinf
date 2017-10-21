$(document).ready(function () {
    Highcharts.chart('sales-by-product', {
        chart: {
            type: 'area'
        },
        title: {
            text: 'Sales'
        },

        subtitle: {
            text: 'by Product'
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
            series: {
                pointStart: 2010,
                stacking: "normal"
            }
        },

        series: [{
            name: 'Product A',
            data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
        }, {
            name: 'Product B',
            data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
        }, {
            name: 'Product C',
            data: [2916, 8064, 22742, 36851, 16490, 16282, 13121, 10434]
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
});
