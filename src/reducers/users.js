import { SET_AUTH_FAIL, SET_AUTH_USER, LOG_OUT } from '../actions/auth';
import { RETRIEVE_USERS_SUCCESS, RETRIEVE_USERS_FAIL, CURRENT_USER_INFO } from '../actions/users';

const initialState = {
  loggedIn: false,
  authUser: '',
  token: '',
  err: {
    error: false,
    message: '',
  },
  users: [],
};

const reducer = (state = initialState, action) => {
  if (action.type === SET_AUTH_USER) {
    return {
      ...state,
      loggedIn: true,
      token: action.token,
      authUser: action.user,
    };
  }
  if (action.type === CURRENT_USER_INFO) {
    return {
      ...state,
      loggedIn: true,
      authUser: action.user,
    };
  }
  if (action.type === SET_AUTH_FAIL) {
    return {
      ...state,
      err: {
        error: true,
        message: action.error,
      },
    };
  }
  if (action.type === LOG_OUT) {
    return {
      ...state,
      loggedIn: false,
      authUser: '',
      error: false,
    };
  }
  if (action.type === RETRIEVE_USERS_SUCCESS) {
    return {
      ...state,
      users: action.users,
    };
  }
  if (action.type === RETRIEVE_USERS_FAIL) {
    return {
      ...state,
      users: action.error,
    };
  }
  return state;
};

export default reducer;
