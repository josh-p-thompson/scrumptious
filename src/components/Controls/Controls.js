import React, { useState } from 'react';
import './Controls.css';
import SelectLists from '../SelectLists/SelectLists.js'

import Button from '@material-ui/core/Button';
import TuneIcon from '@material-ui/icons/Tune';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

function Controls(props) {
    const {articles, selectedArticles, onSelectChange, toggleSelect, sortBy, onSortChange} = props;

    const [isFiltered, setFilter] = useState(false);

    const toggleFilter = () => setFilter(!isFiltered);
    
    const children = [
        <ToggleButton key={1} value="mentions" style={{fontSize: ".8rem", fontWeight: 700}} disableRipple={true}>
            Mentions
        </ToggleButton>,
        <ToggleButton key={2} value="distance" style={{fontSize: ".8rem", fontWeight: 700}} disableRipple={true}>
            Distance
        </ToggleButton>,
    ];

  return (
    <div className="Controls">
        <div className="Controls-buttons">
            <Button
            variant="contained"
            color="secondary"
            startIcon={<TuneIcon />}
            disableElevation={true}
            style={{fontSize: ".8rem", fontWeight: 700}}
            onClick={toggleFilter}
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
        {
        isFiltered ? (
            <SelectLists
                options={articles}
                onChange={onSelectChange}
                toggleSelect={toggleSelect}
                value={selectedArticles}
            />
        ) :(<empty></empty>)
        }
    </div>
  );
}

export default Controls;