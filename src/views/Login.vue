<template>
    <div>
        <el-form  :rules="rules"
                  v-loading="loading"
                  element-loading-text="正在登录..."
                  element-loading-spinner="el-icon-loading"
                  element-loading-background="rgba(0,0,0,0.8)"
                  ref="loginForm"
                  :model="loginForm"
                  class="loginContainer">
            <h3 class="loginTitle">系统登录</h3>
            <el-form-item prop="username">
                <el-input type="text" v-model="loginForm.username" auto-complete="false" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password" v-model="loginForm.password" auto-complete="false" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item prop="code">
                <el-input type="text" v-model="loginForm.code" auto-complete="false" placeholder="点击图片更换验证码"
                style="width: 250px;margin-right: 5px"></el-input>
                <img :src="captchaUrl" @click="updateCaptcha">
            </el-form-item>

            <el-checkbox v-model="checked" class="loginRemember"> 记住我</el-checkbox>
            <el-button type="primary" style="width: 100%" @click="submitLogin">登录</el-button>

        </el-form>

    </div>
</template>

<script>


    export default {
        name: "Login",
        data(){
            return{
                captchaUrl:'/captcha?time='+new Date(),
                loginForm:{
                    username:'admin',
                    password:'123',
                    code:''
                },
                loading: false,
                checked:true,
                rules:{
                    username:[{required:true,message:'请输入用户名',trigger: 'blur'}],
                    password:[{required:true,message:'请输入密码',trigger:'blur'}],
                    code:[{required:true,message:'请输入验证码',trigger:'blur'}]
                }
            }
        },
        methods:{
            updateCaptcha(){
                this.captchaUrl='/captcha?time='+new Date();
            },
            submitLogin(){
                this.$refs.loginForm.validate((valid)=>{
                    if(valid){
                        //这个地方就是直接使用Axios调用后端接口
                        this.loading=true;
                        //登录，调用后端的接口
                        this.postRequest('/login',this.loginForm).then(resp=>{
                            //登录成功之后直接跳转到 home界面
                            // alert(JSON.stringify(resp));
                            this.loading=false;
                           if(resp){
                               //先处理一下我们的token 将token存在sessionStorage
                               const tokenStr=resp.object.tokenHead+resp.object.token;
                               window.sessionStorage.setItem('tokenStr',tokenStr);
                               this.$router.replace('/home');
                           }

                        })
                    }else{
                        this.$message.error('请输入所有正确字段');
                        return false;
                    }
                });
            }
        }
    }
</script>

<style>


    .loginContainer{
        border-radius:15px;
        background-clip: padding-box;
        margin: 180px auto;
        width: 350px;
        padding: 15px 35px 15px 35px;
        background: #580643;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
    }
    .loginTitle {
        margin: 0 auto 40px auto;
        text-align: center;
        color: white;
    }
    .loginRemember{
        text-align: left;
        margin: 0px 0px 15px 0px;
    }

    .el-form-item__content{
        display: flex;
        align-items: center;
    }

</style>