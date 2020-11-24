import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { CardProps } from './types';

const useStyles = makeStyles({
  root: {
    width: 200,
    display: 'inline-block',
    margin: '10px',
  },
  title: {
    fontSize: 14,
  },
});

const CurrentMeasurementCard = ({ measurement }: CardProps) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          {measurement.name}
        </Typography>
        <Typography variant="h4" component="h2">
          {measurement.value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CurrentMeasurementCard;
