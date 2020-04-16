import React from 'react';
import './LoadingSkeleton.css'
import Nav from '../Nav/Nav.js'

import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles'; 

function LoadingSkeleton(props) {
    const {} = props;
    const theme = createMuiTheme({
        typography: {
        fontFamily: [
            '"Muli"',
        ].join(','),
        subtitle1: {
            "fontWeight": 700,
        },
        }
    });


    return (
        <ThemeProvider theme={theme}>
        <div className="LoadingSkeleton">
        <div className="InfoSkeleton">
            <Nav />
        </div>
        <div className="MapSkeleton">
        </div>
        </div>
        </ThemeProvider>
    )
}

export default LoadingSkeleton;