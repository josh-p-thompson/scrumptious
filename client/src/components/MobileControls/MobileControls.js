import React, { useState } from 'react';
import './Controls.css';
import SelectLists from '../SelectLists/SelectLists.js'
import memoUtil from '../../utils/memoUtil.js'

import Button from '@material-ui/core/Button';
import RefreshIcon from '@material-ui/icons/Refresh';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import FilterListIcon from '@material-ui/icons/FilterList';
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';

const childrenDisabled = [
    <ToggleButton key={1} value="mentions" style={{fontSize: ".8rem", fontWeight: 700}} disableRipple={true}>
        Mentions
    </ToggleButton>,
    <ToggleButton key={2} value="distance" style={{fontSize: ".8rem", fontWeight: 700}} disableRipple={true} disabled>
        Distance
    </ToggleButton>,
];

const children = [
    <ToggleButton key={1} value="mentions" style={{fontSize: ".8rem", fontWeight: 700}} disableRipple={true}>
        Mentions
    </ToggleButton>,
    <ToggleButton key={2} value="distance" style={{fontSize: ".8rem", fontWeight: 700}} disableRipple={true}>
        Distance
    </ToggleButton>,
];

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
    appBar: {
      position: 'static',
    },
    title: {
      justifyContent: 'space-between',
    },
    applyButton: {
        fontSize: ".8rem", 
        fontWeight: 700,
    }
  }));

function MobileControls(props) {
    const {articlesData, onSelectChange, selectValue, sortBy, onSortChange, onApplyFilter, inputValue, handleInputChange, userLocation, dialogOpen, toggleDialog} = props;
    console.log('rendering Controls');

    const classes = useStyles();
    

    if (articlesData.length === 0) {
        return (
            <div className="Controls">
                <div className="Controls-buttons">
                </div>
            </div>
        )
    }

    return (
    <div className="Controls">
        <div className="Controls-buttons">
            <Button
            variant="contained"
            color="secondary"
            startIcon={<FilterListIcon />}
            disableElevation={true}
            style={{fontSize: ".8rem", fontWeight: 700}}
            onClick={toggleDialog}
            >
                Filter
            </Button>
            {
            userLocation.lat === null ? (
                <ToggleButtonGroup 
                    size="small" 
                    value={sortBy} 
                    exclusive 
                    onChange={onSortChange}>
                    {childrenDisabled}
                </ToggleButtonGroup>
            ) : (
                <ToggleButtonGroup 
                    size="small" 
                    value={sortBy} 
                    exclusive 
                    onChange={onSortChange}>
                    {children}
                </ToggleButtonGroup>
            )
            }
        </div>
        <Dialog 
            fullScreen 
            open={dialogOpen} 
            onClose={toggleDialog} 
            TransitionComponent={Transition}
        >
            <AppBar color='secondary' className={classes.appBar}>
                <Toolbar className={classes.title}>
                    <IconButton edge="start" color="inherit" onClick={toggleDialog} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Button edge="end" autoFocus color="inherit" className={classes.applyButton} style={{fontSize: ".8rem"}} onClick={() => {toggleDialog(); onApplyFilter()}}>
                        APPLY
                    </Button>
                </Toolbar>
            </AppBar>
            <div className="Controls-list">
            <SelectLists
                options={articlesData}
                onChange={onSelectChange}
                value={selectValue}
                inputValue={inputValue}
                handleInputChange={handleInputChange}
            />
            </div>
        </Dialog>
    </div>
    );
}

export default MobileControls;

// export default memoUtil(MobileControls, ['articlesData', 'sortBy', 'userLocation', 'dialogOpen', 'selectValue', 'inputValue']);