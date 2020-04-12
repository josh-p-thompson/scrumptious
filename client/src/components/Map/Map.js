import React, { useState } from 'react';
import ReactMapGL, {GeolocateControl, NavigationControl} from 'react-map-gl';

import MapControls from '../MapControls/MapControls.js'
import MapMarkers from '../MapMarkers/MapMarkers.js'
import MapPopup from '../MapPopup/MapPopup.js'
import MapLayer from '../MapLayer/MapLayer.js'
import memoMap from './memoMap.js'

const MAPBOX_TOKEN = "pk.eyJ1Ijoiam9zaHVhLXAtdGhvbXBzb24iLCJhIjoiY2s0cnc3MXdkMDAxYTNtbzB5dno2NTgyMyJ9.-74N1PZ3SAwMrzPw66TyEQ"

function Map(props) {
    console.log('rendering Map');

    const {onGeolocate, restaurants, onMarkerClick, clickedRestaurant, setClickedRestaurant} = props;

    const [viewport, setViewport] = useState({
        width: 400,
        height: 400,
        latitude: 37.7830725948267,
        longitude: -122.41937128686605,
        zoom: 12,
    });

    return (
        <ReactMapGL
        {...viewport}
        width="100%"
        height="100%"
        mapStyle="mapbox://styles/joshua-p-thompson/ck746ul4r02a71ioeyvvik9lt?optimize=true"
        onViewportChange={nextViewport => setViewport(nextViewport)}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        maxZoom={17}
        >
            <MapControls 
                onGeolocate={onGeolocate}
            />
            <MapMarkers 
                restaurants={restaurants}
                onClick={onMarkerClick}
            />
            {/* <MapLayer
                restaurants={restaurants}
            /> */}
            {
            Object.keys(clickedRestaurant).length > 0 ? (
            <MapPopup 
                restaurant={clickedRestaurant}
                onClose={setClickedRestaurant}
            />
            ) : (null)
            }
        </ReactMapGL>
    );
}

export default memoMap(Map, ['restaurants', 'clickedRestaurant']);