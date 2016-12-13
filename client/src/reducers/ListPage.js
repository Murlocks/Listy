import { FETCH_LIST } from '../actions/list';
import {
    SET_CURRENT_ID,
    MOVE_CURRENT_DOWN,
    MOVE_CURRENT_UP,
    SET_SEARCH_FILTER,
    TOGGLE_DRAG_MODE,
    CLICK,
    SINGLE_CLICK,
    DOUBLE_CLICK
} from '../actions/ListPage';

export const isFetching = (state = false, { type }) => {
  switch (type) {
    case FETCH_LIST.REQUEST:
      return true;
    case FETCH_LIST.SUCCESS:
    case FETCH_LIST.FAILURE:
      return false;
    default:
      return state;
  }
};

export const current = (state = {}, action) => {
  switch (action.type) {
    case DOUBLE_CLICK:
      return {
        id: null,
        cIndex: null,
        maxIndex: null
      };
    case SET_CURRENT_ID:
      let { id, cIndex, maxIndex } = action.payload;
      if (typeof maxIndex !== 'string')
        return {
          ...action.payload
        };
      else switch (action.payload.maxIndex) {
        case '+1':
          return {
            ...action.payload,
            maxIndex: state.maxIndex + 1
          };
        case '-1':
          return {
            ...action.payload,
            maxIndex: state.maxIndex - 1
          };
        case 'none':
          return {
            id: id,
            cIndex: cIndex,
            maxIndex: state.maxIndex
          };
        default:
          console.warn(`Warning: SET_CURRENT_ID maxIndex got an unknown option ${action.payload.maxIndex}; it has been ignored.`);
          return {
            id: id,
            cIndex: cIndex,
            maxIndex: state.maxIndex
          };
      }
    case MOVE_CURRENT_DOWN:
      return {
        ...state,
        cIndex: (state.cIndex < state.maxIndex) ? state.cIndex + 1 : state.cIndex
      };
    case MOVE_CURRENT_UP:
      return {
        ...state,
        cIndex: (state.cIndex > 0) ? state.cIndex - 1 : state.cIndex
      };
    default:
      return state;
  }
};

export const searchFilter = (state = '', { type, filter }) => {
  switch (type) {
    case SET_SEARCH_FILTER:
      return filter;
    default:
      return state;
  }
};

export const isDragging = (state = { currently: false }, action) => {
  switch (action.type) {
    case TOGGLE_DRAG_MODE:
      return {
        currently: !state.currently,
        ...action.payload
      };
    default:
      return state;
  }
};

export const doubleClicked = (state = false, { type }) => {
  switch (type) {
    case SINGLE_CLICK:
      return false;
    case DOUBLE_CLICK:
      return true;
    default:
      return state;
  }
};

export const editing = (state = {}, { type, payload }) => {
  switch (type) {
    case CLICK:
      return payload;
    default:
      return state;
  };
};
