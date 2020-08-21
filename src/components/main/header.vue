<template>
        <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;"> -->
    <el-header class="nav-header">
        <ul class="nav-left" >
            <li>
                <i class="fa fa-indent collapseIcon pointer" aria-hidden="true" v-if="isCollapse" @click="collapseAsideNavbar()"></i>
                <i class="fa fa-outdent collapseIcon pointer" aria-hidden="true" v-else @click="collapseAsideNavbar()"></i>
            </li>
            <li>
                <!-- {{appTitle}} -->
                <img src="@/assets/imgs/EIDevice.png" alt="">
            </li>
        </ul>
        <ul class="nav-right">
            <li class="status">
                <span>
                    {{$t('header.agentStatus')}}
                </span>
                <el-switch
                v-model="isOnline"
                active-color="#13ce66"
                @change="switchStatus"
                :disabled="isabled">
                </el-switch> 
            </li>
            <li> 
                <el-dropdown trigger="click" >
                    <span class="el-dropdown-link">
                        <i class="fa fa-qrcode header-qrcode pointer"></i> 
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item class="text-center" >
                            <qr-code :value="qrCodeValue" :options="{ width: 260}"　class="block-center" v-if="isShowCode"></qr-code>
                        </el-dropdown-item>
                        <el-dropdown-item class="qrIntroduce" >
                            {{$t('header.edgeOnCodeIntroduce')}}
                            
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>  
            </li>
            <li> 
                <el-dropdown trigger="click" >
                    <span class="el-dropdown-link">
                        <i class="fa fa-user-circle-o header-user pointer"></i> 
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item class="text-center" :disabled="true" >
                            <img src="@/assets/imgs/face_black.png" alt="">
                            <p style="font-size: 23px"> {{username}}</p>
                        </el-dropdown-item>
                        <el-dropdown-item :disabled="true">
                            <b class="w-150 m-r-5">{{$t('header.agentStatus')}}</b>
                            <span class="c-success" v-if="agentStatus == 5">
                                Online
                            </span>
                            <span class="c-darkgray" v-else>
                                Offline
                            </span>
                        </el-dropdown-item>
                        <el-dropdown-item :disabled="true">
                            <b class="w-150 m-r-5">{{$t('header.hostname')}}</b>{{hostname}}
                        </el-dropdown-item>
                        <el-dropdown-item :disabled="true">
                            <b class="w-150 m-r-5">{{$t('header.deviceName')}}</b>{{deviceName}}
                        </el-dropdown-item>
                        <el-dropdown-item :disabled="true">
                            <b class="w-150 m-r-5">{{$t('header.lastAccessed')}}</b>{{logintime}}
                        </el-dropdown-item>

                        <el-dropdown-item class="m-t-10">
                            <el-button type="warning" size="small" style="width: 100%; padding: 10px;" @click="loginout()">
                                <i class="fa fa-sign-out c-white m-r-5" aria-hidden="true"></i>
                                {{$t('header.loginOut')}}
                            </el-button>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>  
            </li>

            <li> 
                <el-dropdown trigger="click" @command="switchLang">
                    <span class="el-dropdown-link">
                        <i class="fa fa-globe pointer"></i> 
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item class="text-center" command="zh">
                            <p　class="pointer"> 中文</p>
                        </el-dropdown-item>
                        <el-dropdown-item  command="en">
                            <p class="pointer">English</p>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>  
            </li>
        </ul>
    </el-header>
</template>
<style lang="scss" scoped>
    @import "../../assets/css/colors"; 

    .nav-header{
        background: $lightgray-color;
        border-bottom: 3px solid $androidDM-color;
        display: -webkit-flex;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: space-between;
        .nav-left{
            padding: 0;
            margin: 0;
            display: flex;
            li{ 
                img{
                    width: 130px;
                    margin-top: 0.6rem;
                }
                &:nth-child(1){
                    margin-right: 1.2rem;
                    margin-top: 0.9rem !important;
                    font-size: 1.1rem;
                }
                color:$primary-color;  
            }
        }
        .nav-right{
            padding:0;
            margin:0;
            display: flex;
            li{  
                i{
                    color: $primary-color;
                    font-size:1.5rem;
                }
                margin-left: 2rem;
                width: 1rem;
                color: $primary-color;  
            }

            li.status{
                width: 150px;
                margin-top:2px;
                span{
                    display: inline-block;
                    margin-right: 5px
                }
                div{
                    display: inline-block;
                }
            }
                              
        }
    }
    .qrIntroduce {
        text-align: center;
        color: rgba(0,0,0,0.6);
        font-size: 14px;
        // margin-top: -20px;
    }

    .el-dropdown-menu__item.is-disabled{
        color: #606266;
    }

