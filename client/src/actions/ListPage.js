export const SET_SEARCH_FILTER  = 'SET_SEARCH_FILTER';
export const SET_CURRENT_ID     = 'SET_CURRENT_ID';
export const MOVE_CURRENT_DOWN  = 'MOVE_CURRENT_DOWN';
export const MOVE_CURRENT_UP    = 'MOVE_CURRENT_UP';
export const TOGGLE_MANAGE_MODE = 'TOGGLE_MANAGE_MODE';
export const TOGGLE_DRAG_MODE   = 'TOGGLE_DRAG_MODE';

export const CLICK        = 'CLICK';
export const SINGLE_CLICK = 'SINGLE_CLICK';
export const DOUBLE_CLICK = 'DOUBLE_CLICK';

export const setSearchFilter = filter => ({
  type: SET_SEARCH_FILTER,
  filter
});

// payload = { id: String, cIndex: Number, maxIndex:Number } where: "where are at the cIndex-th child"
export const setCurrentId = payload => ({
  type: SET_CURRENT_ID,
  payload
});

export const moveCurrentDown = () => ({
  type: MOVE_CURRENT_DOWN
});

export const moveCurrentUp = () => ({
  type: MOVE_CURRENT_UP
});

export const toggleManageMode = () => ({
  type: TOGGLE_MANAGE_MODE
});

export const toggleDragMode = payload => ({
  type: TOGGLE_DRAG_MODE,
  payload
});

export const click = payload => ({
  type: CLICK,
  payload
});
