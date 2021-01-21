import axios from "axios";
import {Message} from "element-ui";
import router from "../router";
//专门api接口

//响应拦截器
//success表示成功访问到接口；只是说连接到了后端接口
axios.interceptors.response.use(success=>{
    //判断业务逻辑
    if(success.status && success.status==200){
        if(success.data.code==500||success.data.code==401||success.data.code==403){
            Message.error({message:success.data.message});
            return;
        }
        if(success.data.message){
            Message.success({message:success.data.message})
        }
    }
    return success.data;

}, error => {
    if(error.response.code==504||error.response.code==404){
        Message.error({message:'服务器被吃了 囧 '});
    }else if(error.response.code==403){
        Message.error({message:'权限不足，请联系管理员'});
    }else if(error.response.code==401){
        Message.error({message:'尚未登录，请登录'});
        router.replace('/');
    }else {
        if(error.response.data.message){
            Message.error({message:error.response.data.message});
        }else {
            Message.error({message:'未知错误!另请高明'});
        }
    }
    return;
});

let base='';



//传送json格式的post请求
export const postRequest=(url,params)=>{
    return axios({
        method:'post',
        url:'${base}${url}',
        data:params
    })
}

