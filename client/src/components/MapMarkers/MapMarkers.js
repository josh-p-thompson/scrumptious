import React, {PureComponent} from 'react';
import {Marker} from 'react-map-gl';
import memoMapMarkers from './memoMapMarkers.js'

const ICON = `M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z`;

const SIZE = 35;

function MapMarkers(props) {
    const {restaurants, onClick} = props;
    console.log('rendering markers');
    return restaurants.map(rest =>
        <Marker 
        key={rest.id} 
        longitude={rest.lng} 
        latitude={rest.lat} 
        >
            <svg
                height={SIZE}
                viewBox="0 0 24 24"
                style={{
                    cursor: 'pointer',
                    fill: '#f50057',
                    opacity: "70%",
                    stroke: 'black',
                    transform: `translate(${-SIZE / 2}px,${-SIZE}px)`
                }}
                onClick={() => onClick(rest)}
            >
                <path d={ICON} />
            </svg>
        </Marker>
    )
}
export default memoMapMarkers(MapMarkers, ['restaurants']);