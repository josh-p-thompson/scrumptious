import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {FlyToInterpolator} from 'react-map-gl';
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
  const [pageLoading, setPageLoading] = useState(true);
  // const [filterLoading, setFilterLoading] = useState(false);

  const [articlesData, setArticlesData] = useState([]);
  const [articles, setArticles] = useState([]);
  const [restaurantsData, setRestaurantsData] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantsGeojson, setRestaurantsGeojson] = useState({});
  
  const [clickedRestaurant, setClickedRestaurant] = useState({});
  const [sortBy, setSortBy] = useState("mentions");
  const [clickedPopup, setClickedPopup] = useState({});

  const [inputValue, setInputValue] = useState('');

  const [cardsShown, setCardsShown] = useState(20);

  const [userLocation, setUserLocation] = useState({
    lat: null, 
    lng: null,
  })
  const [viewport, setViewport] = useState({
    width: 400,
    height: 400,
    latitude: 37.7830725948267,
    longitude: -122.41937128686605,
    zoom: 12,
  });

  const [width, setWidth] = useState(window.innerWidth);
  const [mobile, setMobile] = useState(false);

  // set window width
  useEffect(() => {
    console.log('USE EFFECT: set window width')
    const updateWidthAndHeight = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", updateWidthAndHeight);
    return () => window.removeEventListener("resize", updateWidthAndHeight);
  });

  // indicate if in mobile 
  useEffect(() => {
    console.log('USE EFFECT: set mobile from width'); 
    if (width < 640) {
      setMobile(true);
    } else {
      setMobile(false);
    }
  }, [width]
  )

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
      setPageLoading(false);
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

  // sort data when sortBy changes
  useEffect(() => {
    console.log('USE EFFECT: sorting data');

    let sortedRestaurants = JSON.parse(JSON.stringify(restaurantsData));
    if (sortBy === "mentions") {
      sortedRestaurants.sort(compareValues('article_count'))
    } else {
      sortedRestaurants.sort(compareValues('distance', 'asc'))
    }
    setRestaurantsData(sortedRestaurants);

  }, [sortBy]
  )

  // set articles selected from filter
  const onSelectChange = (event, value) => { 
    console.log("onSelectChange: setting articles from filter");
    setArticles(value);
  }

  // apply the filter to restaurants
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
      let newClickedRestaurant = event.features[0]['properties']; 
      newClickedRestaurant.articles = JSON.parse(newClickedRestaurant.articles); 
      setClickedRestaurant(newClickedRestaurant);
    } else {
      setClickedRestaurant({});
      setClickedPopup({});
    }
  }

  // when card map icon is clicked
  const onCardMapClick = restaurant => {
    console.log('onCardMapClick: setting clicked restaurant');
    setClickedRestaurant(restaurant);
    setViewport({
      longitude: restaurant.lng,
      latitude: restaurant.lat,
      zoom: 15,
      transitionInterpolator: new FlyToInterpolator({speed: 1.2}),
      transitionDuration: 'auto'
    });
  };

  // compare function used for sorting
  const compareValues = (key, order='desc') => {
    console.log('comparing values for sorting');
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

  // changes input in SelectLists
  const handleInputChange = (event, value, reason) => {
    console.log('handleInputChange: setting list input')
    console.log(value); 
    console.log(reason);
    if (reason === "input") {
        setInputValue(value);
    }
  }

  if (pageLoading) {
    return (
      <ThemeProvider theme={theme}>
      <div className="App">
        <div className="InfoContainer">
          <Nav />
          <Controls 
            articlesData={articlesData}
            articles={articles}
            onSelectChange={onSelectChange}
            selectValue={articles}
            inputValue={inputValue}
            handleInputChange={handleInputChange}
          />
          <FoodList 
          />
        </div>
        <div className="MapContainer">
        </div>
      </div>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme={theme}>
    <div className="App">
      <div className="InfoContainer">
        <Nav />
        <Controls 
          articlesData={articlesData}
          articles={articles}
          onSelectChange={onSelectChange}
          selectValue={articles}
          sortBy={sortBy}
          onSortChange={onSortChange}
          onApplyFilter = {onApplyFilter}
          inputValue={inputValue}
          handleInputChange={handleInputChange}
        />
        <FoodList 
          cardsShown={cardsShown}
          setCardsShown={setCardsShown}
          restaurants={restaurants}
          onCardMapClick={onCardMapClick}
          sortBy={sortBy}
          clickedPopup={clickedPopup}
          setClickedPopup={setClickedPopup}
          clickedRestaurant={clickedRestaurant}
        />
      </div>
      <div className="MapContainer">
        <Map 
          viewport={viewport}
          setViewport={setViewport}
          onGeolocate={onGeolocate}
          restaurantsGeojson={restaurantsGeojson}
          onMapClick={onMapClick}
          clickedRestaurant={clickedRestaurant}
          setClickedRestaurant={setClickedRestaurant}
          setClickedPopup={setClickedPopup}
        />
      </div>
    </div>
    </ThemeProvider>
  );
}

export default App;
