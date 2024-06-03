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
}
