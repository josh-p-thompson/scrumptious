import React, { useState } from 'react';
import './Controls.css';
import SelectLists from '../SelectLists/SelectLists.js'

import Button from '@material-ui/core/Button';
import RefreshIcon from '@material-ui/icons/Refresh';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

function Controls(props) {
    const {articlesData, onSelectChange, selectValue, sortBy, onSortChange, onApplyFilter, inputValue, handleInputChange} = props;

    console.log('rendering Controls');
    
    const children = [
        <ToggleButton key={1} value="mentions" style={{fontSize: ".8rem", fontWeight: 700}} disableRipple={true}>
            Mentions
        </ToggleButton>,
        <ToggleButton key={2} value="distance" style={{fontSize: ".8rem", fontWeight: 700}} disableRipple={true}>
            Distance
        </ToggleButton>,
    ];

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
            startIcon={<RefreshIcon />}
            disableElevation={true}
            style={{fontSize: ".8rem", fontWeight: 700}}
            onClick={onApplyFilter}
            >
                Filter
            </Button>
            <ToggleButtonGroup 
                size="small" 
                value={sortBy} 
                exclusive 
                onChange={onSortChange}>
                {children}
            </ToggleButtonGroup>
        </div>
        <SelectLists
            options={articlesData}
            onChange={onSelectChange}
            value={selectValue}
            inputValue={inputValue}
            handleInputChange={handleInputChange}
        />
    </div>
    );
}

export default Controls;