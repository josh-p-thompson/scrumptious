import React, { useState, useEffect, useRef } from 'react';
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
    lat: null, 
    lng: null,
  })

  // set articles and restaurants when component mounts
  useEffect(() => {
      setArticles(articlesData);
      setRestaurants(restaurantsData);
      setFilteredRestaurants(restaurantsData);
    }, []
  )
  
  // used to calculate distance between user and restaurants
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    let R = 6371; // Radius of the earth in km
    let dLat = deg2rad(lat2-lat1);  // deg2rad below
    let dLon = deg2rad(lon2-lon1); 
    let a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    let d = R * c * 0.62137119; // Distance in miles
    return d.toFixed(1);
  }
  const deg2rad = (deg) => {
    return deg * (Math.PI/180)
  }

  // sets distance from user for each restaurant; called by geolocate
  const setDistance = (lat, lng) => {
    if (lat && lng) {

      // kinda confused about why this is modifying state?? --> conclusion, do this stuff on the backend
      let oldRestaurants = Object.assign([], restaurants);
      console.log(oldRestaurants);
      oldRestaurants.map(rest =>
        rest['distance'] = calculateDistance(lat, lng, rest.lat, rest.lng)
      ); 
    }
  }

  // set filtered articles and filter restaurants
  const onSelectChange = (event, value) => {
    setFilteredArticles(value);
    filterRestaurants(value);
  }

  // filters restaurants based on articles provided
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


  // controling the map
  const onGeolocate = (inputs) => {
    const lat = inputs.coords.latitude; 
    const lng = inputs.coords.longitude;
    setUserLocation({
      lat: lat, 
      lng: lng,
    })
    // only set distance if userLocation hasn't been set
    if(userLocation.lat == null) {
      setDistance(lat, lng);
    }
    
  }

  const onMarkerClick = (newClickedRestaurant) => {
    if (newClickedRestaurant === clickedRestaurant) {
      setClickedRestaurant({})
    } else {
      setClickedRestaurant(newClickedRestaurant);
    }
  }

  const scrollToCard = (ref) => {
    window.scrollTo(0, ref.current.offsetTop)
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
