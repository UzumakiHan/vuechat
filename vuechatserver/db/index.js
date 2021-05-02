const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/vuechatdb');
const db = mongoose.connection;
db.on('open', function () {
    console.log('MongoDB Connection Successed');
});
// 连接失败
db.on('error', function () {
    console.log('MongoDB Connection Error');
});

/************** 定义模式loginSchema **************/
const userSchema = mongoose.Schema({
    vuechatAccount: String, //vuechat账号
    vuechatPassword: String,//vuechat密码
    vuechatName: String,//vuechat昵称
    age: {
        type: String,
        default: '20'
    },//年龄
    sex: {
        type: String,
        default: '男'
    },//性别
    brithday: {
        type: String,
        default: '1997-06-28'
    },//生日
    vuechatAvatar: {
        type: String,

    }, //头像
    address: {
        type: String,
        default: '广东广州'
    },//地址
    phone: {
        type: String,
        default: ''
    },
    //朋友圈背景图
    wechatMomentBg: {
        type: String,
        default: ""
    },
    friendsList: {
        type: Array,
        default: []
    },
    // wechatMomentList: {
    //     type: Array,
    //     default: []
    // },
    //申请好友列表
    applyVuechatFriendsList: {
        type: Array,
        default: []
    },
    //自己的好友申请列表
    myApplyVuechatFriendsList: {
        type: Array,
        default: []
    },
    //个人签名
    personalSign: {
        type: String,
        default: ""
    },
    createTime: {
        type: Date,
        default: new Date()
    },
    //我的群组
    chatRooms: {
        type: Array,
        default: []
    }

});

/************** 定义模式chatListDitalSchema 私聊聊天**************/
const chatListDitalSchema = mongoose.Schema({
    //唯一标识id
    sendAccountAndTargetAccountId: String,
    //发送对象 ID
    sendAccountId: {
        type: String,
    },
    sendAccountAvatar: String,
    sendAccountName: String,
    //接受对象
    targetAccountId: {
        type: String
    },
    targetAccountAvatar: String,
    targetAccountName: String,

    //聊天内容为文字
    chatMessage: String,
    //聊天内容为内容图片
    chatImg: String,
    //聊天时间
    chatTime: String,
    //聊天内容为音频时
    chatVoice: Object,
    // chatType:Array
})
/************** 定义模式wechatMomentLists 朋友圈**************/
const wechatMomentSchema = mongoose.Schema({
    vueChatId: {
        type: String
    },
    momentText: {
        type: String,
        default: ''
    },
    momentTime: {
        type: String,

    },
    base64ImgList: {
        type: Array,
        default: []
    },
    location: {
        type: String,
        default: ""
    },
    latitudeAndlongitude: {
        type: Object,
        default: {}
    },
    likeAccounts: {
        type: Array,
        default: []
    },
    commentList: {
        type: Array,
        default: []
    }

})

/************** 定义模式chatRoom 聊天室**************/
const chatRoomSchema = mongoose.Schema({
    //群昵称
    chatRoomName: {
        type: String,
        default: 'vuechat群聊'
    },
    //群成员
    chatRoomMemberId: {
        type: Array,

    },
    //创建时间
    chatRoomCreateTime: {
        type: Date,
        default: new Date()
    },
    //群缩略图
    chatRoomImg: {
        type: String,

    },
    //群公告
    chatRoomAd:{
        type:String,
        default:""
    },
    //群主
    chatRoomOwner:{
        type:String
    }


})


/************** 定义模式chatListGrounpSchema 私聊聊天**************/
const chatListGrounpSchema = mongoose.Schema({
    //聊天室Id
    chatRoomId: String,
    //聊天室群名
    chatRoomName:String,
    //聊天室头像
    chatRoomImg:String,
    //聊天内容为文字
    chatMessage: String,
    //聊天内容为内容图片
    chatImg: String,
    //聊天时间
    chatTime: {
       type:String
    },
    //聊天内容为音频时
    chatVoice: Object,
    //唯一标识id
    sendAccountAndchatRoomId: String,
    //发送对象 ID
    sendAccountId: {
        type: String,
    },
    sendAccountAvatar: String,
    sendAccountName: String,
    //群成员
    chatRoomMemberId: {
        type: Array,

    },

})
/************** 定义模型Model **************/
const Models = {
    User: mongoose.model('User', userSchema),
    ChatListDital: mongoose.model('ChatListDital', chatListDitalSchema),
    wechatMoment: mongoose.model('wechatMoment', wechatMomentSchema),
    chatRoom: mongoose.model('chatRoom', chatRoomSchema),
    chatGroupList: mongoose.model('chatGroupList', chatListGrounpSchema),



    // chatListDitale: mongoose.model('chatListDitale',chatListDitalSchema),
    // chatGroupList: mongoose.model('chatGroupList',chatGroupListSchema),
}

module.exports = Models;
