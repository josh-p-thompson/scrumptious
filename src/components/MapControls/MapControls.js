import React from 'react';
import {GeolocateControl, NavigationControl} from 'react-map-gl';

const geolocateStyle = {
    position: 'absolute',
    bottom: 20,
    right: 50,
    margin: 10,
};
  
const navStyle = {
    position: 'absolute',
    bottom: 60,
    right: 50,
    padding: 10,
};

function MapControls(props) {
    const {onGeolocate} = props;
    return (
        <div className="MapControls">
            <GeolocateControl
            positionOptions={{enableHighAccuracy: true}}
            style={geolocateStyle}
            onGeolocate={onGeolocate}
            />
            <div style={navStyle}>
                <NavigationControl
                    showCompass={false}
                />
            </div>
        </div>
    );
}

export default MapControls;