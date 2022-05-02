/* eslint-disable import/prefer-default-export */
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';

export const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: '#3f51b5',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}))(Tooltip);
