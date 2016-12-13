import jwtDecode from 'jwt-decode';
import { ADD_LIST, DELETE_LIST } from '../actions/list';
import { CLEAR_STATUS, AUTHENTICATE, LOGIN, REGISTER, LOGOUT } from '../actions/auth';

const initialState = {
  token: null,
  user: null,
  isAuthenticated: false,
  isAuthenticating: false,
  statusText: null
};

// register and login at the same time for simplicity

const auth = (state = initialState, action) => {
  switch (action.type) {
    case CLEAR_STATUS:
      return {
        ...state,
        statusText: null
      };
    case AUTHENTICATE.REQUEST:
    case REGISTER.REQUEST:
    case LOGIN.REQUEST:
      return {
        ...state,
        isAuthenticating: true,
        statusText: null
      };
    case AUTHENTICATE.SUCCESS:
    case REGISTER.SUCCESS:
    case LOGIN.SUCCESS:
      return {
        ...state,
        isAuthenticating: false,
        isAuthenticated: true,
        token: action.payload.token,
        user: jwtDecode(action.payload.token),
        statusText: 'You have been successfully logged in.'
      };
    case AUTHENTICATE.FAILURE:
    case REGISTER.FAILURE:
    case LOGIN.FAILURE:
      return {
        ...state,
        isAuthenticating: false,
        isAuthenticated: false,
        token: null,
        user: null,
        statusText: `Authentication Error: ${action.payload.status} ${action.payload.statusText}`
      };
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        user: null,
        statusText: 'You have been successfully logged out.'
      };
    case ADD_LIST:
      return {
        ...state,
        user: {
          ...state.user,
          lists: [
            ...state.user.lists,
            {
              _id: action.list._id,
              data: action.list.data
            }
          ]
        }
      };
    case DELETE_LIST:
      return {
        ...state,
        user: {
          ...state.user,
          lists: state.user.lists.filter(list => {
            return list._id !== action.listId;
          })
        }
      };
    default:
      return state;
  }
};

export default auth;
