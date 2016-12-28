import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withState, withHandlers, setPropTypes } from 'recompose';

import DragSource from './DragSource';
import DropTarget from './DropTarget';
import NewItemBox from './NewItemBox';
import Item from './Item';
import HoverDisplay from './HoverDisplay';
import ListChildren from './ListChildren';

import listActions from '../../actions/list';
import { setCurrentId, toggleDragMode, click } from '../../actions/ListPage';

import { PageHeader, Collapse } from 'react-bootstrap';

const listStyle = {
  display: 'block',
  marginLeft: '-10px'
};

const listItemStyle = {
  display: 'block',
  fontSize: '1.4em',
  paddingBottom: '3px',
  // border: '1px solid rgba(0,0,0,0.2)',
  cursor: 'pointer'
};

const dotStyle = {
  fontSize: '1.4rem'
};

const rootListStyle = {
  paddingBottom: '100%',
  overflow: 'auto'
};

const rootItemStyle = {
  cursor: 'pointer',
  marginTop: '-10px'
};

const BaseListItem = props =>
  <div>
    { !props.isDragging.currently &&
      <NewItemBox parentId={props.parentId} cIndex={props.cIndex} />
    }
    <li style={listStyle}>
      { props.connectDragSource(
        <span>
          <HoverDisplay {...props} />
          <span style={listItemStyle} onClick={props.handleClick}>
            <span style={dotStyle} onClick={props.handleToggleList}>
              {'◉\u00a0\u00a0'}
            </span>
            <Item {...props} />
          </span>
        </span>
      )}
      <Collapse in={props.listOpen}>
        <div>
          <ListChildren {...props} />
        </div>
      </Collapse>
    </li>
  </div>;

const RootListItem = props =>
  <div style={rootListStyle}>
    <PageHeader style={rootItemStyle} onClick={props.handleClick} >
      <Item {...props} />
    </PageHeader>
    <ListChildren {...props} />
  </div>;

const _ListItem = props => {
  const ListItemType = props.root ? RootListItem : BaseListItem;
  return props.connectDropTarget(
    <div>
      <ListItemType {...props} />
    </div>
  );
};

// {{{ Prop Checkers
const lazyFunc = (f) => {
  return () => {
    return f.apply(this, arguments);
  };
};

const lazyListType = lazyFunc(() => {
  // eslint-disable-next-line
  return listType;
});

export const listType = React.PropTypes.shape({
  _id: React.PropTypes.string,
  data: React.PropTypes.string,
  children: React.PropTypes.arrayOf(lazyListType)
});

const listItemPropTypes = {
  list: listType,
  filterText: React.PropTypes.string,
  current: React.PropTypes.shape({
    id: React.PropTypes.string,
    cIndex: React.PropTypes.number
  })
};
// }}}

const ListItem = compose(
  setPropTypes(listItemPropTypes),
  connect(
    state => ({
      filterText: state.searchFilter,
      current: state.current,
      isDragging: state.isDragging,
    }), {
      move: listActions.move,
      setCurrentId,
      toggleDragMode,
      click
    }
  ),
  withState('listOpen', 'toggleList', true),
  withHandlers({
    handleToggleList: ({ toggleList, listOpen }) => () =>
      toggleList(!listOpen),
    handleClick: ({ click, parentId, cIndex, list, setCurrentId }) => () => {
      click({ data: list.data, listId: list._id, parentId, cIndex });
      setTimeout(() =>
        setCurrentId({
          id: list._id,
          cIndex: list.children ? list.children.length - 1 : 0,
          maxIndex: list.children ? list.children.length - 1 : 0
        }),
        150
      );
    }
  }),
  DragSource,
  DropTarget
)(_ListItem);

export default ListItem;