</style>
<script>

    import {mapState} from 'vuex'
    import {setLang} from '../../lang/lang'
    import handleResponse from '../restfulapi/handleResponse'
    import qrCode from '@chenfengyuan/vue-qrcode';
    import {getQrcodeApi, getAgentStatusApi} from "../restfulapi/configApi"
    import {getSession, setLocal, getLocal, removeLocal, checkLocal, setSession} from "../../assets/js/storage"
    import {applicationTitle} from "../../assets/js/constant"
    import {startAgentApi, stopAgentApi} from "../restfulapi/configApi"
    export default{
        name: 'mainHeader',
        data(){
            let validatePwd = (rule,value,callback)=>{
                let reg=new RegExp(/^[0-9A-Za-z]{3,12}$/);
                if(!reg.test(value)){
                    return callback(new Error (this.$t('global.verifySimpleError')))
                }else{callback()};
            };
            return {
                img:"",
                appTitle: applicationTitle,
                qrCodeValue: "",
                username:'',
                logintime:'',
                allowleft: "fa fa-long-arrow-left",
                allowright: "fa fa-bars",
                formLabelWidth: "200px",
                isShowCode: false,
                agentStatus: 0,
                hostname: "",
                deviceName: "",
                isOnline: false,
                isabled: false,
            }
        },
        components: {
            qrCode,
        },

        props:{
            isCollapse: {
                type: Boolean,
                default: false
            }
        },

        methods:{
            getuserinfo(){
                this.username = getSession("username");
                this.logintime = getSession("logintime");  
            },

            loginout(){
                this.$router.replace('/');
            },
            switchLang(lang){
                if(lang){
                    cookie.setCookie("link_lang", lang, 120);
                    setLang(lang);
                }
            },
            collapseAsideNavbar(){
                this.$emit("collapseAsideNavbar", "")
            },
            getQrcode(){
                getQrcodeApi().then((obj) => {
                    handleResponse(obj, (res) => {
                        if(res.status == "success"){
                            this.qrCodeValue = res.data;
                            this.isShowCode = true;
                        }
                    })
                })
            },

            getAgentStatus(){
                getAgentStatusApi().then((obj) => {
                    handleResponse(obj, (res) => {
                        if(res.status == "success"){
                            let data = JSON.parse(res.data);
                            this.agentStatus = data.status;
                            this.hostname = data.hostname;
                            this.deviceName = data.devicename;
                            if(data.status == 5){
                                this.isOnline = true;
                            }else{
                                this.isOnline = false;
                            }
                        }
                    })
                })
            },
            switchStatus(){
                console.log(this.isOnline)
                this.isabled = true;
                if(this.isOnline){
                    startAgentApi().then((obj) => {
                        this.isabled = false;
                        handleResponse(obj, (res) => {
                            if(res.status == "success"){
                                this.getAgentStatus();   
                            }else{
                                this.isOnline = !this.isOnline
                            }
                        })
                    })
                }else{
                    stopAgentApi().then((obj) => {
                        this.isabled = false;
                        handleResponse(obj, (res) => {
                            if(res.status == "success"){
                                this.getAgentStatus();   
                            }else{
                                this.isOnline = !this.isOnline;
                            }
                        })
                    })
                }
            }
 
        },

        created(){
            this.getuserinfo();
            this.getQrcode();
            this.getAgentStatus()
            setInterval(() => {
                this.getAgentStatus()
            }, 5000);
        },


    }
</script>

