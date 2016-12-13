import React from 'react';

const itemColor = (filterText, data) => ({
  color: !filterText || data.indexOf(filterText) !== -1 ?
    'black' : 'red'
});

const Item = ({filterText, list}) => (
  <span style={itemColor(filterText, list.data)}>
    {list.data}
  </span>
);

export default Item;
