import {Button,ListView, Modal, Input, Dimensions, Dialog } from 'nuke';
import {mount} from 'nuke-mounter';
import {createElement, Component} from 'weex-rx';
import QN from 'QAP-SDK';
import { View, Text, TouchableHighlight,ScrollView,Image } from 'nuke-components';
import { checkIssetDspUser, getDspUserInfo, getDspUserMarket, getOnsaleItem, setItemsOffline, setItemsOnline, setBudget, setCpc, getAuthSign } from '../api';
import _ from 'lodash';
import { showLoading,hideLoading } from './util';
let {height} = Dimensions.get('window');
import { getRechargeTempalte } from '../api/dsp';
import { report, help, save, data } from '../static/static';
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
                RechargeData: [],
                real_text: '',
                luckily_text_1: '',
                subway_token: ''
        } 
        showLoading();   
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
                getRechargeTempalte(this.state.user_id).then((res) => {
                    this.setState({
                        RechargeData: res.data.data.moneys,
                        real_text: res.data.data.real_text,
                        luckily_text_1: res.data.data.luckily_text_1
                    })
                    
                })

            }  
        });
        getAuthSign().then((result) => {
                this.setState({subway_token: result})

            }, (error) => {
                Modal.alert(JSON.stringify(error));

            });
    }
    getUserInfo(){
        //其实就是检测了手机号
        getDspUserInfo(this.state.user_id).then((res) => {
                if(res && res.id && !res.telephone){
                    this.setState({showPhone:true});//todo需要弹出填写手机号
                 }
                if(this.state.showPhone === true) {
                     Modal.prompt('请绑定手机号码',[ 
                    {
                        onPress:(result)=>{
                            var data = result.data *1;
                            if(!(/^1[34578]\d{9}$/.test(data))){ 
                               Modal.alert("手机号码有误，请重填");  
                             } else {
                                getDspUserInfo(this.state.user_id, data).then((res) => {
                                    
                                })
                             }
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
            hideLoading();
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
            });
        })
    }
    listStatus (item) {

        checkIssetDspUser().then((value) => {
            if(value && value.user_id != undefined){
                this.setState({
                    user_id:value.user_id
                  })
            }
            var itemevent =[];
            var newstatus= item.dsp_onLineStatus ==1 ? 0 : 1;
            itemevent.push(item.num_iid)
            var index= _.findIndex(this.state.Items,function(v){
                        return v.num_iid == item.num_iid ;
                        
                })
            if(item.dsp_onLineStatus == 1) {
                setItemsOffline(this.state.user_id, itemevent).then((res) => {
                    this.state.Items[index].dsp_onLineStatus= newstatus;
                    var aa =this.state.Items;
                    this.setState({
                        Items:　aa
                    })
    
    
                }, (error) => {
                    Modal.alert(JSON.stringify(error));
                });
            } else {
                var obj={
                         item_id:item.num_iid,
                         cid:item.cid,
                         title:item.title,
                         price:item.price,
                         img_url:item.pic_url,
                         props:item.props,
                         url:'https://item.taobao.com/item.htm?id='+item.num_iid
                }
                var newArr=[];
                newArr.push(obj)

                setItemsOnline(this.state.user_id, newArr).then((res) => {
                     if(res.status !== undefined && res.status === 'ok'){
                        this.state.Items[index].dsp_onLineStatus= newstatus;
                        var aa =this.state.Items;
                        this.setState({
                            Items:　aa
                        })
                         Modal.toast('设置推广成功');
                    }else{
                        if(res.error){
                            Modal.toast('没有足够的余额推广');
                        }
                    }
                    

            }, (error) => {
                Modal.alert(JSON.stringify(error));
            });
            }
        }, (error) => {
            Modal.alert(JSON.stringify(error));

        });
    }
    renderItem (item, index) {
        var dsp_onLineStatus = item.dsp_onLineStatus;
        var newdsp_onLineStatus = item.dsp_onLineStatus ==0 ? '未推广' : '推广中'
         return (<View>
                    <View style={styles.cellItemList}>
                        <View style={{flex:'100rem'}}>
                           <Image source={{uri: item.pic_url}} style={{width:'180rem',height:'180rem'}}/> 
                        </View>
                        
                        <View>
                            <Text style={{width: '500rem',paddingLeft: '20rem',fontSize:'32rem'}}>{item.title}</Text>
                            <View style={styles.col1}>
                                <Text style={styles.textSize}>单价: {item.price}</Text>
                                <Text style={{paddingLeft: '30rem',fontSize:'32rem'}}>库存: {item.num}</Text>
                            </View>
                            <View style={[styles.col1, {marginTop: '10rem', marginLeft: '260rem'}]}> 
                                <Button style={{fontSize:'32rem'}} type="secondary" onPress={this.listStatus.bind(this, item)} size='small'>{newdsp_onLineStatus}</Button>
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
                            checkIssetDspUser().then((value) => {
                                if(value && value.user_id != undefined){
                                    this.setState({
                                        user_id:value.user_id
                                      })
                                   }
                                setBudget(this.state.user_id, data).then((res) => {
                                    var newbudget= res.budget;
                                    this.setState({
                                        budget: newbudget
                                    })
                                }, (error) => {
                                    Modal.alert(JSON.stringify(error));
                        
                                });
                            })
                            
                        },
                        text:"确认"
                    },
                    {
                        onPress:()=>{console.log('点击了取消')},
                        text:"取消"
                    }
                ]);
    }
    changecpc () {
        Modal.prompt('修改出价',[ 
                    {
                        onPress:(result)=>{
                            var data = result.data *1;
                            checkIssetDspUser().then((value) => {
                                if(value && value.user_id != undefined){
                                    this.setState({
                                        user_id:value.user_id
                                      })
                                   }
                                setCpc(this.state.user_id, data).then((res) => {
                                    var newcpc= res.cpc;
                                    this.setState({
                                        cpc: newcpc
                                    })
                                }, (error) => {
                                    Modal.alert(JSON.stringify(error));
                        
                                });
                            })
                            
                        },
                        text:"确认"
                    },
                    {
                        onPress:()=>{console.log('点击了取消')},
                        text:"取消"
                    }
                ]);
    }
   drainageRpt(){

       QN.navigator.push({
            url:'qap://views/drainageRpt.js',
            query:{user_id:this.state.user_id,account_id:this.state.account_id},
            settings: {
                    animate: true
             }
        })
   }
   showHandbook(){
        
       QN.navigator.push({
            url:'qap://views/handbook.js',
            settings: {
                    animate: true
             }
        })
   }
   linkrecharge(){
        QN.navigator.push({
            url:'qap://views/recharge.js',
            query:{user_id:this.state.user_id,account_id:this.state.account_id},
            settings: {
                    animate: true
             }
        })
   }
    dspcontrast () {
    		QN.navigator.push({
             url:'qap://views/dspcontrast.js',
             query:{subway_token: this.state.subway_token, user_id: this.state.user_id},
             settings: {
                     animate: true
              }
         })
    }
    render(){
        return (
                <View>
                    <View style={styles.titleItemList}>
                        <Text style={[styles.textSize, {flex: 11, paddingLeft: '30rem'}]}>淘外余额: </Text>
                        <Text style={[styles.textSize, {flex: 4}]}>￥  {this.state.balance} </Text>
                    </View>
                    <View style={styles.cellItemList}>
                        <Text style={styles.textSize}>日限额: </Text>
                        <Button style={styles.textSize} type="primary" size='small' onPress={this.changebudget.bind(this)}>{this.state.budget}</Button>
                        <Text style={{fontSize:'32rem'}}>出价: </Text>
                        <Button style={styles.textSize} type="primary" size='small' onPress={this.changecpc.bind(this)}>{this.state.cpc}</Button>
                       
                    </View>
                    <View style={styles.cellItemList}>
                    	<TouchableHighlight onPress={this.linkrecharge.bind(this)} style={styles.flexbox}>
                    		   <Image source={{uri: save}} style={styles.imgStyle}/>
                    		<Text style={{fontSize: '30rem',textAlign:'center'}}>充 值</Text>
                    	</TouchableHighlight>
                    	<TouchableHighlight onPress={this.showHandbook.bind(this)} style={styles.flexbox}>
                    		<Image source={{uri: help}} style={styles.imgStyle}/>
                    		<Text style={{fontSize: '30rem',textAlign:'center'}}>帮 助</Text>
                    	</TouchableHighlight>
                    	<TouchableHighlight onPress={this.drainageRpt.bind(this)} style={styles.flexbox}>
                    		<Image source={{uri: report}} style={styles.imgStyle}/>
                    		<Text style={{fontSize: '30rem',textAlign:'center'}}>报 表</Text>
                    	</TouchableHighlight>
                    	<TouchableHighlight onPress={this.dspcontrast.bind(this)} style={styles.flexbox}>
                    		<Image source={{uri: data}} style={styles.imgStyle}/>
                    		<Text style={{fontSize: '30rem',textAlign:'center'}}>对 比</Text>
                    	</TouchableHighlight>
                    </View>
                    <ScrollView style={styles.scroller}>
                        {
                            this.state.Items.length == 0 
                            ? 
                            <View >
                               
                             </View>
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
          height: height-500,
          flex: 1
       },
   	listContainer: {
          flex:1,
          height: height-550,
    },
    titleItemList:{
        backgroundColor:"#fff",
        padding: '20rem',
        borderBottomWidth:"2rem",
        borderBottomStyle:"solid",
        borderBottomColor:"#e8e8e8",
       	alignItems:"center",
        flexDirection:"row",
        display:'flex'
    },
  	cellItemList:{
        backgroundColor:"#fff",
        padding: '20rem',
        borderBottomWidth:"2rem",
        borderBottomStyle:"solid",
        borderBottomColor:"#e8e8e8",
       	alignItems:"center",
        flexDirection:"row",
        display:'flex',
        justifyContent: 'space-around'
    },
    col1:{
        flexDirection:"row",
        display:'flex', 
        paddingTop: '10rem', 
        paddingLeft: '20rem'
    },
    title: {
        color: '#0894EC',
        fontSize: '32rem',
       },
    textSize:{
        fontSize:'32rem'
    },
     textCenter: {
        textAlign: 'center',
        marginTop: '100rem',
    },
    flexbox: {
    	
    	textAlign: 'center'
    },
    imgStyle: {
    	width:'50rem',
    	height:'50rem', 
    	marginBottom: '10rem',
    	textAlign: 'center',
        marginLeft:'10rem'
    }
}
export default Drainage