<template>
    <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="部门管理" name="DepMana">部门管理</el-tab-pane>
            <el-tab-pane label="职位管理" name="PosMana">职位管理</el-tab-pane>
            <el-tab-pane label="职称管理" name="JobleMana">职称管理</el-tab-pane>
            <el-tab-pane label="奖惩规则" name="EcMana">奖惩规则</el-tab-pane>
            <el-tab-pane label="权限组" name="PermissMana">权限组</el-tab-pane>

        </el-tabs>


    </div>
</template>

<script>
    import DepMana from "../../components/sys/basic/DepMana";
    import EcMana from "../../components/sys/basic/EcMana";
    import JobleMana from "../../components/sys/basic/JobleMana";
    import PermissMana from "../../components/sys/basic/PermissMana";
    import PosMana from "../../components/sys/basic/PosMana";


    export default {
        name: "SysBasic",
        data(){
            return{
                activeName: 'PosMana'
            }
        },
        components:{
            DepMana,
            EcMana,
            JobleMana,
            PermissMana,
            PosMana
        }




    }

</script>

<style scoped>

</style>