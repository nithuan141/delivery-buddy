import React from 'react'
import Logo from './park-point.png'
import DeliveryPoint from './delivery-point.png'
import ToiletImg from './toiletpoint.png'
import config from './config'

class Map extends React.Component{
    
  constructor(props){
        super(props);
    }

    render() {
        return <div id='map'></div>;
    }

    componentDidMount(){
      this.drawMap();
    }

    drawMap =()=>{
      window.mapboxgl.accessToken = config.maboxtoken;
      //Initialising the map
      var map = new window.mapboxgl.Map({
          container: "map", // container id
          style: "mapbox://styles/mapbox/streets-v10", // stylesheet location
          center: [-0.167889, 51.551442], 
          zoom: 17
      });

      // Adding a plugin to enter direction
      let directions = new window.MapboxDirections({
        accessToken: window.mapboxgl.accessToken
      });
      
      map.addControl(
        directions,
        "top-left"
      );
      
      let that = this;
      map.on("load", function() {
        that.addParkingSlots(map);
        that.addDeliveryPoint(map);
        that.addParkingBays(map); 
        that.addPublicToilets(map);
        that.addCircle(map);
      });
    }

    addDeliveryPoint=(map)=>{
      map.loadImage(DeliveryPoint, 
        function(error, image) {
        if (error) throw error;
            map.addImage('deliverypoint', image);
            map.addLayer({
                "id": "points",
                "type": "symbol",
                "source": {
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "features": [{
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [-0.168199, 51.551713]
                    }}, 
                    {
                      "type": "Feature",
                      "geometry": {
                          "type": "Point",
                          "coordinates": [-0.167702, 51.551142]
                    }},
                    {
                      "type": "Feature",
                      "geometry": {
                          "type": "Point",
                          "coordinates": [-0.1684758, 51.551392]
                      }} 
                      
                  ]
                }
            },
            "layout": {
            "icon-image": "deliverypoint",
            "icon-size": 0.08
            }
        });
      });
    }

    addParkingSlots=(map)=>{
      map.loadImage(Logo, 
        function(error, image) {
        if (error) throw error;
            map.addImage('location', image);
            map.addLayer({
                "id": "location",
                "type": "symbol",
                "source": {
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "features": [{
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [-0.167889, 51.551442]
                    }},
                      {
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [-0.168480, 51.551035]
                        }} ,
                        {
                          "type": "Feature",
                          "geometry": {
                              "type": "Point",
                              "coordinates": [-0.168754, 51.552299]
                        }}
                  ]
                }
            },
            "layout": {
            "icon-image": "location",
            "icon-size": 0.10
            }
        });
      });
    }

    addPublicToilets=(map)=>{
      map.loadImage(ToiletImg, 
        function(error, image) {
        if (error) throw error;
            map.addImage('toilet', image);
            map.addLayer({
                "id": "toilet",
                "type": "symbol",
                "source": {
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "features": [{
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [-0.168647, 51.551909]
                    }}
                  ]
                }
            },
            "layout": {
            "icon-image": "toilet",
            "icon-size": 0.07
            }
        });
      });
    }

    // Featching from the kerbspace API and displaying the parking bays, parameter is the viewport
    addParkingBays = (map) => {
      fetch(
        "https://fordkerbhack.azure-api.net/features?viewport=51.549536, -0.168540,51.551699, -0.164796",
        {
          headers: {
            "Ocp-Apim-Subscription-Key": "a0502e1cba3e467f972c983e5ba31400"
          }
        }
      )
        .then(response => response.json())
        .then(curbLR => {
          map.addLayer({
            id: "bays",
            type: "line",
            source: {
              type: "geojson",
              data: curbLR
            },
            layout: {
              "line-join": "round",
              "line-cap": "round"
            },
            paint: {
              "line-color": "#e90059",
              "line-width": 3
            }
          });
      });
    }

    addCircle = (map) =>{
      map.addSource('circleData', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features:  [{
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [-0.167831, 51.552119]
            }}
          ],
        },
      });
    
      // add a layer that displays the data
      map.addLayer({
        id: 'data',
        type: 'circle',
        source: 'circleData',
        paint: {
          'circle-color': 'lightgreen',
          'circle-radius': 15,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#333',
       },
      });
    }
}

export default Map;