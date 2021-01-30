import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login'
import Home from '../views/Home'
import Test from "../views/Test";

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    hidden:true
  },
  {
    path: '/home',
    name: '导航一',
    component: Home,
    children:[
      {
        path:'/test',
        name:'Test',
        component:Test
      }
    ]
  }

];

const router = new VueRouter({
  routes
});

export default router
