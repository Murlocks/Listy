import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import auth from './auth';
import list from './list';
import * as listPageActions from '../reducers/ListPage';

const rootReducer = combineReducers({
  auth,
  list,
  ...listPageActions,
  routing: routerReducer
});

export default rootReducer;
