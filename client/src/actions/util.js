import fetch from 'isomorphic-fetch';

const REQUEST = 'REQUEST';
const SUCCESS = 'SUCCESS';
const FAILURE = 'FAILURE';

const ERROR_MSG = {
  401: 'Incorrect email or password',
  403: 'Unauthorized.',
  409: 'Email already in use.',
  422: 'Invalid email.'
};

export const checkHttpStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    var error = new Error(response.statusText);
    error.response = {
      status: response.status,
      statusText: ERROR_MSG[response.status] ?
        ERROR_MSG[response.status] : response.statusText
    };
    throw error;
  }
};

export const parseJSON = response => {
  return response.json();
};

export const createRequestTypes = base => {
  return [REQUEST, SUCCESS, FAILURE].reduce((acc, type) => {
    acc[type] = `${base}_${type}`;
    return acc;
  }, {});
};

export const fetchApi = (url, method, body, headers) =>
  fetch(url, {
    method,
    body: body ? JSON.stringify(body) : null,
    headers
  })
  .then(checkHttpStatus)
  .then(parseJSON);
