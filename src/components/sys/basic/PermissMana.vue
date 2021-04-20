<template>
    <div>
        <div class="permissManaTool">
            <el-input size="small" placeholder="请输入角色英文名" v-model="role.name">
                <template slot="prepend">ROLE_</template>
            </el-input>
            <el-input size="small" v-model="role.nameZh" placeholder="请输入角色中文名"></el-input>
            <el-button size="small" type="primary" icon="el-icon-plus">添加角色</el-button>
        </div>

        <div class="permissManaMain">
            <el-collapse v-model="activeName" accordion @change="change">
                <el-collapse-item :title="r.nameZh" :name="r.id" v-for="(r,index) in roles"
                :key="index" >
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>可访问资源</span>
                            <el-button style="float: right; padding: 3px 0 ;color: red" type="text" icon="el-icon-delete"></el-button>
                        </div>
                        <div>
                            <!--树型展示权限-->
                            <el-tree show-checkbox
                                     :data="allMenus"
                                     :props="defaultProps"
                                     ref="tree"
                                     :default-checked-keys="selectedMenus"
                                     node-key="id">
                            </el-tree>
                            <div style="display: flex;justify-content: flex-end">
                                <el-button size="mini" @click="cancelUpdate">取消修改</el-button>
                                <el-button size="mini" type="primary" @click="doUpdate(r.id,index)">确认修改</el-button>
                            </div>
                        </div>
                    </el-card>
                </el-collapse-item>

            </el-collapse>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PermissMana",
        data(){
            return{
                role:{
                    name:'',
                    nameZh:''
                },
                roles:[],
                allMenus:[],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                selectedMenus:[],
                activeName:-1
            }
        },
        mounted() {
            this.initRoles();
        },
        methods:{
            cancelUpdate(){
                this.activeName = -1;
            },
            doUpdate(rid,index){
                let tree=this.$refs.tree[index];
                //已经选中的keys
                let selectedKeys=tree.getCheckedKeys(true);
                //更新菜单处理
                let url='/system/basic/permission/?rid='+rid;
                selectedKeys.forEach(key=>{
                    url+='&mids='+key;
                });
                this.putRequest(url).then(resp=>{
                    if(resp){
                        this.initRoles();
                        this.activeName = -1;
                    }
                })
            },
            //点击事件
            change(rid){
                if(rid){
                    this.initAllMenus();
                    this.initSelectedMenus(rid);
                }
            },
            initSelectedMenus(rid){
                this.getRequest('/system/basic/permission/mid/'+rid).then(resp=>{
                    if(resp){
                        this.selectedMenus=resp;
                    }
                })
            },
            //初始化所有菜单
            initAllMenus(){
                this.getRequest('/system/basic/permission/menus').then(resp=>{
                    if(resp){
                        this.allMenus=resp;
                    }
                })
            },
            initRoles(){
                this.getRequest('/system/basic/permission/').then(resp=>{
                    if(resp){
                        this.roles=resp;
                    }
                })
            }
        }
    }
</script>

<style >
    .permissManaTool{
        display: flex;
        justify-content: flex-start;
    }
    .permissManaTool .el-input{
        width: 300px;
        margin-right: 6px;
    }
    .permissManaMain{
        margin-top: 10px;
        width: 800px;
    }




</style>