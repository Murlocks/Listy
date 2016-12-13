var bcrypt   = require('bcrypt');
var mongoose = require('mongoose');
var Schema   = require('mongoose').Schema;
var validate = require('mongoose-validator');

var UserSchema = new Schema({
  email: {
    type: String,
    unique: [ true ],
    lowercase: true,
    required: [ true, 'An email is required.' ],
    validate: validate({
        validator: 'isEmail',
        message: 'Email must be valid.'
    })
  },
  password: {
    type: String,
    required: [ true, 'A password is required.' ]
  },
  lists: [{
    type: Schema.Types.ObjectId,
    ref: 'List'
  }]
}).pre('save', function(next) {
  if (this.isModified('password') || this.isNew) {
    bcrypt.hash(this.password, 5, (err, hash) => {
      if (err) return next(err);
      this.password = hash;
      next();
    });
  } else return next();
});

UserSchema.methods.compare = function(password, cb) {
  bcrypt.compare(password, this.password, (err, same) => {
    if (err) cb(err);
    cb(null, same);
  });;
};

module.exports = mongoose.model('User', UserSchema);
