$(document).ready(function () {

  $('#inventory-tab').addClass('active');
/*
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
*/
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

var best = function(array, n){
    var sArray = array.sort(function(a, b){
        return b.value - a.value;
    });

    var res = [];
    var others = 0;
    var i = 0;

    for (s of sArray) {
        if(i < n){
            res.push({
                name: s.name,
                value: s.value
            })
        }
        else{
            others += s.value;
        }
        i++;
    }
    console.log(others);
    if(others>0)
        res.push({
            name: "Others",
            value: others
        })
    console.log(res);
    return res;
}

var createPizza= function(categories){
    var data = [];
    for (i of categories) {
        data.push([i.name, i.value]);
    }

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
            data: data
        }]
    });
}
var updateValue= function($scope, $http){
    var url = 'http://localhost:49822/api/Inventory/date/' + $scope.chosenYear;
    
    if($scope.chosenMonth != null){
        url += "/" + $scope.chosenMonth;
    }
    
    $http.get(url).then(function (success){
        var data = [];
        var categories = [];
        var value = 0;
        for (i of success.data) {
            var name = i.Family || "";
            if(data[name] !=null)
                data[name] += i.TotalValue;
            else
                data[name] = i.TotalValue; 
        }
        
        for (i in data) {
            categories.push({
                name: i,
                value: data[i] 
            })
            value += data[i] ;
        }
        console.log(data);
        $scope.totalValue = value;
        $scope.step++;
        createPizza(best(categories, 5));
    },function (error){
        $scope.contents = [{heading:"Error",description:"Could not load json data"}];
    });
}

var updateOutOfStock= function($scope, $http){
    $scope.step = 2
    var url = 'http://localhost:49822/api/Inventory/outOfStock/';
    
    $http.get(url).then(function (success){
        for (i in success.data) {
            var stock = success.data[i];

            if(i < 5){
                $scope.prodOutOfStock.push(stock);
            }
        }
    },function (error){
        $scope.contents = [{heading:"Error",description:"Could not load json data"}];
    });
}

var updateData= function($scope, $http){
    if($scope.step > 2)
        $scope.step = 2
    //Blur container and show spinner
    $('#loader').show();
    $('.container').addClass('blur');
    
    updateValue($scope, $http);
    //updateSuppliers($scope, $http);
    //updateGraph($scope, $http);
}

var app = angular.module('inventory_app', []).config(['$interpolateProvider', function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
  }]);

  app.filter('percentage', ['$filter', function ($filter) {
    return function (input, decimals) {
      return $filter('number')(input * 100, decimals) + '%';
    };
  }]);

  app.filter('euro', ['$filter', function ($filter) {
    return function (input) {
      return $filter('number')(input, 2) + '€';
    };
  }]);

app.controller('inventory_controller', function($scope, $http) {
    //init vars
    var today = new Date();
    
    $scope.chosenYear = today.getFullYear();
    $scope.chosenMonth = null;
    $scope.prodOutOfStock = [];
        
    $scope.years = [];
    for(var i = 2015; i <= today.getFullYear(); i++){
           $scope.years.push(i);
    }
    $scope.months = [{value: 1, name: 'Jan'},{value: 2, name: 'Feb'},{value: 3, name: 'Mar'},{value: 4, name: 'Apr'},{value: 5, name: 'May'},{value: 6, name: 'Jun'},
    {value: 7, name: 'Jul'},{value: 8, name: 'Aug'},{value: 9, name: 'Sep'},{value: 10, name: 'Oct'},{value: 11, name: 'Nov'},{value: 12, name: 'Dec'}];
    
    $scope.$watch('step', function() {
        if($scope.step == 3){                    
            //Unblur container and hide spinner
            $('#loader').hide();
            $('.container').removeClass('blur');
        }
    });

    $scope.chooseYear = function(year){
        $scope.chosenYear = year;        
        updateData($scope, $http);
    };

    $scope.update = function(){
        $('.month-selector input[type="radio"]').parent().removeClass('active');
        $('.month-selector input[type="radio"]:checked').parent().addClass('active');
        updateData($scope, $http);
    }

    updateOutOfStock($scope,$http);
    updateData($scope,$http);

});