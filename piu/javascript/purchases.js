
$(document).ready(function () {

    // Build the chart
    Highcharts.chart('purchases-by-product-category', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Purchases by product category'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                showInLegend: true
            }
        },
        series: [{
            name: 'Categories',
            colorByPoint: true,
            data: [
                {
                    name: 'Plants',
                    y: 60
                },
                {
                    name: 'Chairs',
                    y: 20
                },
                {
                    name: 'Windows',
                    y: 13.02
                },
                {
                    name: 'Tables',
                    y: 7.07,
                    sliced: true,
                    selected: true
                }]
        }]
    });

    Highcharts.chart('total-purchases', {

        title: {
            text: 'Total purchases'
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