import { createStore, applyMiddleware, compose } from 'redux';
// import createLogger from 'redux-logger';
import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import thunkMiddleware from 'redux-thunk';
import { createEpicMiddleware } from 'redux-observable';
import DevTools from './components/DevTools';

import rootReducer from './reducers/index';
import rootEpic from './epics/index';

const configStore = preloadedState => {

  // const loggerMiddleware = createLogger();
  const epicMiddleware = createEpicMiddleware(rootEpic);
  const enhancers = [
    applyMiddleware(
      // loggerMiddleware,
      thunkMiddleware,
      epicMiddleware,
      routerMiddleware(browserHistory)
    )
  ];

  if (process.env.NODE_ENV === 'development')
    enhancers.push(
      window.devToolsExtension ?
        window.devToolsExtension() : DevTools.instrument()
    );

  const store = createStore(
    rootReducer,
    preloadedState,
    compose(...enhancers)
  );

  return store;
};

export default configStore;
