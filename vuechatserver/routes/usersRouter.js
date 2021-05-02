/**
 * 用户操作用户的一些路由
 */
"use strict";
const express = require('express');
const router = express.Router();
const svgCaptcha = require('svg-captcha');
const md5 = require('md5-node');
const models = require('../db')
const multiparty = require('multiparty');

//验证码 
let captchaText;
/**
 * 获取随机图形验证码
 */
router.get('/captcha', (req, res) => {
  //  console.log(1)
  // 1. 生成随机的验证码
  var captcha = svgCaptcha.create({
    color: true,
    noise: 2,
    size: 4, // 验证码长度
    ignoreChars: '0o1i', // 验证码字符中排除 0o1i
  });
  captchaText = captcha.text
  // // 3. 返回给客户端
  res.type('svg');
  res.status(200).send(captcha.data);
});


//用户注册
router.post('/accountRegister', (req, res) => {
  //console.log(captchaText);
  let newAccount = {
    vuechatName: req.body.vueChatName,
    vuechatAccount: req.body.vueChatAccount,
    vuechatPassword: md5(req.body.vueChatpassword),
    vuechatAvatar: req.body.vuechatAvatar
  }
  let { vueChatCaptcha } = req.body;
  // console.log(vueChatCaptcha)
  if (captchaText != vueChatCaptcha) {
    res.json({
      status: 0,
      message: '验证码不正确'
    })
  } else {
    //验证用户名是否重复
    models.User.findOne({ vuechatAccount: newAccount.vuechatAccount }, (err, data) => {
      if (data) {
        res.json({
          status: 1,
          message: 'vuechat号已存在'
        })
      } else {
        // console.log(newAccount)
        models.User.create(newAccount, (err, data) => {
          if (err) throw err;
          res.json({
            status: 2,
            message: '注册成功'
          })
        })
      }
    })

  }
});
//用户登录
router.post('/accountLogin', (req, res) => {
  let { vueChatAccount, vueChatpassword, vueChatCaptcha } = req.body;
  console.log(captchaText, vueChatCaptcha, md5(vueChatpassword))
  if (captchaText != vueChatCaptcha) {
    res.json({
      status: 0,
      message: '验证码不正确'
    })
  } else {
    models.User.findOne({
      vuechatAccount: vueChatAccount,
      vuechatPassword: md5(vueChatpassword)
    }, (err, data) => {
      if (err) throw err;
      if (data) {
        res.json({
          status: 2,
          message: '登录成功',
          userInfo: data
        })
      } else {
        res.json({
          status: 1,
          message: '登录失败，请检查登录信息是否正确'
        })
      }
    })
  }
});

