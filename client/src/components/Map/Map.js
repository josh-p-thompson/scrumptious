import React, { useState } from 'react';
import ReactMapGL from 'react-map-gl';

import MapControls from '../MapControls/MapControls.js'
import MapPopup from '../MapPopup/MapPopup.js'
import MapLayer from '../MapLayer/MapLayer.js'
import memoUtil from '../../utils/memoUtil.js'

const MAPBOX_TOKEN = "pk.eyJ1Ijoiam9zaHVhLXAtdGhvbXBzb24iLCJhIjoiY2s0cnc3MXdkMDAxYTNtbzB5dno2NTgyMyJ9.-74N1PZ3SAwMrzPw66TyEQ"

function Map(props) {
    console.log('rendering Map');

    const {viewport, setViewport, onGeolocate, restaurantsGeojson, onMapClick, clickedRestaurant, setClickedRestaurant, setClickedPopup} = props;

    return (
        <ReactMapGL
        {...viewport}
        width="100%"
        height="100%"
        mapStyle="mapbox://styles/joshua-p-thompson/ck746ul4r02a71ioeyvvik9lt?optimize=true"
        onViewportChange={nextViewport => setViewport(nextViewport)}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        maxZoom={17}
        interactiveLayerIds={["unclustered-point"]}
        onClick={onMapClick}
        >
            <MapControls 
                onGeolocate={onGeolocate}
            />
            <MapLayer
                restaurantsGeojson={restaurantsGeojson}
            />
            {
            Object.keys(clickedRestaurant).length > 0 ? (
            <MapPopup 
                restaurant={clickedRestaurant}
                setClickedPopup={setClickedPopup}
            />
            ) : (null)
            }
        </ReactMapGL>
    );
}

export default memoUtil(Map, ['restaurantsGeojson', 'clickedRestaurant', 'viewport']);
