<template>
    <div>
        <el-card class="box-card" style="width: 400px">
            <div slot="header" class="clearfix">
                <span>{{admin.name}}</span>
            </div>
            <div>
                <div>
                    <img title="点击修改用户头像" :src="admin.userFace"
                         style="height: 100px;width: 100px; border-radius: 50px"
                         alt="">
                </div>
                <div>电话号码：<el-tag>{{admin.telephone}}</el-tag></div>
                <div>手机号码：<el-tag>{{admin.phone}}</el-tag></div>
                <div>居住地址：<el-tag>{{admin.address}}</el-tag></div>
                <div>用户标签：<el-tag type="success" v-for="(r,index) in admin.roles" v-bind:key="index"> {{r.nameZh}}</el-tag>
  <!--做个标注----------------------------------------------------------------------------->
                </div>
                <div>
                    <el-button type="primary">修改信息</el-button>
                    <el-button type="danger">修改密码</el-button>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "AdminInfo",
        data(){
            return{
                admin:null
            }
        },
        mounted() {
            this.initAdmin();
        },
        methods:{
           initAdmin(){
               this.putRequest('/admin/info').then(resp=>{
                   if(resp){
                       this.admin=resp;
                   }
               })
           }
        }
    }
</script>

<style >

</style>