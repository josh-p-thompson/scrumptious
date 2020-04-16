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
        height: '3rem'
    }
});


function SelectLists(props) {
    const {options, onChange, value, inputValue, handleInputChange} = props;

    console.log('rendering SelectLists');
    
    const classes = useStyles();
    
    return (
    <div className="SelectLists">
        <Autocomplete
            multiple
            filterSelectedOptions
            classes={classes}
            id="select-lists"
            options={options}
            value={value}
            onChange={onChange}
            disableCloseOnSelect
            disableListWrap
            inputValue={inputValue}
            onInputChange={handleInputChange}
            getOptionLabel={option => option.title}
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