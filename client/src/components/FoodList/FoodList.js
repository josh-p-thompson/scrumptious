import React from 'react';
import './FoodList.css';

import ListCard from "../ListCard/ListCard.js"

function FoodList(props) {
  const {cardsHidden, restaurants, setClickedRestaurant} = props;

  if (!cardsHidden && restaurants) {
    return (
      <div className="FoodList">
      {
      restaurants.map( restaurant => (
        <ListCard 
          restaurant={restaurant}
          key={restaurant.id}
          setClickedRestaurant={setClickedRestaurant}
        />
      ))
      }
      </div>
    );
  } else {
    return (null)
  }
}

export default FoodList;