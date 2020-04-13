import React from 'react';
import {Source, Layer} from 'react-map-gl';

// data layer
const dataLayer = {
    id: 'data',
    type: 'symbol',
    layout: {
      'icon-image': 'restaurant-15',
      'icon-allow-overlap': true,
      'icon-anchor': 'bottom',
      'icon-size': 1.5,
      'icon-padding': 0,
      'icon-allow-overlap': true, 
    }
}

const toGeojson = (restaurants) => {
    console.log('converting to geojson');
    let features = [];
    for (let rest of restaurants) {
        let point = {
            "geometry": {
                "type": "Point", 
                "coordinates": [rest.lng, rest.lat]
            }, 
            "type": "Feature", 
            "properties": rest
        };
        features.push(point);
    }
    return {
        "type": "FeatureCollection",
        "features": features
    };
}

function MapLayer(props) {
    const {restaurants} = props;

    const data = toGeojson(restaurants);

    return (
    <Source type="geojson" data={data}>
        <Layer {...dataLayer} />
    </Source>
    );
}

export default MapLayer;