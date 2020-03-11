import React from 'react';
import './FoodList.css';

import ListCard from "../ListCard/ListCard.js"

function FoodList() {
  return (
    <div className="FoodList">
      <ListCard />
      <ListCard />
      <ListCard />
    </div>
  );
}

export default FoodList;