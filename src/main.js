import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.css'

import {postRequest} from "./utils/api";
import {putRequest} from "./utils/api";
import {getRequest} from "./utils/api";
import {deleteRequest} from "./utils/api";
import {initMenu} from "./utils/menus";
import {downloadRequest} from "./utils/download";

Vue.use(ElementUI,{size:'small'});
Vue.config.productionTip = false;

Vue.prototype.postRequest=postRequest;
Vue.prototype.putRequest=putRequest;
Vue.prototype.getRequest=getRequest;
Vue.prototype.deleteRequest=deleteRequest;
Vue.prototype.downloadRequest=downloadRequest;


//router全局前置守卫
router.beforeEach((to,from,next)=>{

  //判断是否有tokenStr
  if(window.sessionStorage.getItem('tokenStr')){
    initMenu(router,store);
    if(!window.sessionStorage.getItem('user')){
      //如果不存在的话
      return getRequest('/admin/info').then(resp=>{
        if(resp){
          //存入用户信息
          window.sessionStorage.setItem('user',JSON.stringify(resp));
          next();
        }
      })
    }
    next();
  }else {
    //也就是说，必须要到登录页面
      if(to.path=='/'){
        next();
      }else {
        //也就是去了sys/basic
        next('/?redirect='+to.path);
      }

  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
