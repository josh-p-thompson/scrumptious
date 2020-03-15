import React, { useState, useEffect } from 'react';
import './App.css';

import Nav from './components/Nav/Nav.js'
import FoodList from './components/FoodList/FoodList.js'
import Controls from './components/Controls/Controls.js'

import restaurantsData from './example_restaurants.json'
import articlesData from './example_articles.json'

import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

// set theme to include custom font
const theme = createMuiTheme({
  typography: {
    fontFamily: [
      '"Merriweather"',
    ].join(','),
    subtitle1: {
      "fontWeight": 700,
    },
  }
});


function App() {
  const [articles, setArticles] = useState([]);
  const [selectedArticles, setSelectedArticles] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [sortBy, setSortBy] = useState("distance");
  const [cardsHidden, setCardsHidden] = useState(false);

  // set articles and restaurants when component mounts
  useEffect(() => {
      setArticles(articlesData);
      setRestaurants(restaurantsData);
      setFilteredRestaurants(restaurantsData);
    }, []
  )

  const onSelectChange = (event, value) => {
    setSelectedArticles(value);
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

  return (
    <ThemeProvider theme={theme}>
    <div className="App">
      <div className="InfoContainer">
        <Nav />
        <Controls 
          articles={articles}
          selectedArticles={selectedArticles}
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
        This is the Map
        {/* <Map /> */}
      </div>
    </div>
    </ThemeProvider>
  );
}

export default App;
