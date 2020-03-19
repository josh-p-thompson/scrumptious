import React from 'react';

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { makeStyles } from "@material-ui/core/styles";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

// use this to style the dropdown options
const useStyles = makeStyles({
    root: {
        width: "100%",
        marginTop: '1rem',
    },
    option: {
        fontSize: '.8rem',
        padding: 4, 
    }
});


function SelectLists(props) {
    const {options, onChange, toggleSelect, value} = props;
    
    const classes = useStyles();
    
    return (
    <div className="SelectLists">
        <Autocomplete
            multiple
            disableListWrap
            classes={classes}
            id="select-lists"
            options={options}
            value={value}
            onChange={onChange}
            onOpen={toggleSelect}
            onClose={toggleSelect}
            disableCloseOnSelect
            getOptionLabel={option => option.title}
            renderOption={(option, { selected }) => (
                <React.Fragment>
                <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                />
                {option.title}
                </React.Fragment>
            )}
            renderInput={params => (
                <TextField 
                    {...params} 
                    variant="filled" 
                    color="secondary"
                    label="Eater Lists" 
                    InputLabelProps={{
                        style: {fontSize: ".8rem"} 
                    }}
                />
            )}
        />
    </div>
  );
}

export default SelectLists;