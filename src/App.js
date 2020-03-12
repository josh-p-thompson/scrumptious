import React from 'react';
import './App.css';

import Nav from './components/Nav/Nav.js'
import FoodList from './components/FoodList/FoodList.js'

import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      '"Merriweather"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(','),
    subtitle1: {
      "fontWeight": 700,
    },
  }
});


function App() {
  return (
    <ThemeProvider theme={theme}>
    <div className="App">
      <div className="InfoContainer">
        <Nav />
        <FoodList />
          {/* data.map(rest => <ListCard />) */}
          {/* onClick => <InfoCard /> */}
      </div>
      <div className="MapContainer">
        This is the Map
        {/* <Map /> */}
      </div>
    </div>
    </ThemeProvider>
  );
}

export default App;
