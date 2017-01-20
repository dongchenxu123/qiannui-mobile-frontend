import {Button,ListView, Modal, Env, NativeDialog } from 'nuke';
const { isWeex } = Env;
import {mount} from 'nuke-mounter';
import {createElement, Component} from 'weex-rx';
import { View, Text, TouchableHighlight,ScrollView,Image } from 'nuke-components';
import { checkIssetDspUser, getDspUserInfo, getDspUserMarket, getOnsaleItem } from '../api';
import _ from 'lodash'

class Drainage extends Component{
    constructor() {
        super();   
        this.state = {
                user_id:'',
                account_id:'',
                nick:'',
                name:'',
                showPhone:false,
                cpc:0,
                budget:0,
                balance:0,
                Items:[],

        }    
    }
 showDialog = (src) => {
        if(isWeex){
            NativeDialog.show(src, {
                width : '640rem',
                height: '300rem',
                showMask:true,
                cancelOnTouch:true,
                data:{
                    id:123344444,
                    xx:'xxx'
                }
            }, (ret) => {
                this.setState({'response':ret});
                console.log(ret);
            }, (err) => {
                this.setState({'response':err});
                console.log(err);
            }, (info) => {
                this.setState({'response':JSON.stringify(info)});
                console.log(JSON.stringify(info));
            });
        }else{
            this.setState({error:'h5环境无效果'})
        }
    }

    componentDidMount(){

      checkIssetDspUser().then((value) => {  
        
            if(value && value.user_id != undefined){
                this.setState({
                    user_id:value.user_id,
                    account_id:value.account_id,
                    nick:value.nick,
                    name:value.name
                });
              
                this.getUserInfo();
                this.getDspUserData();
                this.getDspOnsaleItems();
            }  
        });
    }
    getUserInfo(){
        //其实就是检测了手机号
        getDspUserInfo(this.state.user_id).then((res) => {  
                if(res && res.id && !res.telephone){
                    this.setState({showPhone:true});//todo需要弹出填写手机号
                    Modal.alert('需要弹出手机提示框');
                }           
        });
    }
    getDspUserData(){
         getDspUserMarket(this.state.user_id,1).then((res) => {  
            if(res){
                this.setState({
                    cpc:parseFloat(res.cpc).toFixed(2),
                    balance:res.balance
                });
            }
        });

         getDspUserMarket(this.state.user_id,2).then((res) => {  
            if(res){
                this.setState({
                    budget:res.budget
                });
            }
        });
    }
    getDspOnsaleItems(){
        var itemList = [];

        //获取用户在淘宝中在售的宝贝
        getOnsaleItem().then((onlineItem)=>{
          
            //获取dsp中已经推广的宝贝
            getDspUserMarket(this.state.user_id,3).then((dspItem) => {  

                 if(dspItem.total > 0){
                    this.setState({onLineStatus_num:dspItem.total});
                 }

                onlineItem.map((v,i)=>{
                    onlineItem[i].img_url = v.pic_url+'_150x150.jpg';
                     onlineItem[i].dsp_onLineStatus = 0;

                    if(dspItem.total > 0 && _.findIndex(dspItem.Items,{item_id:v.num_iid.toString()}) > -1){
                         onlineItem[i].dsp_onLineStatus = 1;
                    }  
                });
            itemList =  _.sortBy(onlineItem,[function(o) { return -o.dsp_onLineStatus; }]);
            this.setState({Items:itemList});
                console.log('```````````````',JSON.stringify(this.state.Items));
            });
        })
    }


    render(){
        return (
                <View>
                      <Button onPress={() => {this.showDialog('qap://../docs/innerdialog.js')}}>show</Button>
                <Text>{this.state.error}</Text>
                </View>
            )
    }
}

const styles={
  
}

mount(<Drainage />, 'body');
export default Drainage