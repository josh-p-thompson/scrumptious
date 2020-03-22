import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

import Nav from './components/Nav/Nav.js'
import FoodList from './components/FoodList/FoodList.js'
import Controls from './components/Controls/Controls.js'
import Map from './components/Map/Map.js'

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
  const [isLoading, setIsLoading] = useState(true);
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

  // fetch articles on mount
  useEffect(() => {
    const fetchArticles = async () =>  {
      const result_articles = await axios('/api/articles');
      setArticles(result_articles.data);
    }; 
    fetchArticles();
    }, []
  )

  // fetch restaurants on mount and when userLocation updates
  useEffect(() => {
    const fetchRestaurants = async () => {
      const result_restaurants = await axios(`/api/restaurants?lat=${userLocation.lat}&lng=${userLocation.lng}`);
      setRestaurants(result_restaurants.data);
      setFilteredRestaurants(result_restaurants.data);
      setIsLoading(false);
    }; 
    fetchRestaurants();
    }, [userLocation]
  )

  // sort filteredRestaurants when sortBy selection changes or when filters change
  useEffect(() => {
    let sortedRestaurants = [...filteredRestaurants];
    if (sortBy === "mentions") {
      sortedRestaurants.sort(compareValues('eaterMentions'))
    } else {
      sortedRestaurants.sort(compareValues('distance', 'asc'))
    }
    setFilteredRestaurants(sortedRestaurants);
  }, [sortBy, filteredArticles]
  )

  // compare function for sorting
  const compareValues = (key, order='desc') => {
    return function innerSort(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
      }

      const varA = (typeof a[key] === 'string')
      ? a[key].toUpperCase() : a[key];
      const varB = (typeof b[key] === 'string')
      ? b[key].toUpperCase() : b[key];

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return (
        (order === 'desc') ? (comparison * -1) : comparison
      );
    };
  }

  
  // set filtered articles and filter restaurants
  const onSelectChange = (event, value) => {
    setFilteredArticles(value);
    filterRestaurants(value);
  }

  // filters restaurants based on articles provided
  const filterRestaurants = (value) => {
    if (value.length > 0) {
      const articleIds = value.map(article => article.id);
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
  }

  const onMarkerClick = (newClickedRestaurant) => {
    if (newClickedRestaurant === clickedRestaurant) {
      setClickedRestaurant({})
    } else {
      setClickedRestaurant(newClickedRestaurant);
    }
  }

  if (isLoading) return "loading";

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
