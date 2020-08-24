<template>
    <div class="body">
        <div class="header">
            <span>
                License Server
            </span>
        </div>
        <div class="content">
            <div class="l-box" v-show="isShow">
                <p>Activate Product License</p>
                <el-form ref="form" :model="form" label-width="6rem" :rules="rules" >
                    <el-form-item label="Machine ID" prop="machineId">
                        <el-input size="small" v-model="form.machineId"></el-input>
                    </el-form-item>
                    <el-form-item label="Partnumber" prop="pn">
                        <el-input size="small" v-model="form.pn"></el-input>
                        </el-select>
                    </el-form-item>
                </el-form>
                <el-button class="fr" size="small" @click="getAuthcode">
                    Activate
                </el-button>
            </div>
            <div class="authcode" v-show="!isShow">
                <p>Activate successful!</p>
                <p>Please enter the Auth Code into server.</p>
                <h2>
                    Auth Code: {{authcode}}
                </h2>
            </div>
        </div>
        
        <div class="footer">
            <img src="../../assets/imgs/logo.png" alt="">
            @ 1983-2020 Advantech
        </div>
    </div>
    
    
        


</template>
<style lang="scss" scoped>
    @import "../../assets/css/colors"; 
    .body{
        display: -webkit-flex; /* Safari */
        display: flex;
        height: 100%;
        flex-flow: column nowrap;
        .header{
            height: 40px;
            flex:  none;
            border-bottom: 3px solid #1382c6;
            
            span{
                color: #1382c6;
                display: inline-block;
                font-weight: 800;
                margin-left: 10px;
                padding:10px;
            }
        }
        .content{
            flex: auto;
            padding: 20px;
            height: 100%;
            display: flex;
            align-items: center;
            font-size: 14px;
            .l-box{
                margin: 0 auto;
                padding:15px;
                width:320px;
                margin: 0 auto;
                height: 160px;
                background-color: #efefef;
                border-radius: 5px;
                p{
                    margin-bottom: 20px;
                    text-align: center;
                }
                input{
                    border-radius: 5px;
                }
            }
            .authcode{
                margin: 0 auto;
                padding:15px;
                width:320px;
                margin: 0 auto;
                height: 180px;
                border-radius: 5px;
                background-color: #efefef;
                p{
                    text-align: center;
                    margin-bottom: 10px
                }
                h2{
                    color: #1382c6;
                    text-align: center;
                    margin-top: 40px;
                    font-size: 14px;
                }
            }
        }
        .footer{
            height: 32px;
            background-color: #efefef;
            flex: none;
            display: flex;
            align-items: center;
            font-size: 11px;
            img{
                height: 23px;
                margin-left: 20px;
                margin-right: 10px;
            }
        }
    }
    .el-form-item{
        margin-bottom: 11px;
    }

    
</style>
<script>
    import {getAuthcodeApi} from "../restfulapi/licenseInfo"
    import handleResponse from "../restfulapi/handleResponse"

    export default{
        name: 'controlAppcontrol',
        data(){
            return {
                form: {
                    machineId: "",
                    pn: ""
                },
                isShow: true,
                authcode: "",
                rules:{
                    machineId: {required: true, trigger: 'blur'},
                    pn: {required: true, trigger: 'blur'},
                },
            }
        },
        methods:{
            getAuthcode(){
                this.$refs.form.validate((valid) => {
                    if(valid) {
                        getAuthcodeApi(this.form).then((res) => {
                            handleResponse(res, (data) => {
                                if(data.status == "success"){
                                    this.isShow = false;
                                    this.authcode = data.data.authcode;
                                }
                            })
                        })
                    }
                })
                
            }
        },

        created() {
            if(this.$route.query){
                this.form.machineId = this.$route.query.machineId;
                this.form.pn = this.$route.query.partnumber;
            }
        },

    }
</script>


