import jwtDecode from 'jwt-decode';
import { push } from 'react-router-redux';
import { fetchApi, createRequestTypes } from './util';

export const CLEAR_STATUS = 'CLEAR_STATUS';

export const AUTHENTICATE = createRequestTypes('AUTHENTICATE');
export const LOGIN        = createRequestTypes('LOGIN');
export const REGISTER     = createRequestTypes('REGISTER');
export const LOGOUT       = 'LOGOUT';

const API = process.env.NODE_ENV === 'production' ?
  'http://i6.cims.nyu.edu:18668/api/auth' :
  `http://localhost:${process.env.PORT || 3000}/api/auth`;


const invalidTokenError = {
  response: {
    status: 403,
    statusText: 'Invalid Token.'
  }
};

export const verifyToken = token => {
  try {
    jwtDecode(token);
    return token;
  } catch(e) {
    throw invalidTokenError;
  }
};

export const clearStatus = () => ({
  type: CLEAR_STATUS
});

export const authenticateUserRequest = () => {
  return {
    type: AUTHENTICATE.REQUEST
  };
};

export const authenticateUserSuccess = token => {
  localStorage.setItem('token', token);
  return {
    type: AUTHENTICATE.SUCCESS,
    payload: { token: token }
  };
};

export const authenticateUserFailure = err => {
  localStorage.removeItem('token');
  return {
    type: AUTHENTICATE.FAILURE,
    payload: { ...err.response }
  };
};

export const authenticateUser = (token, redirect = '/') => {
  return dispatch => {
    dispatch(authenticateUserRequest());
    return fetchApi(`${API}/authenticate`, 'post', { token: token })
      .then(({ token }) => verifyToken(token))
      .then(token => {
        dispatch(authenticateUserSuccess(token));
        dispatch(push(redirect));
      })
      .catch(error => {
        console.log(error);
        dispatch(authenticateUserFailure(error));
      });
  };
};

export const loginUserRequest = () => ({
  type: LOGIN.REQUEST
});

export const loginUserSuccess = token => {
  localStorage.setItem('token', token);
  return {
    type: LOGIN.SUCCESS,
    payload: {
      token: token
    }
  };
};

export const loginUserFailure = err => {
  localStorage.removeItem('token');
  return {
    type: LOGIN.FAILURE,
    payload: { ...err.response }
  };
};

export const loginUser = (email, password, redirect = '/') => {
  return dispatch => {
    dispatch(loginUserRequest());
    return fetchApi(`${API}/login`, 'post', { email, password })
      .then(({ token }) => verifyToken(token))
      .then(token => {
        dispatch(loginUserSuccess(token));
        dispatch(push(redirect));
      })
      .catch(error => {
        console.log(error);
        dispatch(loginUserFailure(error));
      });
  };
};

export const registerUserRequest = () => ({
  type: REGISTER.REQUEST
});

export const registerUserSuccess = token => {
  localStorage.setItem('token', token);
  return {
    type: REGISTER.SUCCESS,
    payload: {
      token: token
    }
  };
};

export const registerUserFailure = err => {
  localStorage.removeItem('token');
  return {
    type: REGISTER.FAILURE,
    payload: { ...err.response }
  };
};

export const registerUser = (email, password, redirect = '/') => {
  return dispatch => {
    dispatch(registerUserRequest());
    return fetchApi(`${API}/register`, 'post', { email, password })
      .then(({ token }) => verifyToken(token))
      .then(token => {
        dispatch(registerUserSuccess(token));
        dispatch(push(redirect));
      })
      .catch(error => {
        console.log(error);
        dispatch(registerUserFailure(error));
      });
  };
};

export const logout = () => {
  localStorage.removeItem('token');
  return {
    type: LOGOUT
  };
};

export const logoutAndRedirect = () => dispatch => {
  dispatch(logout());
  dispatch(push('/login'));
};

export default {
  authenticate: authenticateUser,
  login: loginUser,
  register: registerUser,
  logout: logoutAndRedirect
};
