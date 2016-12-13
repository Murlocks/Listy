const jwt     = require('jsonwebtoken');
const express = require('express');
const router  = express.Router();
const list    = require('./list');
const auth    = require('./auth');

const fs = require('fs');
const path = require('path');
const fn = path.join(__dirname, '../config.json');
const data = fs.readFileSync(fn);

const conf = JSON.parse(data);
const secret = conf.secret;

const dispatch = (action, res) => action.then(data => res.json(data))
                                        .catch(err => res.sendStatus(err));

router.post('/auth/login', (req, res) => {
  dispatch(auth.login(req.body.email, req.body.password), res);
});

router.post('/auth/register', (req, res) => {
  dispatch(auth.register(req.body.email, req.body.password), res);
});

router.post('/auth/authenticate', (req, res) => {
  dispatch(auth.authenticate(req.body.token), res);
});

// Authorized??
router.use((req, res, next) => {
  var token = req.headers.authorization.split(' ')[1];
  if (token) {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) return res.sendStatus(403);
      req.userId = decoded._id;
      next();
    });
  } else return res.sendStatus(403);
});

router.post('/list', (req, res) => {
  dispatch(list.saveList(req.body.data, req.userId), res);
});

router.post('/list/delete', (req, res) => {
  dispatch(list.deleteList(req.body.listId), res);
});

router.post('/list/saveitem', (req, res) => {
  dispatch(list.saveItem(req.body.parentId, req.body.cIndex, req.body.data), res);
});

router.post('/list/additem', (req, res) => {
  dispatch(list.addItem(req.body.parentId, req.body.cIndex, req.body.item), res);
});

router.post('/list/deleteitem', (req, res) => {
  dispatch(list.deleteItem(req.body.parentId, req.body.cIndex, req.body.clean), res);
});

router.post('/list/moveitem', (req, res) => {
  dispatch(list.moveItem(
    req.body.sourceId,
    req.body.sourceIndex,
    req.body.targetId,
    req.body.targetIndex
  ), res);
});

router.post('/list/edititem', (req, res) => {
  dispatch(list.editItem(req.body.listId, req.body.data), res);
});

router.get('/list/:id', (req, res) => {
  dispatch(list.getList(req.params.id), res);
});

module.exports = router;
