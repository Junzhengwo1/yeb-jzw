import Vue from 'vue'
import VueX from 'vuex'
import { getRequest } from "../utils/api";
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'


Vue.use(VueX);


const now=new Date();

const store = new VueX.Store({
    state: {
        routes: [],
        sessions:[],
        admins: [],
        currentAdmin: JSON.parse(window.sessionStorage.getItem('user')),
        currentSession: null,
        filterKey: '',
        //用于消息交互的
        stomp:null
    },

    mutations: {
        //这个方法用户保证在更新用户昵称的时候，登录时的昵称随之变化
        INIT_ADMIN(state,admin){
            state.currentAdmin=admin;
        },
        initRoutes(state, data) {
            state.routes = data;
        },
        changecurrentSession(state, currentSession) {
            state.currentSession = currentSession;
        },
        addMessage(state, msg) {
            let mss=state.sessions[state.currentAdmin.username+'#'+msg.to];
                if(!mss){
                //state.sessions[state.currentAdmin.username+'#'+msg.to]=[];
                    Vue.set(state.sessions,state.currentAdmin.username+'#'+msg.to,[])
                }
                state.sessions[state.currentAdmin.username+'#'+msg.to]=[].push({
                content: msg.content,
                date: new Date(),
                self: !msg.notSelf
            })
        },
        INIT_DATA(state) {
            //浏览器本地历史聊天记录
            let data = localStorage.getItem('vue-chat-session');
            //console.log(data)
            if (data) {
                state.sessions = JSON.parse(data);
            }
        },
        INIT_ADMINS(state, data) {
            state.admins = data;
        }
    },
    actions: {
        //连接wesocket
        connect(context){
            //连接后端
            context.state.stomp=Stomp.over(new SockJS('/ws/ep'));
            //获取token
            let token=sessionStorage.getItem('tokenStr');
            //做个标记
            context.state.stomp.connect({'Auth-Token':token},success=> {
                //订阅消息
                context.state.stomp.subscribe('/user/queue/chat',msg=>{
                   let receiveMsg= JSON.parse(msg.body);
                   receiveMsg.notSelf=true;
                   receiveMsg.to=receiveMsg.from;
                   context.commit('addMessage',receiveMsg);
                })
            },error=>{

            })
        },
        initData(context) {
            context.commit('INIT_DATA');
            getRequest('/chat/admin').then(resp => {
                if (resp) {
                    context.commit('INIT_ADMINS', resp)
                }
            });
        }
    }
});

store.watch(function (state) {
    return state.sessions
}, function (val) {
    console.log('CHANGE: ', val);
    localStorage.setItem('vue-chat-session', JSON.stringify(val));
}, {
    deep: true/*这个貌似是开启watch监测的判断,官方说明也比较模糊*/
});

export default store;