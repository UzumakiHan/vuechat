/**
 * 聊天记录相关的内容
 */

"use strict";

const express = require('express');
const router = express.Router();
const models = require('../db')
const multiparty = require('multiparty');
const NET_URL = 'http://127.0.0.1:3000/';
const multer = require('multer');
const fs = require('fs')
//const chatImgUpload = multer({ dest: 'chatImgUpload/' })
const createFolder = function (folder) {
    try {
        fs.accessSync(folder)
    } catch (e) {
        fs.mkdirSync(folder)
    }
}
const uploadVoiceFolder = './chatVoiceUpload/'
createFolder(uploadVoiceFolder)
// 通过 filename 属性定制
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadVoiceFolder) // 保存的路径
    },
    filename: function (req, file, cb) {
        console.log(file)
        cb(null, file)
        // 将保存文件名设置为 字段名 + 时间戳 + 后缀名
        // let fileFormat = (file.originalname).split('.');
        // console.log(fileFormat[fileFormat.length - 1])
        // cb(null, file.fieldname + '-' + Date.now() + '.' + fileFormat[fileFormat.length - 1])
    }
})
const chatVoiceUpload = multer({ storage: storage })

//获取私聊的聊天记录
router.post('/digtalChatList', (req, res) => {
    let chatList = []
    let { sendAccountId, targetAccountId } = req.body;
    //console.log(sendAccountId, targetAccountId)
    let sendAccountAndTargetAccountId = sendAccountId + targetAccountId;
    models.ChatListDital.find({sendAccountAndTargetAccountId}).limit(10).sort({ 'chatTime': -1 }).exec((err,data)=>{
        if (err) throw err;
        if (data) {
            console.log(data)
            res.json({
                status: 2,
                message: '聊天内容获取成功',
                chatDigtalList: data.reverse()
            })
        } else {
            res.json({
                status: 1,
                message: '聊天内容获取失败',
                chatDigtalList: chatList
            })
        }
    })
});

//获取首页的聊天列表（私聊）
router.post('/alldigtalChatList', (req, res) => {
    let { id } = req.body;
    let chatList = []
    models.User.findById(id, (err, data) => {
        if (err) throw err;
        if (data) {
            let friendsList = data.friendsList;
            console.log(data)
            let friendsListLength = friendsList.length;
            if (friendsListLength > 0) {
                friendsList.forEach(friendid => {
                    let sendAccountAndTargetAccountId = id + friendid;
                    models.ChatListDital.find({sendAccountAndTargetAccountId})
                    .limit(1)
                    .sort({ 'chatTime': -1 })
                    .exec((err1,data1)=>{
                        if(err1) throw err1;
                        chatList.push(...data1);
                        friendsListLength--;
                        if (friendsListLength === 0) {
                            res.json({
                                status: 2,
                                message: '聊天内容获取成功',
                                chatDigtalList: chatList
                            })
                        }
                        
                    })
                })
            } else {
                res.json({
                    status: 2,
                    message: '聊天内容获取失败',
                    chatDigtalList: []
                })
            }

        }
    })
})


//清除私聊聊天记录
router.post('/cleanChatMessage', (req, res) => {

    let { id } = req.body;
    console.log(id)
    models.ChatListDital.deleteMany({
        sendAccountAndTargetAccountId: id
    }, (err, data) => {
        if (err) throw err;
        if (data) {
            res.json({
                status: 2,
                message: '清除聊天记录成功'
            })
        } else {
            res.json({
                status: 1,
                message: '清除聊天记录失败'
            })
        }
    })

})

router.post('/uploadChatVoice', (req, res, next) => {

    let form = new multiparty.Form();

    form.uploadDir = 'chatVoiceUpload';
    form.parse(req, (err, fields, files) => {
        console.log(files, fields)
        let chatVoiceUrl = NET_URL + files.chatVoice[0].path.replace(/\\/g, "/");
        let chatVoiceTime = fields.voiceTime[0]
        console.log(chatVoiceUrl)
        if (chatVoiceUrl) {
            res.json({
                status: 2,
                chatVoiceMsg: {
                    chatVoiceTime,
                    chatVoiceUrl,
                }
            })
        } else {
            res.json({
                status: 1,
                chatVoiceMsg: {
                    chatVoiceTime: "",
                    chatVoiceUrl: ""
                }
            })
        }
        //console.log(files)

    })


})

//获取群聊聊天记录
router.post('/myGroupChatMsg',(req,res)=>{

    let { sendAccountAndchatRoomId } = req.body;
  console.log(sendAccountAndchatRoomId)
  //console.log( req.body)
  let groupChatList = [];
  models.chatGroupList.find({sendAccountAndchatRoomId}).limit(10).sort({ 'chatTime': -1 }).exec((err,data)=>{
      if (err) throw err;
      if (data) {
          //  console.log(data);
          groupChatList = data
          res.json({
              status: 2,
              groupChatList,
              message: '获取聊天记录成功',
          })
      } else {
          res.json({
              status: 1,
              groupChatList,
              message: '获取聊天记录失败'
          })
      }
  })

});
//清除群聊聊天记录
router.post('/cleanChatList', (req, res) => {
    let { sendAccountAndchatRoomId } = req.body;
    console.log(sendAccountAndchatRoomId)
    models.chatGroupList.deleteMany({
        sendAccountAndchatRoomId
    }, (err, data) => {
        if (err) throw err;
        if (data) {
            res.json({
                status: 2,
                message: '删除聊天记录成功'
            })
        } else {
            res.json({
                status: 2,
                message: '删除聊天记录失败'
            })
        }
    })
});
//获取首页聊天列表（群聊）
router.post('/allgrounpChatList', (req, res) => {
    let { id } = req.body;
    console.log(id)
    models.User.findById(id, (err, data) => {
        if (err) throw err;
        if (data) {
            let chatRooms = data.chatRooms;
            let chatRoomsLength = chatRooms.length;
            let allGrounpChatList = []
            if (chatRoomsLength > 0) {
                chatRooms.forEach(chatRoomId => {
                    models.chatGroupList.find({chatRoomId}).limit(1)
                    .sort({ 'chatTime': -1 }).exec((err1,data1)=>{
                        if (err1) throw err1;
                        allGrounpChatList.push(...data1);
                        chatRoomsLength--;
                        if (chatRoomsLength === 0) {
                            res.json({
                                status: 2,
                                allGrounpChatList
                            })
                        }
                    })
                })
            } else {
                res.json({
                    status: 2,
                    allGrounpChatList: []
                })
            }
        }
    })
})

module.exports = router;