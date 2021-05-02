import {post,get} from './ajax';
const BASE_URL = '/api';

//获取验证码接口
export const getCaptchaSvg = () => get(BASE_URL+`/user/captcha?time=${new Date()}`);

//注册账号
export const vueChatRegister = (userInfo) => post(BASE_URL + '/user/accountRegister',userInfo);

//用户登录
export const vueChatLogin = (userInfo) => post(BASE_URL + '/user/accountLogin',userInfo);

//根据vuechat号查询好友

export const searchVueChatAccount = (userInfo) => post(BASE_URL + '/user/searchVueChatAccount',userInfo);

//根据vuechat号查询自己好友

export const searchMyFriend = (userInfo) => post(BASE_URL + '/user/searchMyFriend',userInfo);
//查找登录用户的信息
export const getUserInfo = (id) => post(BASE_URL + '/user/findMyInfo',{id});


//查找通讯录
export const getMailList = (id) => post(BASE_URL + '/user/getMailList',{id});

//删除好友
export const delMyFriend = (delInfo) => post(BASE_URL + '/user/delMyFriend',delInfo);

//获取私聊的聊天记录
export const getDigtalChatMsg = (msgInfo) => post(BASE_URL + '/chatlist/digtalChatList',msgInfo);

//获取首页的聊天列表
export const alldigtalChatList = (id) => post(BASE_URL + '/chatlist/alldigtalChatList',{id})


//查找聊天用户的信息
export const getChatUserInfo = (id) => post(BASE_URL + '/user/findMyInfo',{id});


//清除私聊聊天记录
export const cleanDigtalChatMessage = (id) => post(BASE_URL + '/chatlist/cleanChatMessage',{id});

//发表朋友圈
// export const publicWechatMoment = (wechatMoment) => post(BASE_URL + '/wechatmoment/publicMoment',wechatMoment)

//获取好友们朋友圈
export const getAllFriendsWechatMoments = (id) => post(BASE_URL + '/wechatmoment/allFriendsWechatMoments',{id});
//获取自己的朋友圈
export const getMyWechatMoments = (info) => post(BASE_URL + '/wechatmoment/myWechatMoments',info);
//删除朋友圈
export const delWechatMoment = (id) => post(BASE_URL + '/wechatmoment/delWechatMoment',{id})
//点赞朋友圈
export const likeWechatMoment = (wechatMoment) => post(BASE_URL + '/wechatmoment/likeWechatMoment',wechatMoment)
//取消点赞
export const unLikeWechatMoment = (wechatMoment) => post(BASE_URL + '/wechatmoment/unLikeWechatMoment',wechatMoment)
//更改密码
export const changeUserPwd = (changeInfo) => post(BASE_URL + '/user/changePwd',changeInfo)
//获取用户的群聊聊天记录
export const getGroupChatList = (sendAccountAndchatRoomId) => post(BASE_URL + '/chatlist/myGroupChatMsg',{sendAccountAndchatRoomId})
// export const getGroupChatList = (chatRoomId) => post(BASE_URL + '/chatlist/myGroupChatMsg',{chatRoomId})
//更改群昵称
export const editChatRoomName = (ChatRoomInfo) => post(BASE_URL + '/chatroom/editChatRoomName',ChatRoomInfo);
//更改群公告
export const editChatRoomAd = (ChatRoomInfo) => post(BASE_URL + '/chatroom/editChatRoomAd',ChatRoomInfo);
//获取单个聊天室信息
export const getChatRoomInfo = (id) => post(BASE_URL + '/chatroom/getChatRoomInfo',{id});
//移除群成员
export const removeChatMember = (removeInfo) => post(BASE_URL + '/chatroom/removeChatMember',removeInfo);
//获取单个聊天室信息
export const cleanChatList = (sendAccountAndchatRoomId) => post(BASE_URL + '/chatlist/cleanChatList',{sendAccountAndchatRoomId});
//群主退出群聊

export const deleteChatOwner = (removeInfo) => post(BASE_URL + '/chatroom/deleteChatOwner',removeInfo);
//获取首页群聊的记录
export const getAllgrounpChatList = (id) => post(BASE_URL + '/chatlist/allgrounpChatList',{id});

//评论朋友圈
export const sendWechatComment = (commentInfo) => post(BASE_URL + '/wechatmoment/sendWechatComment',commentInfo)