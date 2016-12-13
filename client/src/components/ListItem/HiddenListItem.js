import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { branch, renderNothing } from 'recompose';
import { identity } from 'ramda';
import DropTarget from './DropTarget';
import { setCurrentId } from '../../actions/ListPage';
import listActions from '../../actions/list';

const hiddenItemStyle = ({ current, parentId, cIndex }) => {
  let color = 'white';
  if (current.id === parentId && current.cIndex === cIndex)
    color = 'grey';
  return {
    height: '1.5em',
    borderRadius: '5px',
    background: color
  };
};

const listStyle = {
  display: 'block',
  padding: '3px 0 3px 0',
  marginLeft: '-10px'
};

const dotStyle = {
  fontSize: '1.4rem',
  width: '20px',
};

const _HiddenListItem = props => props.connectDropTarget(
  <li style={listStyle}>
    <table style={{width: '100%'}}>
      <tbody>
        <tr>
          <td style={dotStyle}>{'◉\u00a0\u00a0'}</td>
          <td style={hiddenItemStyle(props)} />
        </tr>
      </tbody>
    </table>
  </li>
);

const HiddenListItem = compose(
  connect(
    state => ({
      current: state.current,
      isDragging: state.isDragging
    }), {
      move: listActions.move,
      setCurrentId
    }
  ),
  branch(
    ({ isDragging, list }) =>
      !isDragging.currently || isDragging.children[list._id],
    renderNothing,
    identity
  ),
  DropTarget
)(_HiddenListItem);

export default HiddenListItem;
