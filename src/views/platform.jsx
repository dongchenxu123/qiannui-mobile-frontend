'use strict';
import {mount} from 'nuke-mounter';
import {createElement, Component} from 'weex-rx';
import { View, Text, TouchableHighlight} from 'nuke-components';
import { Button, ListView, Modal, ScrollView, Switch, Dimensions, Input,TextInput,Dialog } from 'nuke';
import QN from 'QAP-SDK';
import { getPlatfrom, getSellerUser,setPlatfrom,getStoreKeyword } from '../api'
import _ from 'lodash';

let {height} = Dimensions.get('window');

let URL= document.URL;
let arr= QN.uri.parseQueryString(URL.split('?')[1]);
const campaign_id = arr.campaign_id;

class PlatformView extends Component {
    constructor(props) {
      super(props);
      this.state={
      	datas: {},
      	sellerSatus: false
      }
    }
    componentDidMount(){

		  getPlatfrom(campaign_id).then((res) => {
  			  res.insitePC = res.outsitePC =  res.outsiteMO = res.insiteMO = res.outsiteNosearchPC = res.insiteNosearchPC = '';
  			  if(res.search_channels.number){
  	                res.insitePC =  _.indexOf(res.search_channels.number,1) >= 0 ? true: false;
  	                res.outsitePC = _.intersection(res.search_channels.number,[2,4]).length >0 ? true: false;
  	                res.outsiteMO = _.indexOf(res.search_channels.number,16) >=0 ? true : false;
  	                res.insiteMO = _.indexOf(res.search_channels.number,8) >=0 ? true : false;
           }
          if(res.nonsearch_channels.number){
                  res.outsiteNosearchPC = _.intersection(res.nonsearch_channels.number,[2,4]).length >0 ? true : false;
                  res.insiteNosearchPC = _.indexOf(res.nonsearch_channels.number,1) >=0 ? true : false;
          }

          this.setState({
            datas: res
          });

          getSellerUser ().then((res) => {
          	if (res.seller_credit.level >5 || res.type === 'B') {
          		this.setState({
          			sellerSatus: true
          		})
          	}
          });      
        }, (error) => {
            Modal.alert(JSON.stringify(error));
        });
	}
    submitData(){
        var search_channels = [1];
        var nonsearch_channels = [];

        if(this.state.sellerSatus){
            //pc站内搜索
            if(!this.state.datas.insitePC){
                search_channels.shift();
            }
            //pc站内定向
            if(this.state.datas.insiteNosearchPC) {
                 nonsearch_channels.push(1);
            }
             //pc站外定向
            if(this.state.datas.outsiteNosearchPC){
                nonsearch_channels.push(2);
            }
        }
       
        if(this.state.datas.outsitePC){
            search_channels.push(2);
            search_channels.push(4);
        }

        if(this.state.datas.insiteMO){
            search_channels.push(8);

            if(this.state.sellerSatus){
                nonsearch_channels.push(8);
            }
        }

         if(this.state.datas.outsiteMO){
            search_channels.push(16);
            if(this.state.sellerSatus){
                nonsearch_channels.push(16);
            }
        }

        var outside_discount = this.state.datas.outside_discount;
        var mobile_discount = this.state.datas.mobile_discount;

        //更新平台设置
        if((outside_discount > 0  && outside_discount <=200) && (mobile_discount >0 && mobile_discount <= 200)){
            var param = {
                'campaign_id':campaign_id,
                'search_channels':search_channels,
                'nonsearch_channels':nonsearch_channels,
                'outside_discount':outside_discount,
                'mobile_discount':mobile_discount
            };
  
            setPlatfrom(param).then((res) => {
          
                if(res.campaign_id && res.campaign_id == campaign_id){
                    Modal.toast('设置投放平台成功');
                    QN.navigator.push({
					    url: 'qap://views/campaignsList.js',
					   	settings: {
					        animate: true
					       
					    } 
					});
                }else{
                  Modal.alert('参数错误');
                }
            },error=>{
                Modal.toast(error);
            });
         }
    }
    changeValue(value,type){
      
        switch(type){
            case "mobile_discount":
                this.state.datas.mobile_discount = value;
                break;
            case "outside_discount": 
                this.state.datas.outside_discount = value;
                break;
            case "insitePC":
                this.state.datas.insitePC = value;  
                break;
            case "insiteNosearchPC":
                this.state.datas.insiteNosearchPC = value; 
                break;
            case "outsitePC":
                this.state.datas.outsitePC = value; 
                break;
            case "outsiteNosearchPC":
                this.state.datas.outsiteNosearchPC = value; 
                break;
            case "insiteMO":
                this.state.datas.insiteMO = value; 
                break;
            case "outsiteMO":
                this.state.datas.outsiteMO = value; 
                break;
        }
         var aa = this.state.datas;
                this.setState({
                    datas: aa
                });
    }

