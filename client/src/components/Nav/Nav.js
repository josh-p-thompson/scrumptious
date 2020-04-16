import React from 'react';
import './Nav.css';
import MapIcon from '@material-ui/icons/Map';
import ListIcon from '@material-ui/icons/List';
import Button from '@material-ui/core/Button';

function Nav(props) {
  const {mobile, mobileView, toggleMobileView} = props;

  if (mobile) {
    let buttonIcon = <MapIcon />
    let buttonText = 'Map'
    if(mobileView === 'list') {
      buttonIcon = <ListIcon />
      buttonText = "List"
    }
    return (
      <div className="Nav">
        SCRUMPTIOUS
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          startIcon={buttonIcon}
          disableElevation={true}
          style={{fontWeight: 700}}
          onClick={toggleMobileView}
        >
          {buttonText}
        </Button>
      </div>
    );
  }
  
  return (
    <div className="Nav">
      SCRUMPTIOUS
    </div>
  );
}

export default Nav;