// class-based component to use PureComponent
import React from 'react';
import {Popup} from 'react-map-gl';
import './MapPopup.css'

import Typography from '@material-ui/core/Typography';
import InfoIcon from '@material-ui/icons/Info';
import IconButton from '@material-ui/core/IconButton';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

function MapPopup(props) {
    const {restaurant, setClickedPopup} = props;
    console.log('rendering popup');

    return (
        <Popup
            latitude={restaurant.lat}
            longitude={restaurant.lng}
            closeButton={false}
            offsetTop={-35}
            style={{opacity: "50%"}}
        >
            <div className="Popup-text">
                <div className="Popup-text-info">
                <Typography variant="subtitle2">
                    {restaurant.name}
                </Typography>
                <Typography variant="caption">
                    {restaurant.address.split(',').slice(0, 2).join(',')}
                </Typography>
                </div>
                <div className="Popup-text-icon">
                <IconButton size="small" edge="end" style={{border: '1px solid', borderColor: '#DCDCDC'}} onClick={()=> setClickedPopup(restaurant)}>
                    <ChevronRightIcon />
                </IconButton>
                </div>
            </div>
        </Popup>
    )
}
export default React.memo(MapPopup);