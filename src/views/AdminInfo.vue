<template>
    <div>
        <el-card class="box-card" style="width: 400px">
            <div slot="header" class="clearfix">
                <span>{{admin.name}}</span>
            </div>
            <div>
                <div style="display: flex;justify-content: center">
                    <el-upload
                            action="/admin/userFace"
                            :headers="headers"
                            :data="admin"
                            :show-file-list="false"
                            :on-success="onSuccess">
                        <img title="点击修改用户头像" :src="admin.userFace"
                             style="height: 100px;width: 100px; border-radius: 50px"
                             alt="">
                    </el-upload>
                </div>
                <div>电话号码：<el-tag>{{admin.telephone}}</el-tag></div>
                <div>手机号码：<el-tag>{{admin.phone}}</el-tag></div>
                <div>居住地址：<el-tag>{{admin.address}}</el-tag></div>
                <div>用户标签：<el-tag type="success" v-for="(r,index) in admin.roles" v-bind:key="index"> {{r.nameZh}}</el-tag>
                </div>
                <div style="display: flex;justify-content: center;margin-top: 10px">
                    <el-button type="primary" @click="showUpdateAdminInfoView">修改信息</el-button>
                    <el-button type="danger" @click="showUpdatePasswordView">修改密码</el-button>
                </div>
            </div>
        </el-card>
        <el-dialog
                title="编辑用户信息"
                :visible.sync="dialogVisible"
                width="30%">
            <div>
                <table>
                    <tr>
                        <td>用户昵称：</td>
                        <td><el-input v-model="admin2.name"></el-input></td>
                    </tr>
                    <tr>
                        <td>用户电话：</td>
                        <td><el-input v-model="admin2.telephone"></el-input></td>
                    </tr>
                    <tr>
                        <td>手机号码：</td>
                        <td><el-input v-model="admin2.phone"></el-input></td>
                    </tr>
                    <tr>
                        <td>用户地址：</td>
                        <td><el-input v-model="admin2.address"></el-input></td>
                    </tr>
                </table>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateAdminInfo">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog
                title="修改密码"
                :visible.sync="passwordDialogVisible"
                width="30%">
            <!--来一个表单校验-->
            <div>
                <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="请输入旧密码" prop="oldPass">
                        <el-input type="password" v-model="ruleForm.oldPass" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="请输入新密码" prop="pass">
                        <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="确认新密码" prop="checkPass">
                        <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                        <el-button @click="resetForm('ruleForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "AdminInfo",
        data(){
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.ruleForm.checkPass !== '') {
                        this.$refs.ruleForm.validateField('checkPass');
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.ruleForm.pass) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return{
                headers:{
                    Authorization:window.sessionStorage.getItem('tokenStr')
                },
                admin:null,
                admin2:null,
                dialogVisible:false,
                passwordDialogVisible:false,
                ruleForm: {
                    pass: '',
                    checkPass: '',
                    oldPass:''
                },
                rules: {
                    oldPass: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    pass: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    checkPass: [
                        { validator: validatePass2, trigger: 'blur' }
                    ]
                }
            }
        },
        mounted() {
            this.initAdmin();
        },
        methods:{
            onSuccess(){
                this.initAdmin();
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        //如果检验通过，我们就更新密码
                        //alert('submit!');
                        this.ruleForm.adminId=this.admin.id;
                        this.putRequest('/admin/pass',this.ruleForm).then(resp=>{
                            if (resp) {
                                //更新了密码之后应该退出登录
                                this.postRequest('/logout')
                                window.sessionStorage.removeItem('user');
                                window.sessionStorage.removeItem('tokenStr');
                                this.$store.commit('initRoutes',[]);
                                this.$router.replace('/');
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            showUpdatePasswordView(){
                this.passwordDialogVisible=true;
            },
            updateAdminInfo(){
                this.putRequest('/admin/info',this.admin2).then(resp=>{
                    if(resp){
                        this.dialogVisible=false;
                        this.initAdmin();
                    }
                })
            },
            showUpdateAdminInfoView(){
                this.dialogVisible=true
            },
           initAdmin(){
               this.getRequest('/admin/info').then(resp=>{
                   if(resp){
                       this.admin=resp;
                       //这里使用对象的copy
                       this.admin2=Object.assign({},this.admin);
                       //再把改过的用户昵称存入到vueX中
                       window.sessionStorage.setItem('user',JSON.stringify(resp));
                       this.$store.commit('INIT_ADMIN',resp);
                   }
               })
           }
        }
    }
</script>

<style >

</style>