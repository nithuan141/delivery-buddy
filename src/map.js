import React from 'react'

class Map extends React.Component{
    constructor(props){
        super(props);
    }
    render() {
        return <div id='map'></div>;
    }

    componentDidMount(){

        window.mapboxgl.accessToken = "pk.eyJ1Ijoibml0aHVhbjE0MSIsImEiOiJjazNsbjFmaHowOGhmM2lzMzhzbXgxaWdiIn0.clzt1jNW-HnG09bsDu2Yyw";

        var map = new window.mapboxgl.Map({
        container: "map", // container id
        style: "mapbox://styles/mapbox/satellite-v9", // stylesheet location
        center: [-0.1833427, 51.555543], // starting position [lng, lat]
        zoom: 16
        });

        map.addControl(
            new window.MapboxDirections({
              accessToken: window.mapboxgl.accessToken
            }),
            "top-left"
          );

        map.on("load", function() {
        fetch(
            "https://fordkerbhack.azure-api.net/features?viewport=51.5535770,-0.1887717,51.5589623,-0.1788357",
            // 51.51859,-0.17149,51.51753,-0.16891",
            // 51.51758,-0.0.07638,51.51760,-0.0.07645",
            {
            headers: {
                "Ocp-Apim-Subscription-Key": "a0502e1cba3e467f972c983e5ba31400"
            }
            }
        )
        .then(response => response.json())
            .then(curbLR => {
                console.log(curbLR)
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
                    "line-color": "#FFC300",
                    "line-width": 2
                    }
                });
            });
        });
    }
}

export default Map;