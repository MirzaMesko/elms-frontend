import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Menu from '@material-ui/core/Menu';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SettingsIcon from '@material-ui/icons/Settings';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
// @ts-ignore
import { AppDispatch, RootState } from '../store.ts';
// @ts-ignore
import { logout } from '../actions/auth.tsx';
// @ts-ignore
import type { User } from '../types.ts';

const BasicMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<any>();
  const open = Boolean(anchorEl);
  const [user, setUser] = React.useState<User | undefined>();

  const history = useHistory();
  const dispatch: AppDispatch = useDispatch();
  const { username } = useSelector((state: RootState) => state.users.authUser);
  const { users } = useSelector((state: RootState) => state.users);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const goToSettings = () => {
    history.push(`/users/settings/${username}/profile`);
    handleClose();
  };

  const onLogout = () => {
    dispatch(logout());
  };

  React.useEffect(() => {
    const currentUser = users.filter((u: any) => u.username === username)[0];
    setUser(currentUser);
  }, [users]);
  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        data-testid="avatar-button"
      >
        <Avatar src={user?.image} />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        data-testid="menu"
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClose}>
          <Avatar src={user?.image} data-testid="avatar" />
          <Typography style={{ marginLeft: '1rem' }} data-testid="username">
            {username}
          </Typography>
        </MenuItem>
        <MenuItem onClick={goToSettings}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText data-testid="settings">Settings</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={onLogout} data-testid="logout">
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText>Log out</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default BasicMenu;
