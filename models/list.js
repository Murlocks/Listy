var mongoose = require('mongoose');
var Schema = require('mongoose').Schema;

var populateChildren = function(next) {
  this.populate('children');
  next();
};

var ListSchema = new Schema({
  data: String,
  hidden: Boolean,
  children: [{
    type: Schema.Types.ObjectId,
    ref: 'List'
  }]
}).pre('findOne', populateChildren)
  .pre('find', populateChildren)
  .pre('remove', function(next) {
    this.children.forEach(child => {
      this.constructor.findOne({ _id: child })
        .then(list => list.remove());
    });
    next();
  });

module.exports = mongoose.model('List', ListSchema);
