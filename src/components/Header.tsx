import React from 'react';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import Weather from '../Features/Weather/Weather';

const useStyles = makeStyles({
  grow: {
    flexGrow: 1,
  },
  toolbar: {
    ['@media (max-width:780px)']: {
      flexDirection: 'column',
      paddingBottom: 15,
      paddingTop: 25,
    },
  },
});

export default () => {
  const classes = useStyles();

  const name = "Cristian's";
  return (
    <AppBar position="static">
      <Toolbar className={classes.toolbar}>
        <Typography variant="h6" color="inherit" className={classes.grow}>
          {name} EOG React Visualization Assessment
        </Typography>
        <Weather />
      </Toolbar>
    </AppBar>
  );
};
