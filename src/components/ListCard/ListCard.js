import React from 'react';
import './ListCard.css';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 12,
  },
  pos: {
    marginBottom: 12,
  },
});

function ListCard() {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  return (
    <Card className="ListCard" variant="outlined">
      <CardActionArea>
      <CardContent>
        <Typography variant="h6" component="h2">
          Chez Panisse
        </Typography>
        <Typography className={classes.pos} color="textSecondary" variant="caption">
          1517 Shattuck Ave, Berkeley
        </Typography>
        <Typography variant="body2" component="p">
          Eater Mentions: 4
        </Typography>
      </CardContent>
    </CardActionArea>
    </Card>
  );
}

export default ListCard;