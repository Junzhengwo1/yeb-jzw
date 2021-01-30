<template>
    <div>
        <el-container>
            <el-header class="homeHeader">
                <div class="title">CloudOffice</div>

                <el-dropdown class="userInfo">
                    <span class="el-dropdown-link">
                        {{user.name}}<i><img :src="user.userFace"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>个人中心</el-dropdown-item>
                        <el-dropdown-item>设置</el-dropdown-item>
                        <el-dropdown-item>注销登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>

            </el-header>
            <el-container>
                <el-aside width="200px">
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
                <el-container>
                    <el-main>
                        <router-view/>

                    </el-main>
                    <el-footer>Footer</el-footer>
                </el-container>
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
                user: JSON.parse(window.sessionStorage.getItem('user'))
            }
        },

        //计算属性
        computed:{
            routes(){
                return this.$store.state.routes;
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
        width: 48px;
        height: 48px;
        border-radius: 24px;
    }

</style>