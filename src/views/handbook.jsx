import {Button, Modal ,Dialog, Dimensions,Input} from 'nuke';
import {mount} from 'nuke-mounter';
import {createElement, Component} from 'weex-rx';
import { View, Text, TouchableHighlight,ScrollView} from 'nuke-components';
import { checkIssetUser, getTodayReport, getHistoryReport } from '../api';

import QN from 'QAP-SDK';

let {height} = Dimensions.get('window');
export default class HandBook extends Component{
    constructor() {
        super();   
        this.state = {
            dspPassword:'',
            reDspPassword:''
        }    
    }
     componentDidMount(){
       
    }
    setDspWeb(){
        this.refs.modal.show();
    }
    submitPwd(){
        var password = this.state.dspPassword;
        var repassword = this.state.reDspPassword;

        if(password === '')
            {
                Modal.toast('请输入密码');
                return;
            }
            if(repassword === '')
            {
                Modal.toast('请输入确认密码');
                return;
            }
            if(password !== repassword)
            {
                Modal.toast('两次输入密码不一致');
                return;
            }

            //数字 字母 下划线
            var re = /^[a-zA-Z0-9_@.]{1,}$/;
            if(!re.test(password) || !re.test(repassword))
            {
                Modal.toast('密码只能由数字 字母 下划线组成');
                return;
            }

            if(password.length < 6 || repassword.length < 6)
            {
                Modal.toast('密码长度不能少于6位');
                return;
            }
            checkIssetUser().then((result)=>{
                if(result && result.user_id != undefined){
                    setDspPassword(result.user_id,password).then((res)=>{
                        if(res && res.password)
                        {
                            Modal.toast('密码设置成功');
                        }else
                        {
                            Modal.toast('密码设置失败');
                        }
                        this.hideModal();
                    },(error)=>{
                        Modal.toast('请求错误');
                        this.hideModal();
                    }) 
                }
            })
    }
    hideModal(){
         this.refs.modal.hide();
    }
    render(){
        return (
               <ScrollView style={app.content}>
                    <View style={app.car}>
                        <View style={app.cardContent}>
                            <View style={app.cardContentInner}>
                                <Text style={{ontSize:'0.8rem'}}>
                                电脑登陆网页版喜宝DSP可使用更多功能
                                </Text>
                                <Text style={{fontSize:'1rem'}}>
                                    dsp.xibao100.com
                                </Text>
                                <TouchableHighlight style={{fontSize:'0.8rem'}} onPress={this.setDspWeb.bind(this)}>
                                    <Button>我要登陆网页版</Button>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                    <View style={{paddingLeft:'0.5rem',paddingRight:'0.5rem'}}>
                        <View style={app.contentBlockTitle}>什么是喜宝淘外流量？</View>
                        <View style={app.listBlock}>喜宝DSP淘外流量是一款专门解决淘宝卖家站外投放难题的优化软件，简单地说您可以通过喜宝DSP平台获取到精准、高质、低价的淘外流量，低成本享受钻展般的高曝光量。您可以在电脑上用浏览器登陆 dsp.xibao100.com 享受完整版。</View> 
                    </View>
                     <View style={{paddingLeft:'0.5rem',paddingRight:'0.5rem'}}>
                        <View style={app.contentBlockTitle}>怎么推广？</View>
                        <View style={app.listBlock}>您在软件内完成充值后，选中想推广的宝贝，点击【开始推广】按钮，软件即自动帮您帮把宝贝投放到站外众多知名网站广告位上。</View> 
                    </View>
                     <View style={{paddingLeft:'0.5rem',paddingRight:'0.5rem'}}>
                        <View style={app.contentBlockTitle}>在哪些网站上推广？</View>
                        <View style={app.listBlock}> 您的宝贝将在折800、360购物、网易、新浪、阿里妈妈、百度、腾讯、阿里巴巴等数千个知名电商网站中3万以上广告展位精准投放。软件根据买家浏览、购物习惯等信息自动匹配潜在买家展示您的宝贝。</View> 
                    </View>
                     <View style={{paddingLeft:'0.5rem',paddingRight:'0.5rem'}}>
                        <View style={app.contentBlockTitle}>为什么需要先充值？</View>
                        <View style={app.listBlock}>喜宝淘外流量根据买家看到宝贝后的点击行为收取推广费用，所以需要您预先充值，投放后软件将自动从余额里扣除点击广告费，没有点击不收费。</View> 
                    </View>
                    <View style={{paddingLeft:'0.5rem',paddingRight:'0.5rem'}}>
                        <View style={app.contentBlockTitle}>怎么停止推广?</View>
                        <View style={app.listBlock}>选中推广中的宝贝，点击【取消推广】按钮，即可暂停对该宝贝的投放推广。</View> 
                    </View>
                    <View style={{paddingLeft:'0.5rem',paddingRight:'0.5rem'}}>
                        <View style={app.contentBlockTitle}>怎么优化投放效果？</View>
                        <View style={app.listBlock}> 投放效果跟您的宝贝、店铺、出价、日限额等因素有关，在软件里您可以自行调整出价、日限额来控制预算，优化投放效果。</View> 
                    </View>
                    <View style={{paddingLeft:'0.5rem',paddingRight:'0.5rem'}}>
                        <View style={app.contentBlockTitle}>什么是日限额、平均出价?</View>
                        <View style={app.listBlock}> 
                         和直通车类似，喜宝淘外流量根据买家的点击行为实时竞价广告位，您可以自由调整买家每次点击的竞价出价金额。
                         日限额是您每天推广宝贝的广告费最高额度限制，您可以自行修改， 确保每天的花费不超过自己的预算。
                        </View> 
                    </View>

                    <Dialog ref="modal" contentStyle={app.modalStyle} >
                        <View>
                            <Text style={{padding:'20rem'}}>设置DSP登陆密码</Text>
                        </View>
                    <View style={app.body}>
                        <TouchableHighlight style={app.cellItemList} >
                            <Text style={app.itemTextList}>访问地址</Text>
                            <Text style={app.itemArrow}> https://dsp.xibao100.com </Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={app.cellItemList} >
                            <Text style={app.itemTextList}>用户名</Text>
                            <Text style={app.itemArrow}> https://dsp.xibao100.com </Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={app.cellItemList} >
                            <Text style={app.itemTextList}>密码</Text>
                            <Input onBlur={(value)=>{this.state.dspPassword =  value.target.attr.value;}}/>
                        </TouchableHighlight>
                        <TouchableHighlight style={app.cellItemList} >
                            <Text style={app.itemTextList}>确认密码</Text>
                            <Input onBlur={(value)=>{this.state.reDspPassword =  value.target.attr.value;}} />
                        </TouchableHighlight>
                    </View>

                    <View style={app.footer}>
                        <TouchableHighlight style={app.button} onPress={this.hideModal.bind(this)}>
                            <Text>取消</Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={app.button} onPress={this.submitPwd.bind(this)}>
                            <Text>确定</Text>
                        </TouchableHighlight>
                    </View>
                    <TouchableHighlight style={app.close} onPress={this.hideModal.bind(this)}>
                        <Text style={app.closeText}>X</Text>
                    </TouchableHighlight>
                </Dialog>
                </ScrollView>
                
            )
    }
}
const app = {
    content:{
        top: '2.2rem'
    },
    car:{
        background: '#fff',
        boxShadow: '0 0.05rem 0.1rem rgba(0, 0, 0, 0.3)',
        margin: '0.5rem',
        position: 'relative',
        borderRadius: '0.1rem',
        fontSize: '0.7rem',
        backgroundColor: '#e5e5e5',
        height: '180px',
        textAlign: 'center'
    },
    cardContent:{
        position: 'relative'
    },
    cardContentInner:{
        padding: '0.75rem',
        position: 'relative'
    },
    contentBlockTitle:{
        position: 'relative',
        overflow: 'hidden',
        margin: 0,
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        fontSize: '0.8rem',
        textTransform: 'uppercase',
        lineHeight: 1,
        color: '#6d6d72',
        margin: '1.75rem 0.75rem 0.5rem',
        fontWeight: 'bold'
    },
    listBlock:{
        margin: 0,
        fontSize: '0.7rem'
    },
    body: {
        padding:'20rem'
    },
    cellItemList:{
        backgroundColor:"#e8e8e8",
        height:"90rem",
        borderBottomWidth:"2rem",
        borderBottomStyle:"solid",
        borderBottomColor:"#e8e8e8",
        paddingRight:"30rem",
        paddingLeft:"30rem",
        alignItems:"center",
        flexDirection:"row",
        display:'flex'
    },
    itemTextList:{
        fontSize:"30rem",
        color:"#0894EC",
        flex:15
    },
    itemArrow:{
        flex: 4,
        fontSize:"30rem",
        color:"#5F646E" ,
       
        marginLeft:'2rem'
    }
}