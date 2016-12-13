const User = require('../models/user');
const jwt  = require('jsonwebtoken');

const fs = require('fs');
const path = require('path');
const fn = path.join(__dirname, '../config.json');
const data = fs.readFileSync(fn);

const conf = JSON.parse(data);
const secret = conf.secret;

const generateToken = (user) => {
  user = {
    _id: user._id,
    email: user.email,
    lists: user.lists.map(list => {
      return { _id: list._id, data: list.data };
    })
  };
  return jwt.sign(user, secret, {
    expiresIn: 604800
  });
};

const register = (email, password) => {
  return new User({
    email: email,
    password: password
  }).save()
    .then(user => { return { token: generateToken(user) }; })
    .catch(err => {
      if (err.name === 'ValidationError')
        return Promise.reject(422); // email is invalid
      else return Promise.reject(409); // email is used
    });
};

const login = (email, password) => {
  return User.findOne({ email: email }).populate('lists')
    .then(user => new Promise((resolve, reject) => {
      user.compare(password, (err, same) => {
        if (err) return reject(err);
        if (!same) return reject(401); // incorrect password or email

        return resolve({ token: generateToken(user) });
      });
    }))
    .catch(() => Promise.reject(401));
};

const authenticate = (token) => {
  return new Promise((resolve, reject) => {
    if (token) {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) return reject(403);
        return User.findOne({ _id: decoded._id }).populate('lists')
          .then(user => {
            if (user) return resolve({ token: generateToken(user) });
          });
      });
    } else return reject(403);
  });
};

module.exports = {
  register: register,
  login: login,
  authenticate: authenticate
};
