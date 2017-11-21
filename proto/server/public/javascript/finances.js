
$(document).ready(function(){

    $('#finances-tab').addClass('active');

    Highcharts.chart('container', {

        title: {
            text: 'Finances'
        },

        subtitle: {
            text: 'Equity, Assets and Liabilities'
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
            name: 'Equity',
            data: [23344, 25544, 20343, 40344, 60344, 90000, 111034, 114455]
        }, {
            name: 'Assets',
            data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
        }, {
            name: 'Liabilities',
            data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
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
