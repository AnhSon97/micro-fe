import { Component, NgZone } from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import am5geodata_data_countries2 from "@amcharts/amcharts5-geodata/data/countries2";
import { HttpClient } from '@angular/common/http';
import * as Highcharts from 'highcharts';
import HC_map from 'highcharts/modules/map';
HC_map(Highcharts);
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'host-mfe';
  check = false;
  highCharts: any;
  Highcharts: typeof Highcharts = Highcharts;
  fromLocation: [];
  toLocation: any;
  constructor(private zone: NgZone, private http: HttpClient) {
    console.log(process.env['API']);
  }

  async getLocation() {
    this.http.get('https://api.ipdata.co/27.72.88.155?api-key=0ec6da5c94c65955908145390565e8ac522d5995e5116bc46abe0c3e').subscribe((res: any) => {
      console.log(res);
      this.toLocation = res;
      this.buildChart(res?.latitude, res?.longitude);
      this.buildHightChart();
    })
  }

  buildChart(latitude: any, longitude: any) {
    var root = am5.Root.new("chartdiv");
    // Set themes
    root.setThemes([
      am5themes_Animated.new(root)
    ]);
    // Create the map chart
    var chart = root.container.children.push(am5map.MapChart.new(root, {
      panX: "translateX",
      panY: "translateY",
      projection: am5map.geoMercator()
    }));

    var polygonSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
      geoJSON: am5geodata_worldLow,
    }));

    polygonSeries.mapPolygons.template.setAll({
      tooltipText: "{name}",
      interactive: true,
      fill: am5.color(0xdadada),
      templateField: "polygonSettings",
    });
    polygonSeries.mapPolygons.template.states.create("hover", {
      fill: root.interfaceColors.get("primaryButtonHover")
    });

    polygonSeries.mapPolygons.template.states.create("active", {
      fill: root.interfaceColors.get("primaryButtonHover")
    });

    // this will be invisible line (note strokeOpacity = 0) along which invisible points will animate
    var lineSeries = chart.series.push(am5map.MapLineSeries.new(root, {}));
    lineSeries.mapLines.template.setAll({
      stroke: root.interfaceColors.get("alternativeBackground"),
      strokeOpacity: 0,
    });

    // this will be visible line. Lines will connectg animating points so they will look like animated
    var animatedLineSeries = chart.series.push(am5map.MapLineSeries.new(root, {
    }));
    animatedLineSeries.mapLines.template.setAll({
      stroke: am5.color("#EE00333"),
      strokeWidth: 2,
      strokeOpacity: 0.7,
    });
    // destination series
    var citySeries = chart.series.push(
      am5map.MapPointSeries.new(root, {})
    );

    // visible city circles
    citySeries.bullets.push(function (root, series, dataItem) {
      var container = am5.Container.new(root, {});
      container.children.push(
        am5.Circle.new(root, {
          radius: 3,
          tooltipText: "{title}",
          tooltipY: 0,
          fill: am5.color("#EE00333"),
          strokeWidth: 2,
        })
      );
      container.children.push(
        am5.Label.new(root, {
          text: "{title}",
          paddingLeft: 5,
          populateText: true,
          fontWeight: "normal",
          fontSize: 7,
          centerY: am5.p50
        })
      );
      return am5.Bullet.new(root, {
        sprite: container
      });
    });

    // invisible series which will animate along invisible lines
    var animatedBulletSeries = chart.series.push(
      am5map.MapPointSeries.new(root, {})
    );

    animatedBulletSeries.bullets.push(function () {
      var circle = am5.Circle.new(root, {
        radius: 0,
      });

      return am5.Bullet.new(root, {
        sprite: circle
      });
    });


    var cities = [
      {
        id: "hanoi",
        title: "Hà Nội",
        geometry: { type: "Point", coordinates: [longitude, latitude] },
      },
      {
        id: "brussels",
        title: "Brussels",
        geometry: { type: "Point", coordinates: [4.3676, 50.8371] }
      }, {
        id: "prague",
        title: "Prague",
        geometry: { type: "Point", coordinates: [14.4205, 50.0878] }
      }, {
        id: "athens",
        title: "Athens",
        geometry: { type: "Point", coordinates: [23.7166, 37.9792] }
      }, {
        id: "reykjavik",
        title: "Reykjavik",
        geometry: { type: "Point", coordinates: [-21.8952, 64.1353] }
      }, {
        id: "dublin",
        title: "Dublin",
        geometry: { type: "Point", coordinates: [-6.2675, 53.3441] }
      }, {
        id: "oslo",
        title: "Oslo",
        geometry: { type: "Point", coordinates: [10.7387, 59.9138] }
      }, {
        id: "lisbon",
        title: "Lisbon",
        geometry: { type: "Point", coordinates: [-9.1355, 38.7072] }
      }, {
        id: "moscow",
        title: "Moscow",
        geometry: { type: "Point", coordinates: [37.6176, 55.7558] }
      }, {
        id: "belgrade",
        title: "Belgrade",
        geometry: { type: "Point", coordinates: [20.4781, 44.8048] }
      }, {
        id: "bratislava",
        title: "Bratislava",
        geometry: { type: "Point", coordinates: [17.1547, 48.2116] }
      }, {
        id: "ljublana",
        title: "Ljubljana",
        geometry: { type: "Point", coordinates: [14.5060, 46.0514] }
      }, {
        id: "madrid",
        title: "Madrid",
        geometry: { type: "Point", coordinates: [-3.7033, 40.4167] }
      }, {
        id: "stockholm",
        title: "Stockholm",
        geometry: { type: "Point", coordinates: [18.0645, 59.3328] }
      }, {
        id: "bern",
        title: "Bern",
        geometry: { type: "Point", coordinates: [7.4481, 46.9480] }
      }, {
        id: "kiev",
        title: "Kiev",
        geometry: { type: "Point", coordinates: [30.5367, 50.4422] }
      }, {
        id: "paris",
        title: "Paris",
        geometry: { type: "Point", coordinates: [2.3510, 48.8567] }
      }];

    citySeries.data.setAll(cities);

    // Prepare line series data
    var destinations = ["reykjavik", "lisbon", "moscow", "belgrade", "ljublana", "madrid", "stockholm", "bern", "kiev", 'paris'];

    // London coordinates
    var originLongitude = -0.1262;
    var originLatitude = 51.5002;

    var londonDataItem: any = citySeries.getDataItemById("hanoi");

    // this will do all the animations
    am5.array.each(destinations, function (did) {
      var destinationDataItem: any = citySeries.getDataItemById(did);
      var lineDataItem = lineSeries.pushDataItem({});
      lineDataItem.set("pointsToConnect", [londonDataItem, destinationDataItem])

      var startDataItem = animatedBulletSeries.pushDataItem({});
      startDataItem.setAll({
        lineDataItem: lineDataItem,
        positionOnLine: 1,
      });

      var endDataItem = animatedBulletSeries.pushDataItem({});
      endDataItem.setAll({
        lineDataItem: lineDataItem,
        positionOnLine: 0
      });

      var animatedLineDataItem = animatedLineSeries.pushDataItem({});
      animatedLineDataItem.set("pointsToConnect", [startDataItem, endDataItem])

      var lon0 = londonDataItem.get("longitude");
      var lat0 = londonDataItem.get("latitude");

      var lon1 = destinationDataItem.get("longitude");
      var lat1 = destinationDataItem.get("latitude");


      var distance = Math.hypot(lon1 - lon0, lat1 - lat0);
      var duration = distance * 100;

      animateStart(startDataItem, endDataItem, duration);
    });

    function animateStart(startDataItem: any, endDataItem: any, duration: any) {

      var startAnimation = startDataItem.animate({
        key: "positionOnLine",
        from: 1,
        to: 0,
        duration: duration,
      });

      startAnimation.events.on("stopped", function () {
        animateEnd(startDataItem, endDataItem, duration);
      });
    }

    function animateEnd(startDataItem: any, endDataItem: any, duration: any) {
      startDataItem.set("positionOnLine", 0)
      var endAnimation = endDataItem.animate({
        key: "positionOnLine",
        from: 1,
        to: 0,
        duration: duration,
      })

      endAnimation.events.on("stopped", function () {
        animateStart(startDataItem, endDataItem, duration);
      });
    }
    let data = [];
    for (var id in am5geodata_data_countries2) {
      if (am5geodata_data_countries2.hasOwnProperty(id)) {
        let country = am5geodata_data_countries2[id];
        // console.log(country);
        if (country?.country == 'Viet Nam') {
          data.push({
            id: id,
            map: country.maps[0],
            polygonSettings: {
              fill: '#EE0033',
            }
          });
        }
      }
    }
    polygonSeries.data.setAll(data);
    polygonSeries.events.on("datavalidated", function () {
      chart.zoomToGeoPoint({
        longitude: longitude,
        latitude: latitude
      }, 3);
    });
    chart.set("zoomControl", am5map.ZoomControl.new(root, {}));


    // Make stuff animate on load
    chart.appear(1000, 100);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.getLocation();
    }, 1000);
  }

  async buildHightChart() {
    // Create a data value for each feature
    const topology = await fetch(
      'https://code.highcharts.com/mapdata/custom/world-highres.topo.json'
    ).then(response => response.json());
    const data = [
      {
        'hc-key': 'ye',
        color: '#ffa500',
        info: 'Yemen is where coffee took off.'
      },
      {
        'hc-key': 'br',
        color: '#c0ffd5',
        info: 'Coffee came from La Reunion.'
      },
      {
        'hc-key': 'fr',
        color: '#c0ffd5',
        info: 'Coffee came from Java.'
      },
      {
        'hc-key': 'gb',
        color: '#c0ffd5',
        info: 'Coffee came from Java.'
      },
      {
        'hc-key': 'id',
        color: '#c0ffd5',
        info: 'Coffee came from Yemen.'
      },
      {
        'hc-key': 'nl',
        color: '#c0ffd5',
        info: 'Coffee came from Java.'
      },
      {
        'hc-key': 'gu',
        color: '#c0ffd5',
        info: 'Coffee came from France.'
      },
      {
        'hc-key': 're',
        color: '#c0ffd5',
        info: 'Coffee came from Yemen.'
      },
      {
        'hc-key': 'vn',
        color: '#EE0033',
        info: 'Coffee came from Yemen.'
      }
    ];

    // Initialize the chart
    this.highCharts = {
      chart: {
        map: topology
      },
      title: {
        text: 'The history of the coffee bean ☕'
      },
      legend: {
        enabled: false
      },
      tooltip: {
        useHTML: true,
        headerFormat: '<b>{point.key}</b>:<br/>',
        pointFormat: '{point.info}'
      },
      mapView: {
        fitToGeometry: {
          type: 'MultiPoint',
          coordinates: [
            // Alaska west
            [-164, 54],
            // Greenland north
            [-35, 84],
            // New Zealand east
            [179, -38],
            // Chile south
            [-68, -55]
          ]
        }
      },
      series: [
        {
          data,
          keys: ['hc-key', 'color', 'info'],
          name: 'Coffee'
        },
        {
          type: 'mapline',
          data: [
            {
              geometry: {
                type: 'LineString',
                coordinates: [
                  [48.516388, 15.552727], // Yemen
                  [this.toLocation?.longitude, this.toLocation?.latitude] // vietnamese
                ]
              },
              className: 'animated-line',
              color: '#666'
            },
            {
              geometry: {
                type: 'LineString',
                coordinates: [
                  [48.516388, 15.552727], // Yemen
                  [this.toLocation?.longitude, this.toLocation?.latitude] // vietnamese
                ]
              },
              className: 'animated-line',
              color: '#666'
            },
            {
              geometry: {
                type: 'LineString',
                coordinates: [
                  [55.5325, -21.114444], // La reunion
                  [this.toLocation?.longitude, this.toLocation?.latitude] // vietnamese
                ]
              },
              className: 'animated-line',
              color: '#666'
            },
            {
              geometry: {
                type: 'LineString',
                coordinates: [
                  [48.516388, 15.552727], // Yemen
                  [this.toLocation?.longitude, this.toLocation?.latitude] // vietnamese
                ]
              },
              className: 'animated-line',
              color: '#666'
            },
            {
              geometry: {
                type: 'LineString',
                coordinates: [
                  [110.004444, -7.491667], // Java
                  [this.toLocation?.longitude, this.toLocation?.latitude] // vietnamese
                ]
              },
              className: 'animated-line',
              color: '#666'
            },
            {
              geometry: {
                type: 'LineString',
                coordinates: [
                  [-3, 55], // UK
                  [this.toLocation?.longitude, this.toLocation?.latitude] // vietnamese
                ]
              },
              className: 'animated-line',
              color: '#666'
            },
            {
              geometry: {
                type: 'LineString',
                coordinates: [
                  [2.352222, 48.856613], // Paris
                  [this.toLocation?.longitude, this.toLocation?.latitude] // vietnamese
                ]
              },
              className: 'animated-line',
              color: '#666'
            }
          ],
          lineWidth: 2,
          enableMouseTracking: false
        },
        {
          type: 'mappoint',
          color: '#333',
          dataLabels: {
            format: '<b>{point.name}</b><br><span ' +
              'style="font-weight: normal; opacity: 0.5">' +
              '{point.custom.arrival}</span>',
            align: 'left',
            verticalAlign: 'middle'
          },
          data: [
            {
              name: 'Yemen',
              geometry: {
                type: 'Point',
                coordinates: [48.516388, 15.552727] // Yemen
              },
              custom: {
                arrival: 1414
              },
              dataLabels: {
                align: 'right'
              }
            },
            {
              name: 'Java',
              geometry: {
                type: 'Point',
                coordinates: [110.004444, -7.491667] // Java
              },
              custom: {
                arrival: 1696
              }
            },
            {
              name: 'La Reunion',
              geometry: {
                type: 'Point',
                coordinates: [55.5325, -21.114444] // La reunion
              },
              custom: {
                arrival: 1708
              }
            },
            {
              name: 'Brazil',
              geometry: {
                type: 'Point',
                coordinates: [-43.2, -22.9] // Brazil
              },
              custom: {
                arrival: 1770
              },
              dataLabels: {
                align: 'right'
              }
            },
            {
              name: 'India',
              geometry: {
                type: 'Point',
                coordinates: [78, 21] // India
              },
              custom: {
                arrival: 1670
              }
            },
            {
              name: 'Amsterdam',
              geometry: {
                type: 'Point',
                coordinates: [4.9, 52.366667] // Amsterdam
              },
              custom: {
                arrival: 1696
              }
            },
            {
              name: 'Antilles',
              geometry: {
                type: 'Point',
                coordinates: [-61.030556, 14.681944] // Antilles
              },
              custom: {
                arrival: 1714
              },
              dataLabels: {
                align: 'right'
              }
            },
            {
              name: 'Guyane',
              geometry: {
                type: 'Point',
                coordinates: [-53, 4] // Guyane
              },
              custom: {
                arrival: 1714
              },
              dataLabels: {
                align: 'right'
              }
            }
          ],
          enableMouseTracking: false
        }
      ]
    };
  }
  chartBar() {
    var root = am5.Root.new("chartdiv");
    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
      am5themes_Animated.new(root)
    ]);


    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    var chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: false,
      panY: false,
      wheelX: "none",
      wheelY: "none",
      paddingLeft: 0,
      paddingRight: 20,
    }));

    // We don't want zoom-out button to appear while animating, so we hide it
    chart.zoomOutButton.set("forceHidden", true);


    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    var yRenderer = am5xy.AxisRendererY.new(root, {
      minGridDistance: 30,
      minorGridEnabled: true
    });

    yRenderer.grid.template.set("location", 1);

    var yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
      maxDeviation: 0,
      categoryField: "network",
      renderer: yRenderer,
    }));

    var xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
      maxDeviation: 0,
      min: 0,
      numberFormatter: am5.NumberFormatter.new(root, {
        "numberFormat": "#,###a"
      }),
      extraMax: 0.2,
      renderer: am5xy.AxisRendererX.new(root, {
        strokeOpacity: 0.1,
      })
    }));


    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    var series = chart.series.push(am5xy.ColumnSeries.new(root, {
      name: "Series 1",
      xAxis: xAxis,
      yAxis: yAxis,
      valueXField: "value",
      categoryYField: "network",
    }));
    series.bullets.push(function () {
      return am5.Bullet.new(root, {
        locationX: 1,
        locationY: 0.5,
        sprite: am5.Label.new(root, {
          centerY: am5.p50,
          text: "{test}",
          populateText: true
        })
      });
    });

    // Rounded corners for columns
    series.columns.template.setAll({
      cornerRadiusTR: 5,
      cornerRadiusBR: 5,
      strokeOpacity: 0,
      height: am5.p50,
    });


    // Make each column to be of a different color
    series.columns.template.adapters.add("fill", function (fill, target) {
      return am5.color(0x095256);
    });



    // Set data
    var data = [
      {
        "network": "Facebook",
        "value": 40000,
        "test": "123"
      },
      {
        "network": "Google+",
        "value": 100000
      },
      {
        "network": "Instagram",
        "value": 1000000
      },
      {
        "network": "Pinterest",
        "value": 2000000
      }
    ];

    yAxis.data.setAll(data);
    series.data.setAll(data);
    series.appear(1000);
    chart.appear(1000, 100);
  }

  barchart2() {
    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    var root = am5.Root.new("chartdiv");
    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
      am5themes_Animated.new(root)
    ]);


    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    var chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: false,
      panY: false,
      paddingLeft: 0,
      wheelX: "panX",
      wheelY: "zoomX",
      layout: root.verticalLayout
    }));


    // Add legend
    // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
    var legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50
      })
    );

    var data = [{
      "year": "2021",
      "europe": 2.5,
      "namerica": 2.5,
      "asia": 2.1,
      "lamerica": 1,
      "meast": 0.8,
      "africa": 0.4
    }, {
      "year": "2022",
      "europe": 2.6,
      "namerica": 2.7,
      "asia": 2.2,
      "lamerica": 0.5,
      "meast": 0.4,
      "africa": 0.3
    }, {
      "year": "2023",
      "europe": 2.8,
      "namerica": 2.9,
      "asia": 2.4,
      "lamerica": 0.3,
      "meast": 0.9,
      "africa": 0.5
    }]


    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    var xRenderer = am5xy.AxisRendererX.new(root, {
      cellStartLocation: 0.1,
      cellEndLocation: 0.9,
      minorGridEnabled: true
    })

    var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
      categoryField: "year",
      renderer: xRenderer,
      tooltip: am5.Tooltip.new(root, {})
    }));

    xRenderer.grid.template.setAll({
      location: 1
    })

    xAxis.data.setAll(data);

    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {
        strokeOpacity: 0.1
      }),
      numberFormatter: am5.NumberFormatter.new(root, {
        "numberFormat": "#,###a"
      }),
    }));


    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    function makeSeries(name, fieldName, fill) {
      var series = chart.series.push(am5xy.ColumnSeries.new(root, {
        name: name,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: fieldName,
        categoryXField: "year"
      }));

      series.columns.template.setAll({
        tooltipText: "{name}, {categoryX}:{valueY}",
        width: am5.percent(90),
        tooltipY: 0,
        strokeOpacity: 0,
        cornerRadiusTR: 5,
        cornerRadiusTL: 5,
      });
      series.columns.template.states.create("riseFromPrevious", {
        fill: am5.color(fill),
      });

      series.data.setAll(data);

      // Make stuff animate on load
      // https://www.amcharts.com/docs/v5/concepts/animations/
      series.appear();
      series.bullets.push(function () {
        return am5.Bullet.new(root, {
          locationY: 0,
          sprite: am5.Label.new(root, {
            text: "{valueY}",
            fill: root.interfaceColors.get("alternativeText"),
            centerY: 0,
            centerX: am5.p50,
            populateText: true
          })
        });
      });
    }

    makeSeries("Europe", "europe", "#2DC6F9");
    makeSeries("North America", "namerica", "#F3B90C");


    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    chart.appear(1000, 100);
  }

  pieChart() {

    var root = am5.Root.new("chartdiv");
    root.setThemes([
      am5themes_Animated.new(root)
    ]);
    var chart = root.container.children.push(am5percent.PieChart.new(root, {
      startAngle: 0,
      endAngle: 360,
      layout: root.verticalLayout,
      innerRadius: am5.percent(50)
    }));
    var bgColor = root.interfaceColors.get("background");
    var series = chart.series.push(am5percent.PieSeries.new(root, {
      startAngle: 0,
      endAngle: 360,
      valueField: "value",
      categoryField: "category",
      alignLabels: false,
    }));
    series.set("colors", am5.ColorSet.new(root, {
      colors: [
        am5.color("#A666FF"),
        am5.color("#55CD2C"),
        am5.color("#FF66BF"),
        am5.color("#29CCA3"),
        am5.color("#F1774E"),
        am5.color("#7194FF"),
        am5.color("#9EEC11"),
        am5.color("#2DC6F9"),
        am5.color("#F3B90C"),
      ]
    }))

    series.slices.template.setAll({
      strokeWidth: 2,
      stroke: bgColor,
    });

    series.ticks.template.setAll({
      forceHidden: true
    });
    series.data.setAll([
      { value: 10, category: "One" },
      { value: 9, category: "Two" },
      { value: 6, category: "Three" },
      { value: 5, category: "Four" },
      { value: 4, category: "Five" },
      { value: 3, category: "Six" },
      { value: 1, category: "Seven" },
      { value: 17, category: "Six" },
      { value: 4, category: "Seven" }
    ]);

    series.appear(1000, 100);
  }
}


