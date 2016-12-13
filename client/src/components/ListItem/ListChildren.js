import React from 'react';
import ListItem from './ListItem';
import HiddenListItem from './HiddenListItem';
import NewItemBox from './NewItemBox';

const ListChildren = ({ isDragging, list, rootId }) =>
  <ul>
    { list.children && list.children.map((child, idx) => {
      const ListType = !child.hidden ? ListItem : HiddenListItem;
      return (
        <ListType
          key={child._id}
          rootId={rootId}
          parentId={list._id}
          cIndex={idx}
          list={child}
        />
      );
    })}
    { !isDragging.currently &&
      <NewItemBox parentId={list._id} cIndex={list.children.length - 1} />
    }
  </ul>;

export default ListChildren;
