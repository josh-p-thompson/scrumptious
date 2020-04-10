import React from 'react';
import './ListCard.css';
import { ReactComponent as Eater } from './eater.svg';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MapRoundedIcon from '@material-ui/icons/MapRounded';
import RoomIcon from '@material-ui/icons/Room';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles({
  cardContent: {
      paddingBottom: 0,
  }, 
  list: {
    paddingBottom: 0,
  },
  listItem: {
      paddingLeft: 4, 
      paddingRight: 4,
  }, 
});

function ListItemLink(props) {
    return <ListItem button component="a" {...props}/>;
}

function ListCard(props) {
  const {restaurant, setClickedRestaurant} = props;
  const classes = useStyles();

  // string for distance
  let dist = ""
  if (restaurant.distance) {
    dist = " | " + restaurant.distance + " mi"
  }

  return (
    <Card className="ListCard" variant="outlined">
      <CardContent className={classes.cardContent}>
        <div className="ListCard-header">
            <Typography variant="subtitle1">
                {restaurant.name}
            </Typography>
            <Typography variant="caption" color="textSecondary">
            {restaurant.address.split(",")[1] + dist}
            </Typography>
        </div>
        <List component="nav" dense={true} className={classes.list} >
            <Divider component="li" />
            {
            restaurant.articles.map(article =>(
            <div key={article.id}>
              <ListItemLink href={article.url + "/" + restaurant.slug} target="_blank" className={classes.listItem}>
                  <ListItemText primary={article.title} primaryTypographyProps={{variant: "caption", noWrap: true, display: "block"}}/>
              </ListItemLink>
              <Divider component="li" />
            </div>
            ))
            }
        </List>
      </CardContent>
      <CardActions style={{justifyContent: 'space-between'}}>
        <Eater className="ListCard-eater" />
        <div>
          <IconButton onClick={() => setClickedRestaurant(restaurant)} >
              <MapRoundedIcon color="primary"/>
          </IconButton>
          <IconButton href={restaurant.googlemaps_url} target="_blank" >
              <RoomIcon color="primary"/>
          </IconButton>
        </div>
      </CardActions>
    </Card>
  );
}

export default ListCard;