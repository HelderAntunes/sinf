$(document).ready(function () {

    $('#dashboard-tab').addClass('active');

    // Build the chart
    Highcharts.chart('sales-by-product', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Product Sales Distribution'
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
                    y: 7.07
                }]
        }]
    });

});

