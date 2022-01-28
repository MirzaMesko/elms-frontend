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

const users = (state = initialState, action) => {
  switch (action.type) {
    case SET_AUTH_USER:
      return {
        ...state,
        loggedIn: true,
        token: action.token,
        authUser: action.user,
      };
    case CURRENT_USER_INFO: {
      return {
        ...state,
        loggedIn: true,
        authUser: action.user,
      };
    }
    case SET_AUTH_FAIL: {
      return {
        ...state,
        err: {
          error: true,
          message: action.error,
        },
      };
    }
    case LOG_OUT: {
      return {
        ...state,
        loggedIn: false,
        authUser: '',
        error: false,
      };
    }
    case RETRIEVE_USERS_SUCCESS: {
      return {
        ...state,
        users: action.users,
      };
    }
    case RETRIEVE_USERS_FAIL: {
      return {
        ...state,
        users: action.error,
      };
    }
    default:
      return state;
  }
};

export default users;
