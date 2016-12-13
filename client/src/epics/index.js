import { combineEpics } from 'redux-observable';
import { singleClickEpic, doubleClickEpic } from './ListPage';

const rootEpic = combineEpics(
  singleClickEpic,
  doubleClickEpic
);

export default rootEpic;
