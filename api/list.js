const List = require('../models/list');
const User = require('../models/user');

const deleteList = (listId) => {
  return List.findOne({ '_id': listId })
    .then(list => list.remove())
    .then(() => {
      return {
        response: {
          status: 200,
          statusMsg: 'List successfully deleted'
        }
      };
    })
    .catch(err => {
      console.error(err);
      Promise.reject(500);
    });
};

const saveList = (data, userId) => {
  return new List({
    data: 'hidden',
    hidden: true,
    children: []
  }).save().then(hidden => {
    return new List({
      data: data,
      children: [ hidden ]
    }).save()
      .then(list =>
        User.findOneAndUpdate(
          { '_id': userId },
          { $push: { lists: list._id } }
        ).then(() => list)
      )
      .catch(err => {
        console.error(err);
        Promise.reject(500);
      });
  });
};

const getList = (id) => {
  return List.findOne({ _id: id })
    .lean()
    .then(list => list)
    .catch(err => {
      console.error(err);
      Promise.reject(500);
    });
};

const saveItem = (parentId, cIndex, data) => {
  return new List({
    data: 'hidden',
    hidden: true,
    children: []
  }).save().then(hidden => {
    return new List({
      data: data,
      children: [
        hidden
      ]
    }).save()
      .then(child => List.findOneAndUpdate(
        { '_id': parentId },
        { $push: {
          children: {
            $each: [ child._id ],
            $position: cIndex
          }
        }}
      )
      .then(() => child, err => err))
      .then(child => child)
      .catch(err => {
        console.error(err);
        Promise.reject(500);
      });
  });
};

const addItem = (parentId, cIndex, item) => {
  return List.findOneAndUpdate(
    { '_id': parentId },
    { $push: {
      children: {
        $each: [ item._id ],
        $position: cIndex
      }
    }}
  ).then(() => item);
};

const deleteItem = (parentId, cIndex, clean) => {
  return List.findOne({ '_id': parentId })
    .then(list => {
      const cId = list.children[cIndex]._id;
      list.children.splice(cIndex, 1);
      list.save().then(() => {
        if (clean)
          List.findOne({_id: cId}).then(list => list.remove());
      });
      return clean ? list :
        List.findOne({_id: cId}).lean().then(list => list);
    })
    .catch(err => {
      console.error(err);
      Promise.reject(500);
    });
};

const moveItem = (sourceId, sourceIndex, targetId, targetIndex) => {
  return deleteItem(sourceId, sourceIndex, false)
    .then(item => addItem(targetId, targetIndex, item));
};

const editItem = (listId, data) => {
  return List.findOneAndUpdate(
    { '_id': listId },
    { $set: { data: data } },
    { new: true }
  );
};

module.exports = {
  saveList: saveList,
  deleteList: deleteList,
  getList: getList,
  saveItem: saveItem,
  addItem: addItem,
  deleteItem: deleteItem,
  moveItem: moveItem,
  editItem: editItem
};
