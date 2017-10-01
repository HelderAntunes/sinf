
$(document).ready(function(){
    Highcharts.chart('container', {

        title: {
            text: 'Finances'
        },

        subtitle: {
            text: 'Assets and Liabilities'
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
