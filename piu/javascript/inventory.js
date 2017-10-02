
$(document).ready(function () {

Highcharts.chart('stock-available', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Stock available'
    },
    subtitle: {
        text: 'by product'
    },
    xAxis: {
        categories: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ],
        crosshair: true
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Number of items (M)'
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series: [{
        name: 'Product A',
        data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]

    }, {
        name: 'Product B',
        data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]

    }, {
        name: 'Product C',
        data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2]

    }, {
        name: 'Product D',
        data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1]

    }]
});

Highcharts.chart('inventory-value', {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false
    },
    title: {
        text: 'Inventory Value'
    },
    subtitle: {
        text: 'by product'
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
        pie: {
            dataLabels: {
                enabled: true,
                distance: -50,
                style: {
                    fontWeight: 'bold',
                    color: 'white'
                }
            },
            startAngle: -180,
            endAngle: 180,
            center: ['50%', '50%']
        }
    },
    series: [{
        type: 'pie',
        name: 'Browser share',
        innerSize: '50%',
        data: [
            ['Product A', 10.38],
            ['Product B', 56.33],
            ['Product C', 24.03],
            ['Product D', 4.77]
	   ]
    }]
});

Highcharts.chart('inventory-days', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Average Inventory Days'
    },
    subtitle: {
        text: 'by Product'
    },
    xAxis: {
        type: 'category'
    },
    yAxis: {
        title: {
            text: 'Days'
        }

    },
    legend: {
        enabled: false
    },
    plotOptions: {
        series: {
            borderWidth: 0,
            dataLabels: {
                enabled: true,
                format: '{point.y:.1f}'
            }
        }
    },

    tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
    },

    series: [{
        name: 'Pruducts',
        colorByPoint: true,
        data: [{
            name: 'Product A',
            y: 56.33,
            drilldown: 'Product_A'
        }, {
            name: 'Product B',
            y: 24.03,
            drilldown: 'Product_A'
        }, {
            name: 'Product C',
            y: 10.38,
            drilldown: 'Product_A'
        }, {
            name: 'Product D',
            y: 4.77,
            drilldown: 'Product_A'
        }]
    }],
    drilldown: {
        series: [{
            name: 'Product A',
            id: 'Product_A',
            data: [
                [
                    'Jun',
                    24.13
                ],
                [
                    'Jul',
                    17.2
                ],
                [
                    'Aug',
                    8.11
                ],
                [
                    'Sep',
                    5.33
                ],
                [
                    'Oct',
                    1.06
                ],
                [
                    'Nov',
                    0.5
                ]
            ]
        }]
    }
});

});