//根据vuechat号查找好友
router.post('/searchVueChatAccount', (req, res) => {
  let { vuechatAccount } = req.body;
  models.User.findOne({ vuechatAccount: vuechatAccount }, (err, data) => {
    if (err) throw err;
    //console.log(data)
    if (data) {
      res.json({
        status: 2,
        message: '查询成功',
        userInfo: data
      })
    } else {
      res.json({
        status: 1,
        message: '查询失败',
        userInfo: data
      })
    }

  })
});
//根据vuechat号查找自己好友
router.post('/searchMyFriend', (req, res) => {
  // console.log(vuechatAccount,id)
  let { vuechatAccount, id } = req.body;
  // console.log(vuechatAccount,id)
  models.User.findOne({
    _id: id
  }, (err, data) => {
    if (err) throw err;
    if (data) {
      let friendsList = data.friendsList;
      // console.log(friendsList)
      let friendsListLength = friendsList.length;
      let searchFlag = false;
      friendsList.forEach(friend => {
        // console.log(friend)
        models.User.findById(friend, (err1, data1) => {
          if (err1) throw err1;
          if (data1) {
            if (data1.vuechatAccount == vuechatAccount) {
              searchFlag = true;
            }
            friendsListLength--;
            if (friendsListLength === 0) {
              res.json({
                status: 2,
                searchFlag,
                userInfo: data1
              })
            }
          }
        })

      })
    }
  })
  // models.User.findOne({ vuechatAccount: vuechatAccount }, (err, data) => {
  //   if (err) throw err;
  //   //console.log(data)
  //   if (data) {
  //     res.json({
  //       status: 2,
  //       message: '查询成功',
  //       userInfo: data
  //     })
  //   } else {
  //     res.json({
  //       status: 1,
  //       message: '查询失败',
  //       userInfo: data
  //     })
  //   }

  // })
});
//获取登录用户的信息
router.post('/findMyInfo', (req, res) => {
  // console.log(req.body.id)
  let id = req.body.id;
  //console.log(id)
  models.User.findById(id, (err, data) => {
    if (err) throw err;
    if (data) {
      // console.log(data)
      res.json({
        status: 2,
        userinfo: data,
        message: '获取用户信息成功'
      })
    } else {
      res.json({
        status: 1,
        message: '获取用户信息失败'
      })
    }
  })
});
//获取用户添加的好友
router.post('/getMailList', (req, res) => {
  let id = req.body.id;

  models.User.findOne({ _id: id }, (err, data) => {
    let mailList = [];
    if (err) throw err;
    if (data) {
      //console.log(data.friendsList);
      let friendsList = data.friendsList;
      // console.log(friendsList)

      let friendsListLength = friendsList.length;
      //console.log(friendsListLength)
      friendsList.forEach(item => {
        // console.log(item)
        models.User.findOne({ _id: item }, (err1, data1) => {
          if (err1) throw err1;
          if (data1) {
            //console.log(data1)
            mailList.push(data1)
            friendsListLength--;
            // console.log(friendsListLength)
            // console.log(mailList)
            if (friendsListLength === 0) {
              console.log(mailList)
              res.json({
                mailList: mailList,
                status: 2
              })
            }
          }
          // console.log(mailList)
        })

      })


      //console.log(mailList)

    }
  })
});
//删除好友
router.post('/delMyFriend', (req, res) => {
  let { myId, delId } = req.body;
  let sendAccountAndTargetAccountId = myId + delId;
  let targetAccountAndSendAccountId = delId + myId;

  models.User.updateOne({
    _id: myId
  }, {
    $pull: { friendsList: delId }
  }, (err, data) => {
    if (err) throw err;
    if (data) {
      models.User.updateOne({
        _id: delId
      }, {
        $pull: { friendsList: myId }
      }, (err1, data1) => {
        if (err1) throw err1;
        if (data1) {
          models.ChatListDital.deleteMany({
            sendAccountAndTargetAccountId:sendAccountAndTargetAccountId
          }, (err2, data2) => {
            if (err2) throw err2;
            if (data2) {
              models.ChatListDital.deleteMany({
                sendAccountAndTargetAccountId:targetAccountAndSendAccountId
              }, (err3, data3) => {
                if (err3) throw err3;
                if (data3) {
                  res.json({
                    status: 2,
                    message: '删除好友成功'
                  })
                } else {
                  res.json({
                    status: 1,
                    message: '删除好友失败'
                  })
                }
              })
            }
          })
        }
      })
    }

  })
})

//获取用户头像
router.post('/getUserByAccount', (req, res) => {
  let { account } = req.body;
  models.User.findOne({
    vuechatAccount: account
  }, (err, data) => {
    if (err) throw err;
    if (data) {
      //console.log(data.vuechatAvatar);
      res.json({
        status: 2,
        userinfo: data
      })
    } else {
      res.json({
        status: 1,
        avatar: ''
      })
    }
  })
})
//修改个人资料
router.post('/editVueChatInfo', (req, res) => {
  // console.log(req.body.wechatMoment)

  let form = new multiparty.Form();
  form.parse(req, (err, fields, files) => {
    //  console.log(fields, files)

    let id = fields.userid[0]
    let userInfo = {
      vuechatAvatar: fields.vuechatAvatar[0],
      vuechatName: fields.vuechatName[0],
      sex: fields.sex[0],
      phone: fields.phone[0],
      brithday: fields.brithday[0],
      address: fields.address[0],
      personalSign: fields.personalSign[0],

    }

    // console.log(id)
    // console.log(userInfo)
    models.User.updateOne({
      _id: id
    }, userInfo, (err, data) => {
      if (err) throw err;
      if (data) {
        res.json({
          status: 2,
          message: '修改个人资料成功'
        })
      } else {
        res.json({
          status: 1,
          message: '修改个人资料失败'
        })
      }
    })
  })

});
//更改朋友圈背景
router.post('/changeMomentBg', (req, res) => {
  let form = new multiparty.Form();
  form.parse(req, (err, fields, files) => {

    let wechatMomentBg = fields.wechatMomentBg[0];
    let id = fields.userid[0];

    console.log(id, wechatMomentBg)
    models.User.updateOne({ _id: id }, {
      wechatMomentBg: wechatMomentBg
    }, (err, data) => {
      if (err) throw err;
      if (data) {
        res.json({
          status: 2,
          message: '更改成功'
        })
      } else {
        res.json({
          status: 1,
          message: '更改失败'
        })
      }
    })

  })
});

//更改密码
router.post('/changePwd', (req, res) => {
  let { id, changePwd } = req.body;
  models.User.updateOne({
    _id: id,
  }, { vuechatPassword: md5(changePwd) }, (err, data) => {
    if (err) throw err;
    if (data) {
      res.json({
        status: 2,
        message: '修改密码成功，请重新登录'
      })
    } else {
      res.json({
        status: 1,
        message: '修改密码失败'
      })
    }
  })
})
module.exports = router;
