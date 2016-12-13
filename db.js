const mongoose = require('mongoose');

const List = require('./models/list');
const User = require('./models/user');

mongoose.Promise = require('bluebird');

let dbconf = 'mongodb://localhost/listy';

if (process.env.NODE_ENV == 'production') {
  const fs = require('fs');
  const path = require('path');
  const fn = path.join(__dirname, 'config.json');
  const data = fs.readFileSync(fn);

  const conf = JSON.parse(data);
  dbconf = conf.dbconf;
}

mongoose.connect(dbconf);

module.exports = {
  List: List,
  User: User
};