    render() {
  		var mobile_discount= this.state.datas == null ? '' : this.state.datas.mobile_discount;
  		var outside_discount= this.state.datas == null ? '' : this.state.datas.outside_discount;
  		var outsitePC= this.state.datas == null ? '' : this.state.datas.outsitePC
  		var insiteNosearchPC = this.state.datas== null ?　''　: this.state.datas.insiteNosearchPC;
  		var outsiteNosearchPC = this.state.datas == null ? '' : this.state.datas.outsiteNosearchPC;
  		var insitePC = this.state.datas == null ? '' : this.state.datas.insitePC;
  		var insiteMO = this.state.datas == null ? '' : this.state.datas.insiteMO;
  		var outsiteMO = this.state.datas == null ? '' : this.state.datas.outsiteMO;
  		var disabled = outsiteNosearchPC && insiteNosearchPC ? true:false;
  		return (
  		  <Dialog contentStyle={styles.modalStyle} ref="modal" contentStyle={styles.modalStyle} visible={true}>
	           <ScrollView style={styles.scroller} onEndReachedThreshold={300}>
	              <Text style={styles.title}>计算机设备</Text>                              
	              <Text style={styles.contitle}>淘宝站内</Text>
              		<View style={styles.cellItemList}>
		              		<Text style={{fontSize:'30rem'}}>搜索推广: </Text>
                      {
                        this.state.sellerSatus === true ? 
                        <View>
  		              		  <Text style={styles.commonStyle}>不投放 </Text>
  		              		  <Switch style={{fontSize:'30rem'}} checked={insitePC} onValueChange={(value)=>this.changeValue(value,"insitePC")}/>
  			                  <Text style={{fontSize:'30rem'}}>投放 </Text>
                        </View>
                        :
                        <Text style={{fontSize:'30rem'}}>投放</Text>
                      }
             			</View>
	              
	              {
	              	this.state.sellerSatus === true ?  
                  <View style={styles.cellItemList}>
	              		<Text style={{fontSize:'30rem'}}>定向推广： </Text>
	              		<Text style={styles.commonStyle}>不投放 </Text>
	              		<Switch checked={insiteNosearchPC} onValueChange={(value)=>this.changeValue(value,"insiteNosearchPC")} />
	              		<Text style={{fontSize:'30rem'}}>投放 </Text>
	                 </View> : <Text></Text>
	              }
	              <Text style={styles.contitle}>淘宝站外</Text>
	              <View style={styles.cellItemList}>
	              		<Text style={{fontSize:'30rem'}}>搜索推广： </Text>
	              		<Text style={styles.commonStyle}>不投放 </Text>
	              		<Switch checked={outsitePC} onValueChange={(value)=>this.changeValue(value,"outsitePC")} />
	              		<Text style={{fontSize:'30rem'}}>投放 </Text>
	              </View>
	              {
	              	this.state.sellerSatus === true ? 
                  <View style={styles.cellItemList}>
	              		<Text style={{fontSize:'30rem'}}>定向推广： </Text>
	              		<Text style={styles.commonStyle}>不投放</Text>
	              		{
                            disabled == false ? <Switch checked={outsiteNosearchPC} onValueChange={(value)=>this.changeValue(value,"outsiteNosearchPC")}/>:
                            <Switch disabled='false' onValueChange={(value)=>this.changeValue(value,"outsiteNosearchPC")}/>
	              		}
	              		
	              		<Text style={{fontSize:'30rem'}}>投放 </Text>
	              </View> :<View></View>
	              }
	               
	              <View style={styles.cellItemList}>
	              	<Text style={{fontSize:'30rem'}}>投放价格 = 淘宝站内投放价格 * 站外折扣</Text>
	              </View>
	              <View style={styles.cellItemList}>
	              	<Text style={{fontSize:'30rem'}}>站外折扣：</Text>
                  <TextInput
                    value={outside_discount}
                    keyboardType='numeric'
                    onChange={(e)=>{this.changeValue(e.value,"outside_discount")}}
                    style={{
                        width: '120rem',
                        height:'80rem',
                        borderWidth: '1rem',
                        borderStyle:'solid',
                        borderColor:'#dddddd'
                    }}
                    />
	              	<Text style={{fontSize:'30rem'}}>%</Text>
	              	<Text style={{fontSize: '26rem', color: 'red',paddingLeft: '30rem'}}>折扣为1-200之间的整数</Text>
	              </View>

	            <Text style={styles.title}>移动设备</Text>  

	            <Text style={styles.contitle}>淘宝站内</Text>
	            <View style={styles.cellItemList}>
	              	<Text style={{fontSize:'30rem'}}>推广： </Text>
	              	<Text style={styles.commonStyle}>不投放 </Text>
	              	<Switch checked={insiteMO} onValueChange={(value)=>this.changeValue(value,"insiteMO")}/>
	              	<Text style={{fontSize:'30rem'}}>投放 </Text>
	            </View>

	            <View style={styles.cellItemList}>
                <Text style={{fontSize:'30rem'}}>投放价格 = 计算机淘宝站内投放价格 * 移动折扣</Text>
              </View>
	              <Text style={styles.contitle}>淘宝站外</Text>
	               <View style={styles.cellItemList}>
	              		<Text style={{fontSize:'30rem'}}>推广： </Text>
	              		<Text style={styles.commonStyle}>不投放 </Text>
	              		<Switch checked={outsiteMO} onValueChange={(value)=>this.changeValue(value,"outsiteMO")}/>
	              		<Text style={{fontSize:'30rem'}}>投放 </Text>
	              </View>
	              <View style={styles.cellItemList}>
	              	<Text style={{fontSize:'30rem'}}>
                    投放价格 = 计算机淘宝站内投放价格 * 移动折扣
                  </Text>
	              </View>
	              <View style={styles.cellItemList}>
	              	<Text style={{fontSize:'30rem'}}>移动折扣：</Text>
                  <TextInput
                    value={mobile_discount}
                    keyboardType='number-pad'
                    onChange={(e)=>{this.changeValue(e.value,"mobile_discount")}}
                    style={{
                        width: '120rem',
                        height:'80rem',
                        borderWidth: '1rem',
                        borderStyle:'solid',
                        borderColor:'#dddddd'
                    }}
                    />
	              	<Text style={{fontSize:'30rem'}}>%</Text>
	              	<Text style={{fontSize: '26rem', color: 'red',paddingLeft: '30rem'}}>折扣1-200之间的整数</Text>
	              </View>
	            </ScrollView>
	            <View style={{marginLeft:'20rem',marginRight:'20rem'}} >
                    <Button style={styles.btn}  onPress={this.submitData.bind(this)} block="true" type="secondary">保存设置</Button>
                </View>      
            </Dialog>
 		  )
    }
}

