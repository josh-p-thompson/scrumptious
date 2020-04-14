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
  const [restaurantsGeojson, setRestaurantsGeojson] = useState({});
  const [cardsShown, setCardsShown] = useState(20);
  const [clickedRestaurant, setClickedRestaurant] = useState({});
  const [sortBy, setSortBy] = useState("mentions");
  const [cardsHidden, setCardsHidden] = useState(false);
  const [userLocation, setUserLocation] = useState({
    lat: null, 
    lng: null,
  })

  // fetch articlesData
  useEffect(() => {
    console.log('USE EFFECT: fetching article data');
    const fetchArticles = async () =>  {
      const result_articles = await axios('/api/articles');
      setArticlesData(result_articles.data);
    }; 
    fetchArticles();
    }, []
  )

  // fetch restaurantsData
  useEffect(() => {
    console.log('USE EFFECT: fetching restaurant data');
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
    console.log('USE EFFECT: set restaurants from articles');
    if (articles.length > 0) {
      const articleIds = articles.map(article => article.id);
      const newRestaurants = restaurantsData.filter(restaurant => 
        restaurant.articles.some(article => articleIds.includes(article.id))
      );
      setRestaurants(newRestaurants);
    } else {
      setRestaurants(restaurantsData); 
    }
  }, [restaurantsData]
  )

  // set restaurantsGeojson from restaurants
  useEffect(() => {
    console.log('USE EFFECT: set restaurantsGeojson from restaurants');
    let features = [];
    for (let rest of restaurants) {
        let point = {
            "geometry": {
                "type": "Point", 
                "coordinates": [rest.lng, rest.lat]
            }, 
            "type": "Feature", 
            "properties": rest
        };
        features.push(point);
    };
    setRestaurantsGeojson({
        "type": "FeatureCollection",
        "features": features
    });
  }, [restaurants]
  )

  // reset cardsShown when restaurants change or when sorting is applied
  useEffect(() => {
    console.log('USE EFFECT: reset cardsShown');
    setCardsShown(20);
  }, [restaurants, sortBy]
  )

  // set articles selected from filter
  const onSelectChange = (event, value) => { 
    console.log("onSelectChange: setting articles from filter");
    setArticles(value);
  }

  const onApplyFilter = () => {
    console.log('onApplyFilter: set restaurants from articles');
    if (articles.length > 0) {
      const articleIds = articles.map(article => article.id);
      const newRestaurants = restaurantsData.filter(restaurant => 
        restaurant.articles.some(article => articleIds.includes(article.id))
      );
      setRestaurants(newRestaurants);
    } else {
      setRestaurants(restaurantsData); 
    }
  }

  // changes sorting control buttons
  const onSortChange = (event, newSortBy) => {
    console.log('onSortChange: changing sorting control buttons');
    if (newSortBy) {
      setSortBy(newSortBy);
    }
  }

  // toggles card visibility
  const toggleCards = () => { 
    console.log('toggleCards: toggling card visibility');
    setCardsHidden(!cardsHidden);
  }

  // sets user location when geolocate is clicked
  const onGeolocate = (inputs) => {
    console.log('onGeolocate: setting user location from geolocate click');
    const lat = inputs.coords.latitude; 
    const lng = inputs.coords.longitude;
    setUserLocation({
      lat: lat, 
      lng: lng,
    })    
  }

  const onMapClick = event => {
    console.log('onMapClick: setting clicked restaurant');
    if (event.features.length !== 0){
      setClickedRestaurant(event.features[0]['properties']);
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
          cardsHidden={cardsHidden}
          onApplyFilter = {onApplyFilter}
        />
        <FoodList 
          cardsHidden={cardsHidden}
          cardsShown={cardsShown}
          setCardsShown={setCardsShown}
          restaurants={restaurants}
          setClickedRestaurant={setClickedRestaurant}
          sortBy={sortBy}
        />
      </div>
      <div className="MapContainer">
        <Map 
          onGeolocate={onGeolocate}
          restaurantsGeojson={restaurantsGeojson}
          onMapClick={onMapClick}
          clickedRestaurant={clickedRestaurant}
          setClickedRestaurant={setClickedRestaurant}
        />
      </div>
    </div>
    </ThemeProvider>
  );
}

export default App;
