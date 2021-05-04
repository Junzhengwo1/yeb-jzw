<template>
    <div>
        <el-container>
            <el-header class="homeHeader">
                <div class="title">CloudOffice</div>
                <div>
                    <el-button icon="el-icon-bell"
                               type="text"
                               style="margin-right: 10px;color: #efff02;"
                               size="max"
                               @click="goChat"></el-button>
                    <el-dropdown class="userInfo" @command="commandHandler">
                    <span class="el-dropdown-link" style="color: white;font-family: 新宋体">
                        {{user.name}}
                        <i><img :src="user.userFace"></i>
                    </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
                            <el-dropdown-item command="setting">账号设置</el-dropdown-item>
                            <el-dropdown-item command="logout">注销登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </el-header>

            <el-container>
                <el-aside width="150px">
                    <!--启用路由模式-->
                    <el-menu router unique-opened>
                        <template v-for="(item,index) in routes">
                            <el-submenu :index="index+''"
                                        :key="index"
                                        v-if="!item.hidden" >
                                <template slot="title">
                                    <i :class="item.iconCls" style="color: #783008;margin-right: 6px"></i>
                                    <span>{{item.name}}</span>
                                </template>
                                <el-menu-item
                                        :index="children.path"
                                        v-for="(children,indexj) in item.children"
                                        :key="indexj">
                                        {{children.name}}
                                </el-menu-item>
                            </el-submenu >
                        </template>
                    </el-menu>
                </el-aside>

                    <el-main>
                        <el-breadcrumb v-if="this.$router.currentRoute.path!='/home'">
                            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                            <el-breadcrumb-item>{{this.$router.currentRoute.name}}</el-breadcrumb-item>
                        </el-breadcrumb>
                        <div class="homeWelcome" v-if="this.$router.currentRoute.path=='/home'">
                            <section class="content-header" style="z-index: 1; position: absolute ;top: 200px ;left: 50%;"  >
                                <h1>欢迎进入系统</h1>
                            </section>
                            <img src="../assets/main.jpeg" style="width: 100%;height: 100%"  />
                        </div>
                        <router-view class="homeRouterView"/>
                    </el-main>

            </el-container>

        </el-container>
    </div>
</template>

<script>
    export default {
        name: "Home",
        //拿到登录后的用户信息
        data(){
            return{
                // user: JSON.parse(window.sessionStorage.getItem('user'))
            }
        },
        //计算属性
        computed:{
            routes(){
                return this.$store.state.routes;
            },
            user(){
                return this.$store.state.currentAdmin;
            }

        },
        methods:{
            goChat(){
                this.$router.push('/chat');
            },
            commandHandler(command){
                if(command==='userinfo'){
                    this.$router.push('/userinfo');
                }
                if(command==='logout'){
                    this.$confirm('此操作将注销登录, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        //注销登录
                        this.postRequest('/logout');
                        //清空用户信息
                        window.sessionStorage.removeItem('tokenStr');
                        window.sessionStorage.removeItem('user');
                        //清空一下vuex中的菜单
                        this.$store.commit('initRoutes',[]);
                        //跳转到登录页
                        this.$router.replace('/');
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消操作'
                        });
                    });
                }

            }
        }
    }
</script>

<style>
    .homeHeader{
        background: #584040;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 15px;
        box-sizing: border-box;
    }
    .homeHeader .title{
        font-size: 25px;
        font-family: "Arial Black";
        color: #cac6c6;
    }

    .homeHeader .userInfo{
        cursor: pointer;
    }

    .el-dropdown-link img{
        width: 40px;
        height: 40px;
        border-radius: 24px;
        margin-left: 10px;
    }

    .homeWelcome{
        text-align: center;
        font-size: 30px;
        font-family: 华文隶书;
        color: #783008;
        padding-top: 60px;
    }

    .homeRouterView{
        margin-top: 10px;
    }

</style>