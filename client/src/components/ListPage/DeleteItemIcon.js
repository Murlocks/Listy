import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withState, withHandlers } from 'recompose';
import { identity } from 'ramda';
import { DropTarget } from 'react-dnd';
import list from '../../actions/list';
import { setCurrentId } from '../../actions/ListPage';
import DeleteConfirmation from '../DeleteConfirmation';

const WIDTH = 64, HEIGHT = 64;
const MARGIN = 20;

const slicePx = s => s.slice(0, s.length - 2);

const iconStyle = props => ({
  ...props.style,
  bottom: slicePx(props.style.bottom) - MARGIN / 2 + 'px',
  right: slicePx(props.style.right) - MARGIN / 2 + 'px',
  borderRadius: '10px',
  width: WIDTH + MARGIN,
  height: HEIGHT + MARGIN,
  background: props.isOver ? 'grey' : 'white'
});

const _DeleteItemIcon = props =>
  props.connectDropTarget(<div>
    <div style={iconStyle(props)} >
      <img
        width={WIDTH}
        height={HEIGHT}
        style={props.style}
        src='/assets/trash.svg'
        alt='trash-bin'
      />
    </div>
    <DeleteConfirmation
      data={props.data}
      show={props.showModal}
      close={props.closeModal(false)}
      confirm={props.closeModal(true)}
    />
  </div>);

const dropTarget = DropTarget(
  'list',
  {
    hover: ({ setCurrentId }) => {
      setCurrentId({
        id: null,
        cIndex: null,
        maxIndex: 'none'
      });
    },

    drop: (props, monitor) => {
      if (monitor.didDrop()) return;

      props.setCurrentId({
        id: null,
        cIndex: null,
        maxIndex: 'none'
      });

      const item = monitor.getItem();
      props.setData(item.data);
      props.setModalFun(() =>
        props.remove.bind(null, {
          parentId: item.parentId,
          cIndex: item.cIndex,
          clean: true
        })
      );
      props.openModal();
    }
  },
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  })
);

const DeleteItemIcon = compose(
  connect(
    null, {
      remove: list.remove,
      setCurrentId
    }
  ),
  withState('data', 'setData', ''),
  withState('showModal', 'toggleModal', false),
  withState('modalFun', 'setModalFun', identity),
  withHandlers({
    openModal: ({ toggleModal }) => () =>
      toggleModal(true),
    closeModal: props => confirm => () => {
      if (confirm)
        props.modalFun();
      props.toggleModal(false);
      props.setModalFun(identity);
      props.setData('');
    }
  }),
  dropTarget
)(_DeleteItemIcon);

export default DeleteItemIcon;
