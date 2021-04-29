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
        state: {
            sessions: [],
            admins: [],
            currentSessionId: -1,
            filterKey: '',
            //用于消息交互的
            stomp:null
        }
    },

    mutations: {
        initRoutes(state, data) {
            state.routes = data;
        },
        changeCurrentSessionId(state, id) {
            state.currentSessionId = id;
        },
        addMessage(state, msg) {
            state.sessions[state.currentSessionId - 1].messages.push({
                content: msg,
                date: new Date(),
                self: true
            })
        },
        INIT_DATA(state) {
            //浏览器本地历史聊天记录
            // let data = localStorage.getItem('vue-chat-session');
            // //console.log(data)
            // if (data) {
            //     state.sessions = JSON.parse(data);
            // }
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
            let token=Window.sessionStorage.getItem('tokenStr');
            //做个标记
            context.state.stomp.connect({'Auth-Token':token},)
        },
        initData(context) {
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