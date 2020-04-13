// class-based component to use PureComponent
import React from 'react';
import {Popup} from 'react-map-gl';
import './MapPopup.css'

import Typography from '@material-ui/core/Typography';
import InfoIcon from '@material-ui/icons/Info';
import IconButton from '@material-ui/core/IconButton';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

function MapPopup(props) {
    const {restaurant, onClose} = props;
    console.log('rendering popup');

    return (
        <Popup
            latitude={restaurant.lat}
            longitude={restaurant.lng}
            closeButton={false}
            offsetTop={-35}
            onClose={() => onClose({})}
            style={{opacity: "50%"}}
        >
            <div className="Popup-text">
                <Typography variant="subtitle1" style={{marginRight: 3}}>
                    {restaurant.name}
                </Typography>
                <IconButton size="small" edge="end">
                    <ChevronRightIcon />
                </IconButton>
            </div>
        </Popup>
    )
}
export default React.memo(MapPopup);