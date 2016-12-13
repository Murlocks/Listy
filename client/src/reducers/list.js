import {
  ADD_LIST,
  ADD_ITEM,
  EDIT_ITEM,
  DELETE_ITEM,
  MOVE_ITEM,
  FETCH_LIST,
} from '../actions/list';

const children = (state = [], { type, payload }) => {
  switch (type) {
    case ADD_ITEM:
      return [
        ...state.slice(0, payload.cIndex),
        { ...payload.newChild, flatChildren: [] },
        ...state.slice(payload.cIndex),
      ];
    case DELETE_ITEM:
      return [
        ...state.slice(0, payload.cIndex),
        ...state.slice(payload.cIndex + 1)
      ];
    case EDIT_ITEM:
      return [
        ...state.slice(0, payload.cIndex),
        { ...state[payload.cIndex], data: payload.data },
        ...state.slice(payload.cIndex + 1),
      ];
    default:
      return state;
  }
};

const mkFlat = oldChildren => {
  const children = oldChildren.map(child => ({
    ...child,
    ...mkFlat(child.children)
  }));
  const flatChildren = children.reduce((a, child) => ({
    ...a,
    [child._id]: 1,
    ...child.flatChildren
  }), {});
  return { children, flatChildren };
};

const list = (state = {}, action) => {
  switch (action.type) {
    case ADD_LIST:
      return {
        ...action.list,
        ...mkFlat(action.list.children)
      };
    case ADD_ITEM:
    case DELETE_ITEM:
    case MOVE_ITEM:
      if (state._id === action.payload.parentId) {
        return {
          ...state,
          ...mkFlat(children(state.children, action))
        };
      } else {
        return {
          ...state,
          children: state.children.map(child => list(child, action))
        };
      }
    case EDIT_ITEM:
      if (state._id === action.payload.parentId) {
        return {
          ...state,
          children: children(state.children, action)
        };
      } else {
        return {
          ...state,
          children: state.children.map(child => list(child, action))
        };
      }
    case FETCH_LIST.REQUEST:
      return {};
    case FETCH_LIST.SUCCESS:
      return {
        ...action.list,
        ...mkFlat(action.list.children)
      };
    default:
      return state;
  }
};

export default list;
