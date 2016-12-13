import { DragSource } from 'react-dnd';

export default DragSource(
  'list',
  {
    canDrag: (props, monitor) => {
      if (monitor.isDragging()) return false;
      if (props.root) return false;
      if (props.list.hidden) return false;
      return true;
    },
    beginDrag: props => {
      let { list } = props;
      setTimeout(() => {
        props.toggleDragMode({
          children: list.flatChildren
        });
        props.setCurrentId({
          id: props.list._id,
        });
      }, 0);
      return {
        children: props.list.flatChildren,
        id: props.list._id,
        parentId: props.parentId,
        cIndex: props.cIndex,
        data: props.list.data,
        fromRoot: props.rootId === props.parentId
      };
    },
    endDrag: props => {
      props.toggleDragMode();
    }
  },
  connect => ({
    connectDragSource: connect.dragSource()
  })
);