const styles = {
	scroller:{
	      width: 750,
	      height: 500
	   },
	commonStyle:{
		paddingLeft: '30rem',
    fontSize:'30rem'
	},
	modalStyle: {
	    width: 750,
	    height: height
  	},
    title: {
	   	padding:'30rem',
	   	color: '#3089dc',
	   	fontSize: '35rem',
	   	flex: 11
	   },
	contitle: {
	   	padding:'20rem',
	   	color: '#3089dc',
	   	fontSize: '35rem',
	   	flex: 11,
	   	backgroundColor: '#e8e8e8',
	   	color: '#000'
	   },  
	 cellItemList:{
        backgroundColor:"#ffffff",
        padding: '20rem 50rem',
        borderBottomWidth:"2rem",
        borderBottomStyle:"solid",
        borderBottomColor:"#e8e8e8",
       	alignItems:"center",
        flexDirection:"row",
        display: 'flex',
        marginLeft:'40rem'
    },
  button: {
  	    width: '300rem',
	    height: '80rem',
	    borderWidth: '1rem',
	    borderStyle: 'solid',
	    borderColor: '#ccc',
  	    alignItems: 'center',
	    justifyContent: 'center',
	    borderRadius: '8rem'
  },
   btn:{
       height:"80rem",
       marginBottom:'30rem'
    }
};

mount(<PlatformView />, 'body');


export default PlatformView
