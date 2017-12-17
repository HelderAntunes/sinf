$(document).ready(function () {

    Highcharts.chart('total-purchases', {

        title: {
            text: 'Purchases'
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
                pointStart: 2010
            }
        },

        series: [{
            name: 'Purchases',
            data: [43934, 52503, 57177, 69658, 97031, 119931, 117133, 117175]
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