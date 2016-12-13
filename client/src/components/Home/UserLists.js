import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import DeleteListButton from './DeleteListButton';

import { ListGroup, ListGroupItem } from 'react-bootstrap';

const _UserLists = ({ push, lists }) =>
  <ListGroup componentClass='ul'>
    {
      lists.map(list =>
        <ListGroupItem key={list._id}>
          <span onClick={() => push(`/list/${list._id}`)}
            style={{
              display: 'inline-block',
              width: '95%',
              cursor: 'pointer'
            }}
          >
            {list.data}
          </span>
          <DeleteListButton
            style={{
              display: 'inline-block',
              position: 'absolute',
              right: '10px',
              width: '5%',
              textAlign: 'right',
              cursor: 'pointer'
            }}
            list={list}
          />
        </ListGroupItem>
      )
    }
  </ListGroup>;

const UserLists = connect(
  state => ({
    lists: state.auth.user.lists
  }), {
    push
  }
)(_UserLists);

export default UserLists;
