import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { compose, withHandlers, branch, renderNothing, lifecycle } from 'recompose';
import { identity } from 'ramda';
import list from '../../actions/list';
import { moveCurrentUp, moveCurrentDown } from '../../actions/ListPage';

import { InputGroup, FormControl } from 'react-bootstrap';

export const newItemBoxStyle = {
  display: 'inline-block',
  verticalAlign: 'middle',
  width: '100%',
  padding: '3px 0 3px 0',
  marginLeft: '-23px'
};

const _NewItemBox = ({ handleKeyDown }) =>
  <li style={newItemBoxStyle}>
    <InputGroup>
      <InputGroup.Addon>◉</InputGroup.Addon>
      <FormControl
        placeholder='Enter new item...'
        onKeyDown={handleKeyDown}
        ref='newItemInput'
      />
    </InputGroup>
  </li>;

const handleKeyDown = props => e => {
  switch (e.key) {
    case 'Enter':
      e.preventDefault();
      let data = e.target.value;
      if (data) {
        props.add({
          parentId: props.current.id,
          cIndex: props.current.cIndex,
          maxIndex: props.current.maxIndex,
          data: data
        });
      }
      e.target.value = '';
      break;
    case 'ArrowUp':
      props.moveCurrentUp();
      break;
    case 'ArrowDown':
      props.moveCurrentDown();
      break;
    default:
      break;
  }
};

const NewItemBox = compose(
  connect(
    state => ({
      current: state.current
    }), {
      add: list.add,
      moveCurrentUp,
      moveCurrentDown
    }
  ),
  branch(
    ({ current, parentId, cIndex }) =>
      current.id !== parentId || current.cIndex !== cIndex,
    renderNothing,
    identity
  ),
  withHandlers({
    handleKeyDown: props => handleKeyDown(props)
  }),
  lifecycle({
    componentDidMount: function() {
      ReactDOM.findDOMNode(this.refs.newItemInput).focus();
    }
  })
)(_NewItemBox);

export default NewItemBox;
