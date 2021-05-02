const express = require('express');
const router = express.Router();
const userRouter = require('./usersRouter');
const chatListRouter = require('./chatListRouter')
const wechatMomentRouter = require('./wechatMomentRouter')
const chatRoomRouter = require('./chatRoomRouter')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.use('/user', userRouter);
router.use('/chatlist', chatListRouter);
router.use('/wechatmoment', wechatMomentRouter);
router.use('/chatroom', chatRoomRouter);

module.exports = router;
