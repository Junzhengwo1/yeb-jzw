<template>
    <div>
        <div style="width: 600px">
            <el-input
                    placeholder="请输入部门名搜索...."
                    prefix-icon="el-icon-search"
                    v-model="filterText">
            </el-input>
            <el-tree
                    :data="deps"
                    :props="defaultProps"
                    :filter-node-method="filterNode"
                    :expand-on-click-node="false"
                    ref="tree">
                <span class="custom-tree-node" slot-scope="{ node, data }" style="display: flex;justify-content: space-between;width: 100%">
                    <span>{{ data.name }}</span>
                        <span>
                          <el-button
                                  type="primary"
                                  size="mini"
                                  class="DepBtn"
                                  @click="() => showAddDep(data)">
                            Append
                          </el-button>
                          <el-button
                                  type="danger"
                                  size="mini"
                                  class="DepBtn"
                                  @click="() => deleteDep(data)">
                            Delete
                        </el-button>
                        </span>
                </span>
            </el-tree>
        </div>

        <div>
            <el-dialog
                    title="添加部门"
                    :visible.sync="dialogVisible"
                    width="30%">
                <div>
                    <!--添加部门时把上级部门展示出来-->
                    <tr>
                        <td>
                            <el-tag>上级部门</el-tag>
                        </td>
                        <td style="margin-left: 4px">{{pname}}</td>
                    </tr>
                    <tr>
                        <td>
                            <el-tag size="small">部门名称</el-tag>
                        </td>
                        <td>
                            <el-input size="mini" style="margin-left: 4px" v-model="dep.name" placeholder="请输入部门名称......"></el-input>
                        </td>
                    </tr>

                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="doAddDep">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        name: "DepMana",
        data(){
            return{
                filterText:'',
                deps:[],
                defaultProps: {
                    children:'children',
                    label:'name'
                },
                dialogVisible:false,
                dep:{
                    name:'',
                    parentId:-1
                },
                pname:''
            }
        },
        mounted() {
            this.initDeps();
        },
        methods: {
            initDep(){
                this.dep={
                    name:'',
                    parentId: -1
                },
                this.pname=''
            },
            addDepToDeps(deps,dep){
                for(let i=0;i<deps.length;i++){
                    let d =deps[i];
                    if(d.id==dep.parentId){
                        d.children=d.children.concat(dep);
                        if(d.children.length>0){
                            d.isParent=true;
                        }
                        return;
                    }else {
                        this.addDepToDeps(d.children,dep);
                    }
                }
            },
            doAddDep(){
                this.postRequest('/system/basic/department/',this.dep).then(resp=>{
                    if(resp){
                        this.addDepToDeps(this.deps,resp.object);
                        this.dialogVisible=false;
                        this.initDep();
                    }
                })
            },
            showAddDep(data){
                this.dep.parentId=data.id;
                this.pname=data.name;
                this.dialogVisible = true;
            },
            removeDepFromDeps(p,deps,id){
                for (let i = 0; i <deps.length ; i++) {
                    let d=deps[i];
                    if(d.id == id){
                        deps.splice(i,1);
                        //判断deps长度是否为零
                        if(deps.length==0){
                            p.isParent=false;
                        }
                        return;
                    }else {
                        this.removeDepFromDeps(d,d.children,id);
                    }
                }
            },
            deleteDep(data){
                if(data.isParent){
                    this.$message.error("该部门是父部门不可以删除！")
                }else {
                    this.$confirm('此操作将永久删除['+data.name+']部门, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        //确认删除；调用删除的接口
                        this.deleteRequest('/system/basic/department/'+data.id).then(resp=>{
                            if(resp){
                                this.removeDepFromDeps(null,this.deps,data.id);
                            }
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                }
            },
            initDeps(){
                this.getRequest('/system/basic/department/').then(resp=>{
                    if(resp){
                        this.deps=resp;
                    }
                })
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            }
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        }
    }
</script>

<style >
    .DepBtn{
        padding: 2px;
    }

</style>