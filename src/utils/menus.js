import {getRequest} from "./api";

export const initMenu=(router,store)=>{
    if(store.state.routes.length>0){
        return;
    }

    getRequest('/system/cfg/menu').then(data=>{
        if(data){
            //格式化router 方法在下面
            let fmtRoutes=formatRoutes(data);
            //格式化后添加到路由中
            router.addRoutes(fmtRoutes);
            //将数据存入vuex中
            store.commit('initRoutes',fmtRoutes);
            //路由守卫实时监控websockt的连接
            store.dispatch('connect');
        }
    })
};

export const formatRoutes=(routes)=>{
    let fmtRoutes=[];
    routes.forEach(router=>{
        let{
            path,
            component,
            name,
            iconCls,
            children,
        }=router;
        if(children && children instanceof Array){
            //递归
            children=formatRoutes(children);
        }
        let fmRouter={
            path:path,
            name:name,
            iconCls:iconCls,
            children:children,
            component(resolve){
                if(component.startsWith('Home')){
                    require(['../views/'+component+'.vue'],resolve);
                } else if(component.startsWith('Emp')){
                    require(['../views/emp/'+component+'.vue'],resolve);
                } else if(component.startsWith('Sal')){
                    require(['../views/sal/'+component+'.vue'],resolve);
                } else if(component.startsWith('Sta')){
                    require(['../views/sta/'+component+'.vue'],resolve);
                } else if(component.startsWith('Sys')){
                    require(['../views/sys/'+component+'.vue'],resolve);
                }
            }


        };
        fmtRoutes.push(fmRouter)
    });
    return fmtRoutes;


};
