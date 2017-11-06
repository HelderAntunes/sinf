$(document).ready(function () {

  $('#inventory-tab').addClass('active');

  Highcharts.chart('stock-available', {
      title: {
          text: 'Stock history'
      },

      subtitle: {
          text: 'By category'
      },
      xAxis: {
          categories: ['9 Oct', '10 Oct', '11 Oct', '12 Oct', '13 Oct', '14 Oct', '15 Oct', '16 Oct']
      },
      yAxis: {
          title: {
              text: 'Stock'
          }
      },
      legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle'
      },

      plotOptions: {
          series: {
              label: {
                  connectorAllowed: false
              }
          }
      },

      series: [{
          name: 'Category 1',
          data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
      }, {
          name: 'Category 2',
          data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
      }, {
          name: 'Category 3',
          data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
      }, {
          name: 'Category 4',
          data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227]
      }, {
          name: 'Category 5',
          data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111]
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
            text: 'by Category'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: false,
                    distance: -30,
                    style: {
                        fontWeight: 'bold',
                        color: 'white'
                    }
                },
                startAngle: -180,
                endAngle: 180,
                showInLegend: true,
                center: ['50%', '50%']
            }
        },
        series: [{
            type: 'pie',
            name: 'Inventory Value Percentage',
            innerSize: '50%',
            data: [
                ['Category 1', 10.34],
                ['Category 2', 46.33],
                ['Category 3', 24.03],
                ['Category 4', 4.77],
                ['Category 5', 10.04]
            ]
        }]
    });

    Highcharts.chart('best-seller-inventory', {
      chart: {
          type: 'column'
      },
      title: {
          text: 'Best Seller Stock'
      },
      subtitle: {
          text: 'Click the columns to view stock history over the last days'
      },
      xAxis: {
          type: 'category'
      },
      yAxis: {
          title: {
              text: 'Unit in stock'
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
                  format: '{point.y}'
              }
          }
      },

      tooltip: {
          headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
          pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b> of total<br/>'
      },

      series: [{
          name: 'Best Sellers',
          colorByPoint: true,
          data: [{
              name: 'Product 7',
              y: 568,
              drilldown: 'Product 7'
          }, {
              name: 'Product 1',
              y: 25,
              drilldown: 'Product 1'
          }, {
              name: 'Product 6',
              y: 120,
              drilldown: 'Product 6'
          }]
      }],
      drilldown: {
          series: [{
              name: 'Product 7',
              id: 'Product 7',
              data: [
                  [
                      '13 Oct',
                      368
                  ],
                  [
                      '14 Oct',
                      24
                  ],
                  [
                      '15 Oct',
                      700
                  ],
                  [
                      '16 Oct',
                      568
                  ]
              ]
          }, {
              name: 'Product 1',
              id: 'Product 1',
              data: [
                  [
                      '13 Oct',
                      276
                  ],
                  [
                      '14 Oct',
                      132
                  ],
                  [
                      '15 Oct',
                      56
                  ],
                  [
                      '16 Oct',
                      25
                  ]
              ]
          }, {
              name: 'Product 6',
              id: 'Product 6',
              data: [
                  [
                      '13 Oct',
                      324
                  ],
                  [
                      '14 Oct',
                      77
                  ],
                  [
                      '15 Oct',
                      240
                  ],
                  [
                      '16 Oct',
                      120
                  ]
              ]
          }]
      }
    });

});
