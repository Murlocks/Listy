import 'rxjs';
import { CLICK, SINGLE_CLICK, DOUBLE_CLICK } from '../actions/ListPage';

const genericClickEpic = (n, t) => action$ =>
  action$.ofType(CLICK)
    .bufferWhen(() => action$.debounceTime(200))
    .map(l => l.length)
    .filter(l => l === n)
    .mapTo({ type: t });

export const singleClickEpic = genericClickEpic(1, SINGLE_CLICK);
export const doubleClickEpic = genericClickEpic(2, DOUBLE_CLICK);
