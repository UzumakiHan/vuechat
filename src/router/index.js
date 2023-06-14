import Vue from 'vue';
import Router from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/login.vue';
import MailList from '../views/mailList.vue';

import My from '../views/my.vue';
import WechatMoments from '../views/wechatMoments.vue';
import ChatPage from '../views/chatPage.vue';
import ChatUserInfo from '../views/chatUserInfo.vue';
import SearchFriends from '../views/searchFriends.vue';
import ApplyFriends from '../views/applyFriends.vue';
import PublicMoments from '../views/publicMoments.vue';
import MyWechatMoments from '../views/myWecahtMoments.vue';
import PersonalInfo from '../views/personalInfo.vue';
import EditPersonInfo from '../views/editPersonInfo.vue';
import ChangeMomentBg from '../views/changeMomentBg.vue';
import ChangePassword from '../views/changePassword.vue';
import MapLocation from '../views/mapLocation.vue';
import ShowLocation from '../views/showLocation.vue';
import Application from '../views/application.vue';
import MyChatGrounp from '../views/myChatGrounp.vue';
import SelectChatFriends from '../views/selectChatFriends.vue';
import GrounpChatPage from '../views/grounpChatPage.vue';
import GrounpChatInfo from '../views/grounpChatInfo.vue';
Vue.use(Router);
const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: {
            showTabBar: true,
            keepAlive: false
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: {
            showTabBar: false,
            keepAlive: false
        }
    },
    {
        path: '/maillist',
        name: 'MailList',
        component: MailList,
        meta: {
            showTabBar: true,
            keepAlive: false
        }
    },
    {
        path: '/my',
        name: 'My',
        component: My,
        meta: {
            showTabBar: true,
            keepAlive: false
        }
    },
    {
        path: '/wechatmoments',
        name: 'WechatMoments',
        component: WechatMoments,
        meta: {
            showTabBar: true,
            keepAlive: false
        }
    },
    {
        path: '/mywechatmoments',
        name: 'MyWechatMoments',
        component: MyWechatMoments,
        meta: {
            showTabBar: false,
            keepAlive: false
        }
    },
    {
        path: '/chatpage',
        name: 'ChatPage',
        component: ChatPage,
        meta: {
            showTabBar: false,
            keepAlive: false
        }
    },
    {
        path: '/chatuserInfo',
        name: 'ChatUserInfo',
        component: ChatUserInfo,
        meta: {
            showTabBar: false,
            keepAlive: false
        }
    },
    {
        path: '/searchfriends',
        name: 'SearchFriends',
        component: SearchFriends,
        meta: {
            showTabBar: false,
            keepAlive: false
        }
    },
    {
        path: '/applyfriends',
        name: 'ApplyFriends',
        component: ApplyFriends,
        meta: {
            showTabBar: false,
            keepAlive: false
        }
    },
    {
        path: '/publicmoments',
        name: 'PublicMoments',
        component: PublicMoments,
        meta: {
            showTabBar: false,
            keepAlive: true
        }
    },
    {
        path: '/personalinfo',
        name: 'PersonalInfo',
        component: PersonalInfo,
        meta: {
            showTabBar: false,
            keepAlive: false
        }
    },
    {
        path: '/editpersoninfo',
        name: 'EditPersonInfo',
        component: EditPersonInfo,
        meta: {
            showTabBar: false,
            keepAlive: false
        }
    },
    {
        path: '/changemomentbg',
        name: 'ChangeMomentBg',
        component: ChangeMomentBg,
        meta: {
            showTabBar: false
        }
    },
    {
        path: '/changepassword',
        name: 'ChangePassword',
        component: ChangePassword,
        meta: {
            showTabBar: false,
            keepAlive: false
        }
    },
    {
        path: '/maplocation',
        name: 'MapLocation',
        component: MapLocation,
        meta: {
            showTabBar: false,
            keepAlive: false
        }
    },
    {
        path: '/showlocation',
        name: 'ShowLocation',
        component: ShowLocation,
        meta: {
            showTabBar: false,
            keepAlive: false
        }
    },
    {
        path: '/application',
        name: 'Application',
        component: Application,
        meta: {
            showTabBar: false,
            keepAlive: false
        }
    },
    {
        path: '/mychatgrounp',
        name: 'MyChatGrounp',
        component: MyChatGrounp,
        meta: {
            showTabBar: false,
            keepAlive: false
        }
    },
    {
        path: '/selectchatfriends',
        name: 'SelectChatFriends',
        component: SelectChatFriends,
        meta: {
            showTabBar: false,
            keepAlive: false
        }
    },
    {
        path: '/grounpchatpage',
        name: 'GrounpChatPage',
        component: GrounpChatPage,
        meta: {
            showTabBar: false,
            keepAlive: false
        }
    },
    {
        path: '/grounpchatinfo',
        name: 'GrounpChatInfo',
        component: GrounpChatInfo,
        meta: {
            showTabBar: false,
            keepAlive: false
        }
    }
];

const router = new Router({
    routes
});

export default router;

// vue路由导航守卫控制访问权限
// 如果用户没有登录，但是直接通过URL访问特定页面，需要重新导航到登录页面
router.beforeEach((to, from, next) => {
    // to 将要访问的路径
    // from 代表从那个路径跳转而来
    // next 是一个函数，表示放行
    // next() 放行 next('/login') 强制跳转
    if (to.path === '/login') {
        return next();
    }
    const vuechattoken = JSON.parse(localStorage.getItem('vuechattoken'));
    // console.log(vuechattoken)
    if (!vuechattoken) {
        return next('/login');
    }
    next();
});
