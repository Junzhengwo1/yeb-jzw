import axios from "axios";
import {Message} from "element-ui";//单独应用饿了吗的message组件
import router from "../router";
//专门api接口


//请求拦截器
axios.interceptors.request.use(config=>{
    //拿到tokenStr 并判断 如果存在的话，就把我们的token放在请求头中
    if(window.sessionStorage.getItem('tokenStr')){
        config.headers['Authorization']=window.sessionStorage.getItem('tokenStr');

    }
    return config;

}, error => {
    console.log(error);
});



//响应拦截器
//success表示成功访问到接口；只是说连接到了后端接口
axios.interceptors.response.use(success=>{
    //判断业务逻辑
    if(success.status && success.status===200){
        if(success.data.code===500||success.data.code===401||success.data.code===403){
            Message.error({message: success.data.message});
            return;
        }
        if(success.data.message){
            Message.success({message: success.data.message})
        }
    }
    return success.data;

}, error => {
    if(error.code===504||error.code===404){
        Message.error({message:'服务器被吃了 囧 '});
    }else if(error.code===403){
        Message.error({message:'权限不足，请联系管理员'});
    }else if(error.code===401){
        Message.error({message:'尚未登录，请登录'});
        router.replace('/');
    }else {
        if(error.message){
            Message.error({message:error.message});
        }else {
            Message.error({message:'未知错误!另请高明'});
        }
    }
    return;
});

// let base='';// eslint-disable-line no-unused-vars

//传送json格式的post请求
export const postRequest=(url,params)=>{
    return axios({
        method: 'post',
        url: url,
        data: params
    })
};

//其他格式的请求
export const putRequest=(url,params)=>{
    return axios({
        method: 'put',
        url: url,
        data: params
    })
};

export const getRequest=(url,params)=>{
    return axios({
        method: 'get',
        url: url,
        data: params
    })
};

export const deleteRequest=(url,params)=>{
    return axios({
        method: 'delete',
        url: url,
        data: params
    })
};