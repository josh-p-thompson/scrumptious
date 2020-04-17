import React from 'react';
import './FoodList.css';
import ListCard from "../ListCard/ListCard.js"
import memoUtil from '../../utils/memoUtil.js'

import Button from '@material-ui/core/Button';

function FoodList(props) {
  const {cardsShown, setCardsShown, restaurants, onCardMapClick, clickedPopup, setClickedPopup} = props;
  console.log('rendering foodlist');

  if (restaurants.length === 0) {
    return (
      <div className="FoodList">
      </div>
    )
  }

  if (restaurants) {
    if (Object.keys(clickedPopup).length > 0) {
      return (
      <div className="FoodList">
        <ListCard 
          restaurant={clickedPopup}
          key={clickedPopup.id}
          onCardMapClick={onCardMapClick}
        />
        <Button
          variant="contained"
          color="primary"
          disableRipple={true}
          disableElevation={true}
          style={{fontSize: ".8rem", fontWeight: 700, marginTop: ".25rem", marginBottom: ".5rem", width: "100%", height: "2.5rem"}}
          onClick={() => setClickedPopup({})}
        >
          Back to Results
        </Button>
      </div>)
    } else {
    return (
      <div className="FoodList">
      {
      restaurants.slice(0, cardsShown).map( restaurant => (
        <ListCard 
          restaurant={restaurant}
          key={restaurant.id}
          onCardMapClick={onCardMapClick}
        />
      ))
      }
      {
        restaurants.length > cardsShown ? 
        (
      <Button
        variant="contained"
        color="primary"
        disableRipple={true}
        disableElevation={true}
        style={{fontSize: ".8rem", fontWeight: 700, marginTop: ".25rem", marginBottom: ".5rem", width: "100%", height: "2.5rem"}}
        onClick={() => setCardsShown(cardsShown + 20)}
      >
        Show More
      </Button>
        ) : (null)
      }
      </div>
    );
  }} else {
    return (null)
  }
}

export default memoUtil(FoodList, ['cardsShown', 'restaurants', 'clickedPopup']);