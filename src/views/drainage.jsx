import {Button,ListView, Modal, Input} from 'nuke';
import {mount} from 'nuke-mounter';
import {createElement, Component} from 'weex-rx';
import QN from 'QAP-SDK';
import { View, Text, TouchableHighlight,ScrollView,Image } from 'nuke-components';
import { checkIssetDspUser, getDspUserInfo, getDspUserMarket, getOnsaleItem } from '../api';
import _ from 'lodash';

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
 	componentDidMount(){
    	checkIssetDspUser().then((value) => { 
    		Modal.alert(JSON.stringify(value))
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
        }, (error) => {
                Modal.alert(JSON.stringify(error));
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
         	Modal.alert(JSON.stringify(res))
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
                	<View style={styles.cellItemList}>
                		<Text>淘外余额: 123</Text>
                		<View style={{marginLeft: '60rem'}}>
                			<Button type="primary" size='small' >充值</Button>
                		</View>
                		<TouchableHighlight style={{marginLeft: '60rem'}}>
                			<Text style={styles.title}> ? 帮助</Text>
                		</TouchableHighlight>
                	</View>
                	<View style={styles.cellItemList}>
                		<Text>日限额: </Text>
                		<Button type="primary" size='small'>51</Button>
                		<Text style={{paddingLeft: '30rem'}}>出价: </Text>
                		<Button type="primary" size='small'>0.65</Button>
                		<View style={{marginLeft: '30rem'}}><Button type="primary" size='small'>推广报表</Button></View>
                	</View>
                	<View style={styles.cellItemList}>
                		<View style={{flex:8}}><Input style={{width: '400rem', height: '60rem'}}/></View>
                		<Text style={{flex: 4}}>当前推广中0件</Text>
                	</View>
                	
                </View>
            )
    }
}

const styles={
  cellItemList:{
        backgroundColor:"#fff",
        height:"90rem",
        borderBottomWidth:"2rem",
        borderBottomStyle:"solid",
        borderBottomColor:"#e8e8e8",
        paddingLeft:"30rem",
        alignItems:"center",
        flexDirection:"row",
        display:'flex' 
    },
    title: {
	    color: '#0894EC',
	   	fontSize: '30rem',
	   }
}

mount(<Drainage />, 'body');

export default Drainage