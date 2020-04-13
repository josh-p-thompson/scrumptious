import React from 'react';
import './FoodList.css';
import ListCard from "../ListCard/ListCard.js"
import Button from '@material-ui/core/Button';

// compare function for sorting
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

function FoodList(props) {
  const {cardsHidden, cardsShown, setCardsShown, restaurants, setClickedRestaurant, sortBy} = props;

  // sort restaurants here to avoid rerendering map
  let sortedRestaurants = JSON.parse(JSON.stringify(restaurants));
  if (sortBy === "mentions") {
    sortedRestaurants.sort(compareValues('article_count'))
  } else {
    sortedRestaurants.sort(compareValues('distance', 'asc'))
  }

  console.log('rendering foodlist');
  if (!cardsHidden && restaurants) {
    return (
      <div className="FoodList">
      {
      sortedRestaurants.slice(0, cardsShown).map( restaurant => (
        <ListCard 
          restaurant={restaurant}
          key={restaurant.id}
          setClickedRestaurant={setClickedRestaurant}
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
  } else {
    return (null)
  }
}

export default React.memo(FoodList);