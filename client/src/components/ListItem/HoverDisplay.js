import React from 'react';
import { branch, renderNothing } from 'recompose';
import { identity } from 'ramda';

const _HoverDisplay = props =>
  <div style={hoverStyle(props)} />;

const hoverStyle = ({ current, parentId, cIndex }) => ({
  height: '4px',
  borderRadius: '20px',
  background: current.id === parentId && current.cIndex === cIndex ?
    'grey' : 'white'
});

const HoverDisplay = branch(
  ({ isDragging }) => !isDragging.currently,
  renderNothing,
  identity
)(_HoverDisplay);

export default HoverDisplay;
