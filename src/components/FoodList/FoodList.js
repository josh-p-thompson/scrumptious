import React from 'react';
import './FoodList.css';

import ListCard from "../ListCard/ListCard.js"

function FoodList(props) {
  const {cardsHidden, restaurants} = props;

  if (!cardsHidden) {
    return (
      <div className="FoodList">
      {
      restaurants.map( restaurant => (
        <ListCard 
          restaurant={restaurant}
          key={restaurant.id}
        />
      ))
      }
      </div>
    );
  } else {
    return (<div></div>)
  }
}

export default FoodList;