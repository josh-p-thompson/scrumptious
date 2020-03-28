import React from 'react';
import ReactMapGL, {GeolocateControl, NavigationControl} from 'react-map-gl';

import MapControls from '../MapControls/MapControls.js'
import MapMarkers from '../MapMarkers/MapMarkers.js'
import MapPopup from '../MapPopup/MapPopup.js'

const MAPBOX_TOKEN = "pk.eyJ1Ijoiam9zaHVhLXAtdGhvbXBzb24iLCJhIjoiY2s0cnc3MXdkMDAxYTNtbzB5dno2NTgyMyJ9.-74N1PZ3SAwMrzPw66TyEQ"

function Map(props) {
    const {viewport, setViewport, onGeolocate, restaurants, onMarkerClick, clickedRestaurant, setClickedRestaurant} = props;
    return (
        <ReactMapGL
        {...viewport}
        width="100%"
        height="100%"
        mapStyle="mapbox://styles/joshua-p-thompson/ck746ul4r02a71ioeyvvik9lt"
        onViewportChange={setViewport}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        maxZoom={15}
        >
            <MapControls 
                onGeolocate={onGeolocate}
            />
            <MapMarkers 
                restaurants={restaurants}
                onClick={onMarkerClick}
            />
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

export default Map;