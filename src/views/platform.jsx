'use strict';
import {mount} from 'nuke-mounter';
import {createElement, Component} from 'weex-rx';
import { View, Text, Image, TouchableHighlight} from 'nuke-components';
import { Tabbar, Button, Icon, ListView, Iconfont, Modal, ScrollView, Switch, Dimensions, Input, Dialog } from 'nuke';
import QN from 'QAP-SDK';
import { getPlatfrom, getSellerUser } from '../api'
import _ from 'lodash';
let {height} = Dimensions.get('window');
class PlatformView extends Component {
    constructor(props) {
      super(props);
      this.state={
      	datas: {},
      	sellerSatus: false,
      	outTaoSwitch: false
      }
    }
    componentDidMount(){
    	var URL= document.URL;
    	var arr= URL.split('?')[1];
		var newarr= arr.split('&');
		var obj={}
		var param;
        for(var i=0;i<newarr.length;i++){
            param=newarr[i].split('=');
            obj[param[0]]=param[1];
        }
        var itemId=obj.id;
		getPlatfrom(itemId).then((res) => {
			Modal.alert(JSON.stringify(res))
			this.setState({
				datas: res
			})
			 res.insitePC = res.outsitePC =  res.outsiteMO = res.insiteMO = res.outsiteNosearchPC = res.insiteNosearchPC = '';
			 if(res.search_channels.number)
                {
	                res.insitePC =  _.indexOf(res.search_channels.number,1) >= 0 ? true: false;
	                res.outsitePC = _.intersection(res.search_channels.number,[2,4]).length >0 ? true: false;
	                res.outsiteMO = _.indexOf(res.search_channels.number,16) >=0 ? true : false;
	                res.insiteMO = _.indexOf(res.search_channels.number,8) >=0 ? true : false;
                }
            if(res.nonsearch_channels.number)
                {
                    res.outsiteNosearchPC = _.intersection(res.nonsearch_channels.number,[2,4]).length >0 ? true : false;
                    res.insiteNosearchPC = _.indexOf(res.nonsearch_channels.number,1) >=0 ? true : false;
                }
                getSellerUser ().then((res) => {
                	if (res.seller_credit.level >5 || res.type === 'B') {
                		this.setState({
                			sellerSatus: true
                		})
                	}
                })
                // 
               
        }, (error) => {
            Modal.alert(JSON.stringify(error));

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
  		
  		
  		return (
  		  <Dialog contentStyle={styles.modalStyle} ref="modal" contentStyle={styles.modalStyle} visible={true}>
	           <ScrollView style={styles.scroller} onEndReachedThreshold={300}>
	              <Text style={styles.title}>计算机设备</Text>                              
	              <Text style={styles.contitle}>淘宝站内</Text>
	              {
	              	this.state.sellerSatus === true ? 
	              			<View style={styles.cellItemList}>
			              		<Text>搜索推广: </Text>
			              		<Text style={styles.commonStyle}>不投放 </Text>
			              		<Switch checked={insitePC}/>
				                <Text>投放 </Text>
	             			</View> : 
		             		<View style={styles.cellItemList}>
		             			<Text>投放</Text>
		             			
		             		</View>
	              }
	              
	              {
	              	this.state.sellerSatus === true ?  <View style={styles.cellItemList}>
	              		<Text>定向推广: </Text>
	              		<Text style={styles.commonStyle}>不投放 </Text>
	              		<Switch checked={insiteNosearchPC}/>
	              		<Text>投放 </Text>
	              </View> : ''
	              }
	              <Text style={styles.contitle}>淘宝站外</Text>
	              <View style={styles.cellItemList}>
	              		<Text>搜索推广: </Text>
	              		<Text style={styles.commonStyle}>不投放 </Text>
	              		<Switch checked={outsitePC}/>
	              		<Text>投放 </Text>
	              </View>
	              {
	              	this.state.sellerSatus === true ? <View style={styles.cellItemList}>
	              		<Text>定向推广: </Text>
	              		<Text style={styles.commonStyle}>不投放 </Text>
	              		{
	              			outsiteNosearchPC && insiteNosearchPC ? <Switch 
										checked={true}/> : <Switch 
										checked={false}/>
	              		}
	              		
	              		<Text>投放 </Text>
	              </View> :''
	              }
	               
	              <View style={styles.cellItemList}>
	              	投放价格 = 淘宝站内投放价格 * 站外折扣
	              </View>
	              <View style={styles.cellItemList}>
	              	<Text>站外折扣:</Text>
	              	<Input value={outside_discount} style={styles.commonStyle}/>
	              	<Text>%</Text>
	              	<Text style={{fontSize: '26rem', color: 'red',paddingLeft: '30rem'}}>折扣1-200之间的整数</Text>
	              </View>
	               <Text style={styles.title}>移动设备</Text>                              
	              <Text style={styles.contitle}>淘宝站内</Text>
	              <View style={styles.cellItemList}>
	              		<Text>推广: </Text>
	              		<Text style={styles.commonStyle}>不投放 </Text>
	              		<Switch checked={insiteMO}/>
	              		<Text>投放 </Text>
	              </View>
	               <View style={styles.cellItemList}>
	              	投放价格 = 计算机淘宝站内投放价格 * 移动折扣
	              </View>
	              <Text style={styles.contitle}>淘宝站外</Text>
	               <View style={styles.cellItemList}>
	              		<Text>推广: </Text>
	              		<Text style={styles.commonStyle}>不投放 </Text>
	              		<Switch checked={outsiteMO}/>
	              		<Text>投放 </Text>
	              </View>
	              <View style={styles.cellItemList}>
	              	投放价格 = 计算机淘宝站内投放价格 * 移动折扣
	              </View>
	              <View style={styles.cellItemList}>
	              	<Text>移动折扣:</Text>
	              	<Input value={mobile_discount} style={[styles.commonStyle,{width: '100rem'}]}/>
	              	<Text>%</Text>
	              	<Text style={{fontSize: '26rem', color: 'red',paddingLeft: '30rem'}}>折扣1-200之间的整数</Text>
	              </View>
	            </ScrollView>
	            <View style={styles.footer}>
                    <TouchableHighlight style={[styles.button,{backgroundColor: '#db1c1c'}]}>
                        <Text style={{color: '#fff'}}>取消</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={[styles.button,{marginLeft: '20rem', backgroundColor: '#348d33'}]}>
                        <Text style={{color: '#fff'}}>确定</Text>
                    </TouchableHighlight>
                </View>
            </Dialog>
 		  );
    }
}

const styles = {
	scroller:{
	      width: 750,
	      height: 500
	   },
	commonStyle:{
		paddingLeft: '30rem'
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
        padding: '20rem',
        borderBottomWidth:"2rem",
        borderBottomStyle:"solid",
        borderBottomColor:"#e8e8e8",
       	alignItems:"center",
        flexDirection:"row",
        display: 'flex'
    },
    footer: {
	    alignItems: 'center',
	    justifyContent: 'center',
	    height: '120rem',
	    flexDirection:"row",
		display:'flex'
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
  }
};

mount(<PlatformView />, 'body');


export default PlatformView
