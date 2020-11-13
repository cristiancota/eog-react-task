import CardHeader from '@material-ui/core/CardHeader';
import { withStyles, Theme } from '@material-ui/core/styles';

const styles = (theme: Theme) => ({
  root: {
    background: theme.palette.primary.main,
  },
  title: {
    color: 'white',
  },
});
export default withStyles(styles)(CardHeader);
