import { push } from 'react-router-redux';
import { fetchApi, createRequestTypes } from './util';
import { setCurrentId } from './ListPage';
import { loginUserFailure } from './auth';

export const FETCH_LIST  = createRequestTypes('FETCH_LIST');
export const ADD_LIST    = 'ADD_LIST';
export const DELETE_LIST = 'DELETE_LIST';

export const ADD_ITEM    = 'ADD_ITEM';
export const MOVE_ITEM   = 'MOVE_ITEM';
export const DELETE_ITEM = 'DELETE_ITEM';
export const EDIT_ITEM   = 'EDIT_ITEM';

const API = process.env.NODE_ENV === 'production' ?
  'http://i6.cims.nyu.edu:18668/api/list' :
  `http://localhost:${process.env.PORT || 3000}/api/list`;


const getAuthHeaders = () =>
  ({ 'Authorization': 'Bearer ' + localStorage['token'] });

const unauthorizedErr = {
  response: {
    status: 403,
    statusText: 'Unauthorized'
  }
};

// payload = { parentId, cIndex }
export const deleteItem = payload => ({
  type: DELETE_ITEM,
  payload
});

// payload = { parentId, cIndex, clean }, where clean is a flag for deleting the child on the db
export const requestDeleteItem = ({ parentId, cIndex, clean }) => {
  return dispatch => {
    return fetchApi(
      `${API}/deleteitem`,
      'post',
      { parentId, cIndex, clean },
      getAuthHeaders()
    ).then(json => {
      dispatch(deleteItem({ parentId, cIndex }));
      dispatch(setCurrentId({
        id: parentId,
        cIndex: json.children.length - 1,
        maxIndex: json.children.length - 1
      }));
    }).catch(e => {
      console.error(e);
      dispatch(loginUserFailure(unauthorizedErr));
    });
  };
};

// payload = { parentId, cIndex, newChild }
export const addItem = payload => ({
  type: ADD_ITEM,
  payload
});

// payload = { parentId, cIndex, maxIndex, data }
export const requestAddItem = ({ parentId, cIndex, maxIndex, data }) => {
  return dispatch => {
    return fetchApi(
      `${API}/saveitem`,
      'post',
      { parentId, cIndex, data },
      getAuthHeaders()
    ).then(newChild => {
      dispatch(addItem({ parentId, cIndex, newChild }));
      dispatch(setCurrentId({
        id: parentId,
        cIndex: cIndex + 1,
        maxIndex: maxIndex + 1
      }));
    }).catch(e => {
      console.error(e);
      dispatch(loginUserFailure(unauthorizedErr));
    });
  };
};

export const moveItem = payload => ({
  type: MOVE_ITEM,
  payload
});

// payload = { sourceId, sourceIndex, targetId, targetIndex }
export const requestMoveItem = payload => {
  let { sourceId, sourceIndex } = payload;
  let { targetId, targetIndex } = payload;
  return dispatch => {
    if (sourceId === targetId && targetIndex > sourceIndex)
      targetIndex--;
    return fetchApi(
      `${API}/moveitem`,
      'post',
      { sourceId, sourceIndex, targetId, targetIndex },
      getAuthHeaders()
    ).then(newChild => {
      dispatch(deleteItem({
        parentId: sourceId,
        cIndex: sourceIndex
      }));
      dispatch(addItem({
        parentId: targetId,
        cIndex: targetIndex,
        newChild
      }));
      dispatch(moveItem({
        parentId: sourceId,
        cIndex: sourceIndex
      }));
      if (payload.nextCurrent)
        dispatch(setCurrentId(payload.nextCurrent));
    }).catch(e => {
      console.error(e);
      dispatch(loginUserFailure(unauthorizedErr));
    });
  };
};

// payload = { parentId, cIndex, data }
export const editItem = payload => ({
  type: EDIT_ITEM,
  payload
});

export const requestEditItem = ({ listId, parentId, cIndex, data }) => {
  return dispatch => {
    return fetchApi(`${API}/edititem`, 'post', { listId, data }, getAuthHeaders())
      .then(() => dispatch(editItem({ parentId, cIndex, data })))
      .catch(e => {
        console.error(e);
        dispatch(loginUserFailure(unauthorizedErr));
      });
  };
};

export const deleteList = listId => ({
  type: DELETE_LIST,
  listId
});

export const requestDeleteList = listId => {
  return dispatch => {
    return fetchApi(`${API}/delete`, 'post', { listId }, getAuthHeaders())
      .then(() => dispatch(deleteList(listId)))
      .catch(e => {
        console.error(e);
        dispatch(loginUserFailure(unauthorizedErr));
      });
  };
};

export const addList = list => ({
  type: ADD_LIST,
  list
});

export const requestAddList = data => {
  return dispatch => {
    return fetchApi(`${API}`, 'post', { data }, getAuthHeaders())
      .then(list => {
        dispatch(addList(list));
        dispatch(push(`/list/${list._id}`));
      }).catch(e => {
        console.error(e);
        dispatch(loginUserFailure(unauthorizedErr));
      });
  };
};

export const fetchListsRequest = _id => ({
  type: FETCH_LIST.REQUEST,
  _id
});

export const fetchListsSuccess = list => ({
  type: FETCH_LIST.SUCCESS,
  list
});

export const fetchListsFailure = _id => ({
  type: FETCH_LIST.FAILURE,
  _id
});

export const fetchLists = _id => {
  return dispatch => {
    dispatch(fetchListsRequest(_id));
    return fetchApi(`${API}/${_id}`, 'get', null, getAuthHeaders())
      .then(list => {
        dispatch(fetchListsSuccess(list));
        dispatch(setCurrentId({
          id: list._id,
          cIndex: list.children.length - 1,
          maxIndex: list.children.length - 1
        }));
      }).catch(e => {
        console.error(e);
        dispatch(fetchListsFailure(_id));
        dispatch(loginUserFailure(unauthorizedErr));
      });
  };
};

export default {
  fetch: fetchLists,
  new: requestAddList,
  delete: requestDeleteList,
  add: requestAddItem,
  remove: requestDeleteItem,
  move: requestMoveItem,
  edit: requestEditItem
};
