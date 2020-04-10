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
  const [articlesData, setArticlesData] = useState([]);
  const [articles, setArticles] = useState([]);
  const [restaurantsData, setRestaurantsData] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
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

  // fetch articlesData
  useEffect(() => {
    const fetchArticles = async () =>  {
      const result_articles = await axios('/api/articles');
      setArticlesData(result_articles.data);
    }; 
    fetchArticles();
    }, []
  )

  // fetch restaurantsData
  useEffect(() => {
    const fetchRestaurants = async () => {
      const result_restaurants = await axios(`/api/restaurants?lat=${userLocation.lat}&lng=${userLocation.lng}`);
      setRestaurantsData(result_restaurants.data);
      if (userLocation.lat && userLocation.lng) {
        setSortBy('distance');
      }
      setIsLoading(false);
    }; 
    fetchRestaurants();
    }, [userLocation]
  )

  // set restaurants based on articles selected
  useEffect(() => {
    console.log('using effect');
    if (articles.length > 0) {
      const articleIds = articles.map(article => article.id);
      const newRestaurants = restaurantsData.filter(restaurant => 
        restaurant.articles.some(article => articleIds.includes(article.id))
      );
      setRestaurants(newRestaurants);
    } else {
      setRestaurants(restaurantsData); 
    }
  }, [articles, restaurantsData]
  )

  // sort restaurants by mentions or distance
  useEffect(() => {
    let sortedRestaurants = JSON.parse(JSON.stringify(restaurants));
    if (sortBy === "mentions") {
      sortedRestaurants.sort(compareValues('article_count'))
    } else {
      sortedRestaurants.sort(compareValues('distance', 'asc'))
    }
    setRestaurants(sortedRestaurants);
  }, [sortBy, articles]
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
  
  // set articles selected from filter
  const onSelectChange = (event, value) => { setArticles(value) }

  // changes sorting control buttons
  const onSortChange = (event, newSortBy) => {
    if (newSortBy) {
      setSortBy(newSortBy);
    }
  }

  // toggles card visibility
  const toggleCards = () => { setCardsHidden(!cardsHidden) }

  // sets user location when geolocate is clicked
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
          articlesData={articlesData}
          articles={articles}
          onSelectChange={onSelectChange}
          toggleSelect={toggleCards}
          sortBy={sortBy}
          onSortChange={onSortChange}
        />
        <FoodList 
          cardsHidden={cardsHidden}
          restaurants={restaurants}
          setClickedRestaurant={setClickedRestaurant}
        />
      </div>
      <div className="MapContainer">
        <Map 
          viewport={viewport}
          setViewport={setViewport}
          onGeolocate={onGeolocate}
          restaurants={restaurants}
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
