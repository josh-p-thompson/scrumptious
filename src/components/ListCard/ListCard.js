import React from 'react';
import './ListCard.css';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';


import { ReactComponent as Eater } from './eater.svg';

import RoomIcon from '@material-ui/icons/Room';

const useStyles = makeStyles({
  cardContent: {
      paddingBottom: 0,
  }, 
  listItem: {
      paddingLeft: 4, 
      paddingRight: 4,
  }, 
  actionItems: {
    justifyContent: "flexEnd",
  }
});

function ListItemLink(props) {
    return <ListItem button component="a" {...props}/>;
  }

function ListCard() {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  return (
    <Card className="ListCard" variant="outlined">
      <CardContent className={classes.cardContent}>
        <div className="ListCard-header">
            <Typography variant="subtitle1">
                Chez Panisse
            </Typography>
            <Typography variant="caption" color="textSecondary">
            Berkeley | 9.1 mi
            </Typography>
        </div>
        <div className="ListCard-content">
        <List component="nav" dense={true} style={{paddingBottom: 0}}>
            <Divider component="li" />
            <ListItemLink href="#test" className={classes.listItem}>
                <ListItemText primary='The Best East Bay Restaurants, Winter 2020' primaryTypographyProps={{variant: "caption"}}/>
            </ListItemLink>
            <Divider component="li" />
            <ListItemLink href='https://sf.eater.com/maps/best-east-bay-oakland-berkeley-restaurants-38/chez-panisse' className={classes.listItem}>
                <ListItemText primary="The Essential Pizzas of the East Bay" primaryTypographyProps={{variant: "caption"}}/>
            </ListItemLink>
            <Divider component="li" style={{}} />
        </List>
        </div>
      </CardContent>
      <CardActions style={{justifyContent: 'space-between'}}>
            {/* <IconButton> */}
                <Eater className="ListCard-eater" style={{padding: 12}} />
            {/* </IconButton> */}
        <IconButton>
            <RoomIcon color="primary"/>
        </IconButton>
      </CardActions>
    </Card>
  );
}

export default ListCard;