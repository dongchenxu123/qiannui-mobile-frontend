import {Button,ListView, Modal, Input, Dimensions} from 'nuke';
import {mount} from 'nuke-mounter';
import {createElement, Component} from 'weex-rx';
import QN from 'QAP-SDK';
import { View, Text, TouchableHighlight,ScrollView,Image } from 'nuke-components';
import { checkIssetDspUser, getDspUserInfo, getDspUserMarket, getOnsaleItem, setItemsOffline, setItemsOnline, setBudget } from '../api';
import _ from 'lodash';
let {height} = Dimensions.get('window');
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
                 }
                if(this.state.showPhone === true) {
                	 Modal.prompt('请填写手机号码',[ 
				    {
				        onPress:(result)=>{
				        	Modal.alert(JSON.stringify(result))
				            
				        },
				        text:"确认"
				    },
				    {
				        onPress:()=>{console.log('点击了取消')},
				        text:"取消"
				    }
		 		]);
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
            console.log(JSON.stringify(this.state.Items),32545435)
            });
        })
    }
    listStatus (dsp_onLineStatus) {
    	var items= [];
    	var ItemData= this.state.Items;
    	for (var i=0;i<ItemData.length; i++) {
    		if(ItemData[i].dsp_onLineStatus ==1) {
    			items.push(ItemData[i].num_iid)
    		}
    	}
    	Modal.alert(JSON.stringify(items))
    	setItemsOffline(items).then((res) => {
    		
            Modal.alert(JSON.stringify(res))
           	}, (error) => {
	            Modal.alert(JSON.stringify(error));
	
	        });
           
    }
    renderItem (item, index) {
    	var dsp_onLineStatus = item.dsp_onLineStatus;
    	var newdsp_onLineStatus = item.dsp_onLineStatus ==0 ? '未推广' : '推广中'
    	 return (<View>
    	 			<View style={styles.cellItemList}>
    	 				<Image source={{uri: item.pic_url}} style={{width:'180rem',height:'180rem'}}/>
	                	<View>
	                		<Text style={{width: '500rem',paddingLeft: '20rem'}}>{item.title}</Text>
	                		<View style={{flexDirection:"row",
        display:'flex', paddingTop: '20rem', paddingLeft: '20rem'}}>
	                			<Text>单价: {item.price}</Text>
	                			<Text style={{paddingLeft: '30rem'}}>库存: {item.num}</Text>
	                		</View>
	                		<View style={{marginTop: '20rem',flexDirection:"row",
        display:'flex'}}>
	                		    <Text style={{flex: 11}}></Text>
	                			<Button style={{flex: 4}} type="secondary" onPress={this.listStatus.bind(this, dsp_onLineStatus)} size='small'>{newdsp_onLineStatus}</Button>
	                		</View>
	                	</View>
	                </View>
    	 		</View>);

    }
    changebudget () {
    	Modal.prompt('修改日限额',[ 
				    {
				        onPress:(result)=>{
				        	var data = result.data *1;
				        	Modal.alert(JSON.stringify(data))
				            setBudget(data).then((res) => {
    							Modal.alert(JSON.stringify(res))
					           	}, (error) => {
						            Modal.alert(JSON.stringify(error));
						
						        });
				        },
				        text:"确认"
				    },
				    {
				        onPress:()=>{console.log('点击了取消')},
				        text:"取消"
				    }
		 		]);
    }
	render(){
        return (
                <View>
                	<View style={styles.cellItemList}>
                		<Text>淘外余额: {this.state.balance}</Text>
                		<View style={{marginLeft: '60rem'}}>
                			<Button type="primary" size='small' >充值</Button>
                		</View>
                		<TouchableHighlight style={{marginLeft: '60rem'}}>
                			<Text style={styles.title}> ? 帮助</Text>
                		</TouchableHighlight>
                	</View>
                	<View style={styles.cellItemList}>
                		<Text>日限额: </Text>
                		<Button type="primary" size='small' onPress={this.changebudget.bind(this)}>{this.state.budget}</Button>
                		<Text style={{paddingLeft: '30rem'}}>出价: </Text>
                		<Button type="primary" size='small'>{this.state.cpc}</Button>
                		<View style={{marginLeft: '30rem'}}><Button type="primary" size='small'>推广报表</Button></View>
                	</View>
                	<View style={styles.cellItemList}>
                		<View style={{flex:8}}><Input style={{width: '400rem', height: '60rem'}}/></View>
                		<Text style={{flex: 4}}>当前推广中0件</Text>
                	</View>
                	<ScrollView style={styles.scroller}>
                		{
                			this.state.Items.length == 0 
                			? <Text>Loading...</Text>
                			: <ListView 
                				renderRow={this.renderItem.bind(this)}
            				  	dataSource={this.state.Items}
            				  	style={styles.listContainer}/>
                		}
                	</ScrollView>
                </View>
            )
    }
}

const styles={
  scroller:{
	      width: 750,
	      height: height-450,
	      flex: 1
	   },
   listContainer: {
		height: height-450
	},
  cellItemList:{
        backgroundColor:"#fff",
        padding: '20rem',
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