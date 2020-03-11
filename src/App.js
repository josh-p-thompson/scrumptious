import React from 'react';
import './App.css';

import Nav from './components/Nav/Nav.js'
import FoodList from './components/FoodList/FoodList.js'

function App() {
  return (
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
  );
}

export default App;
