import { SET_AUTH_FAIL, SET_AUTH_USER, LOG_OUT } from '../actions/users';

const initialState = {
  loggedIn: false,
  authUser: '',
  error: '',
};

const reducer = (state = initialState, action) => {
  if (action.type === SET_AUTH_USER) {
    return {
      ...state,
      loggedIn: true,
      authUser: action.user,
    };
  }
  if (action.type === SET_AUTH_FAIL) {
    return {
      ...state,
      error: action.error,
    };
  }
  if (action.type === LOG_OUT) {
    return {
      ...state,
      loggedIn: false,
      authUser: '',
    };
  }
  return state;
};

export default reducer;
