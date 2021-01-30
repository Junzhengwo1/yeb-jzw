import Vue from 'vue'
import VueX from 'vuex'

Vue.use(VueX);

export default new VueX.Store({
    state:{
        routes:[]
    },

    mutations:{
        initRoutes(state,data){
            state.routes=data;
        }
    },
    actions:{}
})