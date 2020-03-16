import React, { useState, useEffect } from 'react';
import './App.css';

import Nav from './components/Nav/Nav.js'
import FoodList from './components/FoodList/FoodList.js'
import Controls from './components/Controls/Controls.js'
import Map from './components/Map/Map.js'

import restaurantsData from './example_restaurants.json'
import articlesData from './example_articles.json'

import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

// set theme to include custom font
const theme = createMuiTheme({
  typography: {
    fontFamily: [
      // '"Merriweather"',
      '"Muli"',
    ].join(','),
    subtitle1: {
      "fontWeight": 700,
    },
  }
});


function App() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [clickedRestaurant, setClickedRestaurant] = useState({});
  const [sortBy, setSortBy] = useState("mentions");
  const [cardsHidden, setCardsHidden] = useState(false);

  const [viewport, setViewport] = useState({
    width: 400,
    height: 400,
    latitude: 37.80766466839607,
    longitude: -122.23316866515783,
    zoom: 10.509440615422854
  });
  const [userLocation, setUserLocation] = useState({
    lat: 37.80766466839607, 
    lng: -122.23316866515783,
  })

  // set articles and restaurants when component mounts
  useEffect(() => {
      setArticles(articlesData);
      setRestaurants(restaurantsData);
      setFilteredRestaurants(restaurantsData);
    }, []
  )

  const onSelectChange = (event, value) => {
    setFilteredArticles(value);
    filterRestaurants(value);
  }

  const filterRestaurants = (value) => {
    if (value.length > 0) {
      const articleIds = value.map(article => article.id)
      const filteredRestaurants = restaurants.filter(restaurant => 
        restaurant.articles.some(article => articleIds.includes(article.id))
      );
      setFilteredRestaurants(filteredRestaurants);
    } else {
      setFilteredRestaurants(restaurants); 
    }
  }

  const onSortChange = (event, newSortBy) => {
    if (newSortBy) {
      setSortBy(newSortBy);
    }
  }

  const toggleCards = () => {
    setCardsHidden(!cardsHidden);
  }

  const onGeolocate = (inputs) => {
    const lat = inputs.coords.latitude; 
    const lng = inputs.coords.longitude;
    setUserLocation({
      lat: lat, 
      lng: lng,
    })
  }

  const onMarkerClick = (newClickedRestaurant) => {
    if (newClickedRestaurant === clickedRestaurant) {
      setClickedRestaurant({})
    } else {
      setClickedRestaurant(newClickedRestaurant);
    }
  }

  return (
    <ThemeProvider theme={theme}>
    <div className="App">
      <div className="InfoContainer">
        <Nav />
        <Controls 
          articles={articles}
          filteredArticles={filteredArticles}
          onSelectChange={onSelectChange}
          toggleSelect={toggleCards}
          sortBy={sortBy}
          onSortChange={onSortChange}
        />
        <FoodList 
          cardsHidden={cardsHidden}
          restaurants={filteredRestaurants}
        />
      </div>
      <div className="MapContainer">
        <Map 
          viewport={viewport}
          setViewport={setViewport}
          onGeolocate={onGeolocate}
          restaurants={filteredRestaurants}
          onMarkerClick={onMarkerClick}
          clickedRestaurant={clickedRestaurant}
          setClickedRestaurant={setClickedRestaurant}
        />
      </div>
    </div>
    </ThemeProvider>
  );
}

export default App;
