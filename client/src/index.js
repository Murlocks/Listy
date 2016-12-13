import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { syncHistoryWithStore, push } from 'react-router-redux';
import { UserAuthWrapper } from 'redux-auth-wrapper';
import configureStore from './store';

import App from './components/App';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home/Home';
import ListPage from './components/ListPage/ListPage';

import 'bootstrap/dist/css/bootstrap.css';

const store = configureStore(window.__INITIAL_STATE__);
const history = syncHistoryWithStore(browserHistory, store);
const root = document.getElementById('root');

const requireAuthentication = UserAuthWrapper({
  authSelector: state => state.auth,
  predicate: auth => auth.isAuthenticated,
  redirectAction: push,
  wrapperDisplayName: 'UserIsJWTAuthenticated'
});

ReactDOM.render((
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={App}>
        <IndexRoute component={requireAuthentication(Home)}/>
        <Route path='register' component={Register}/>
        <Route path='login' component={Login}/>
        <Route path='list/:id' component={requireAuthentication(ListPage)}/>
      </Route>
    </Router>
  </Provider>
), root);
