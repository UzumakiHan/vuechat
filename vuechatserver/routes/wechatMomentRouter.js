/**
 * 用户发表朋友圈的一些路由
 */
"use strict";
const express = require('express');
const router = express.Router();
const multiparty = require('multiparty');
const models = require('../db')


//发表朋友圈
router.post('/publicMoment', (req, res) => {
    // console.log(req.body.wechatMoment)
    let form = new multiparty.Form();
    form.parse(req, (err, fields, files) => {
        let latitudeAndlongitude = JSON.parse(fields.latitudeAndlongitude[0])
        // console.log(JSON.parse(fields.latitudeAndlongitude[0]))
        let base64ImgListLength = Number(fields.base64ImgListLength[0]);
        let base64ImgList = [];
        for (let i = 0; i < base64ImgListLength; i++) {
            let base64ImgListIndex = `base64ImgList${i}`;
            base64ImgList.push(fields[base64ImgListIndex][0]);
        }

        let momentInfo = {
            vueChatId: fields.vueChatId[0],
            momentText: fields.momentText[0],
            base64ImgList: base64ImgList,
            location: fields.location[0],
            momentTime: fields.momentTime[0],
            latitudeAndlongitude: latitudeAndlongitude
        }
        models.wechatMoment.create(momentInfo, (err, data) => {
            if (err) throw err;
            if (data) {
                res.json({
                    status: 2,
                    message: '发表成功'
                })
            } else {
                res.json({
                    status: 1,
                    message: '发表失败'
                })
            }
        })


    })

});
//获取好友们的朋友圈
router.post('/allFriendsWechatMoments', (req, res) => {
    let { id } = req.body;
    let allFriendsWechatMoments = []
    models.User.findById(id, (err, data) => {
        if (err) throw err;
        if (data) {
            let friendsList = data.friendsList;
            friendsList.push(id);
            console.log(friendsList)
            let allUserLength = friendsList.length;
            friendsList.forEach(vuechatId => {
                models.wechatMoment.find({
                    vueChatId: vuechatId
                }, (err1, data1) => {
                    if (err1) throw err1;
                    if (data1) {

                        data1.forEach(item => {
                            allFriendsWechatMoments.push(item);
                        })
                        allUserLength--;
                        if (allUserLength === 0) {
                            // console.log(allFriendsWechatMoments)
                            res.json({
                                status: 2,
                                allFriendsWechatMoments
                            })
                        }
                    }

                })
            })
        }
    })

});
//获取自己的朋友圈
router.post('/myWechatMoments', (req, res) => {
    let { id, pageNum, pageSize } = req.body;
    // let myWechatMoments = [];
    console.log(id, pageNum, pageSize);
    models.wechatMoment.find({ vueChatId: id }).then(data => {
        let wechatmoments = data.reverse()
        res.send({ status: 2, message: '获取成功', myWechatMoments: pageFilter(wechatmoments, pageNum, pageSize) })
    }).catch(err => {
        res.json({
            status: 1,
            message: '获取失败'
        })
    })
    // models.wechatMoment.find({
    //     vueChatId: id
    // }, (err, data) => {
    //     if (err) throw err;
    //     if (data) {
    //         myWechatMoments.push(data);
    //         res.json({
    //             status: 2,
    //             myWechatMoments
    //         })
    //     } else {
    //         res.json({
    //             status: 1,
    //             myWechatMoments
    //         })
    //     }
    // })
});
//删除朋友圈
router.post('/delWechatMoment', (req, res) => {
    let { id } = req.body;
    models.wechatMoment.deleteOne({
        _id: id
    }, (err, data) => {
        if (err) throw err;
        if (data) {
            res.json({
                status: 2,
                message: '删除成功'
            })
        } else {
            res.json({
                status: 1,
                message: '删除失败'
            })
        }
    })


});
//点赞朋友圈
router.post('/likeWechatMoment', (req, res) => {
    let { wechatMomentId, vuechatAccountId } = req.body;
    models.wechatMoment.updateOne({
        _id: wechatMomentId
    }, {
        // likeAccounts:[]
        $push: { likeAccounts: vuechatAccountId }
    }, (err, data) => {
        if (err) throw err;
        if (data) {
            res.json({
                status: 2,
                message: '点赞成功'
            })
        } else {
            res.json({
                status: 1,
                message: '点赞失败'
            })
        }

    })
});
//取消点赞朋友圈
router.post('/unLikeWechatMoment', (req, res) => {
    let { wechatMomentId, vuechatAccountId } = req.body;
    models.wechatMoment.updateOne({
        _id: wechatMomentId
    }, {
        // likeAccounts:[]
        $pull: { likeAccounts: vuechatAccountId }
    }, (err, data) => {
        if (err) throw err;
        if (data) {
            res.json({
                status: 2,
                message: '取消点赞成功'
            })
        } else {
            res.json({
                status: 1,
                message: '取消点赞失败'
            })
        }

    })
});
//评论朋友圈
router.post('/sendWechatComment', (req, res) => {
    // console.log(req.body);
    let { wechatMomentId, sendCommentId, recieveCommentId, wechatCommentTime, wechatComment } = req.body;
    let commentInfo = {
        sendCommentId,
        recieveCommentId,
        wechatComment,
        wechatCommentTime
    }
    models.wechatMoment.updateOne({
        _id: wechatMomentId
    }, {
        $push: { commentList: commentInfo }
    }, (err, data) => {
        if (err) throw err;
        if (data) {
            res.json({
                status: 2,
                message: '评论成功'
            })
        } else {
            res.json({
                status: 1,
                message: '评论失败'
            })
        }
    })
    // console.log(commentInfo);

});
/*
得到指定数组的分页信息对象
 */
function pageFilter(arr, pageNum, pageSize) {
    pageNum = pageNum * 1
    pageSize = pageSize * 1
    const total = arr.length
    const pages = Math.floor((total + pageSize - 1) / pageSize)
    const start = pageSize * (pageNum - 1)
    const end = start + pageSize <= total ? start + pageSize : total;
    const list = []
    for (var i = start; i < end; i++) {
        list.push(arr[i])
    }

    return {
        pageNum,
        total,
        pages,
        pageSize,
        list
    }
}
module.exports = router;