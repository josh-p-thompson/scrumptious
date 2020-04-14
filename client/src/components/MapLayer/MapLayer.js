import React from 'react';
import {Source, Layer} from 'react-map-gl';

const clusterLayer = {
    id: 'clusters',
    type: 'circle',
    source: 'restaurants',
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': ['step', ['get', 'point_count'], '#f28cb1', 100, '#f1f075', 750, '#f1f075'],
      'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40]
    }
};

const clusterCountLayer = {
    id: 'cluster-count',
    type: 'symbol',
    source: 'restaurants',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 12
    }
};

const unclusteredPointLayer = {
    id: 'unclustered-point',
    source: 'restaurants',
    filter: ['!', ['has', 'point_count']],
    type: 'symbol',
    layout: {
      'icon-image': 'marker',
      'icon-allow-overlap': true,
      'icon-anchor': 'bottom',
      'icon-size': 1.5,
      'icon-padding': 0,
      'icon-allow-overlap': true, 
    }
}

function MapLayer(props) {
    console.log('rendering MapLayer');
    const {restaurantsGeojson} = props;
    return (
    <Source 
        type="geojson" 
        data={restaurantsGeojson}
        cluster={true}
        clusterMaxZoom={13}
        clusterRadius={50}
    >
        <Layer {...clusterLayer} />
        <Layer {...clusterCountLayer} />
        <Layer {...unclusteredPointLayer} />
    </Source>
    );
}

export default MapLayer;