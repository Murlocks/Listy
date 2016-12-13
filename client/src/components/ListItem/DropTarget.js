import { DropTarget } from 'react-dnd';

export default DropTarget(
  'list',
  {
    canDrop: (props, monitor) => {
      const { children } = monitor.getItem();
      if (children[props.list._id])
        return false;
      else return true;
    },

    hover: (props, monitor) => {
      if (!monitor.canDrop() || monitor.didDrop()) return;

      const { setCurrentId, parentId, cIndex, current, list } = props;
      const item = monitor.getItem();

      if (!monitor.isOver({ shallow: true }))
        return;
      if (current.id === parentId && current.cIndex === cIndex)
        return;

      if (item.id === list._id) {
        setCurrentId({
          id: null,
          cIndex: null,
          maxIndex: 'none'
        });
      } else if (props.cIndex - 1 === cIndex) {
        setCurrentId({
          id: parentId,
          cIndex: cIndex + 1
        });
      } else {
        setCurrentId({
          id: parentId,
          cIndex
        });
      }
    },

    drop: (props, monitor) => {
      if (monitor.didDrop()) return;

      const item = monitor.getItem();
      const { list, parentId, cIndex, root } = props;
      const { move, setCurrentId } = props;

      setCurrentId({
        id: null,
        cIndex: null,
        maxIndex: 'none'
      });

      if (item.id === list._id) return;

      if (root) {
        move({
          sourceId: item.parentId,
          sourceIndex: item.cIndex,
          targetId: list._id,
          targetIndex: list.children.length - 1
        });
      } else {
        const diffParent = parentId !== item.parentId;
        if (diffParent || cIndex !== item.cIndex) {
          move({
            sourceId: item.parentId,
            sourceIndex: item.cIndex,
            targetId: parentId,
            targetIndex: cIndex
          });
        }
      }
    }
  },
  connect => ({
    connectDropTarget: connect.dropTarget()
  })
);
