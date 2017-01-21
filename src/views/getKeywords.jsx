'use strict';
import {mount} from 'nuke-mounter';
import {createElement, Component} from 'weex-rx';
import {View, Text, Link, Grid, Col, Image, Modal, TouchableHighlight, Navigator, Button, ScrollView, ListView, Dimensions, Checkbox} from 'nuke';
import { getAuthSign, getallKeywords, deleteKeywords } from '../api'
import QN from 'QAP-SDK';
import _ from 'lodash';
let {height} = Dimensions.get('window');
class GetKeywordsView extends Component {
	constructor() {
		super()
		this.state={
			subway_token: '',
			keyWordsData: [],
			dataobj: {},
			keyId: [],
			keyobj: {}
		}
	} 
	componentDidMount () {
		var URL= document.URL;
		let obj= QN.uri.parseQueryString(URL.split('?')[1]);
        this.setState({
        	dataobj: obj
        })
        var adgroup_id= this.state.dataobj.adgroup_id;
	    var campaign_id= this.state.dataobj.campaign_id;
	     getAuthSign().then((result) => {
	      	this.setState({
	                  subway_token: result
	             })
	          getallKeywords(this.state.subway_token, adgroup_id, campaign_id).then((result) => {
	            var keyobj={};
				var keyId=[]
				for (var i=0; i< result.length; i++) {
					keyobj[i] = result[i];
					keyobj[i]['checked'] = false;
					keyId.push(i);
				}
	            this.setState({
	            	keyobj: keyobj,
	            	keyId: keyId
	            })
	            
		       }, (error) => {
		                Modal.alert(JSON.stringify(error));
		
		            });  
	         }, (error) => {
	              Modal.alert(JSON.stringify(error));
	
	          });  
        
	}
	showkeywordslist (adgroup_id) {
		Navigator.push('qap://views/keywordslist.js?adgroup_id='+adgroup_id);
	}
	itemCheck (item, value) {
		let changeItem = Object.assign({}, this.state.keyobj[item], {checked: value})
		let newKeywords = Object.assign({},this.state.keyobj, {[item]: changeItem});
		this.setState({
			keyobj: newKeywords
		})
		Modal.alert(JSON.stringify(this.state.keyobj))
	}
    delkeywords () {
		var keyword_ids=[];
		var keyobj= this.state.keyobj;
		var campaign_id= this.state.dataobj.campaign_id;
		var keyId= this.state.keyId;
		var newkeyid= [];
		for (var i=0; i<keyId.length; i++) {
			if(keyobj[i].checked == true) {
				idx= i;
				keyword_ids.push(keyobj[i].keyword_id);
			} 
		}
//		var evens = _.remove(keyId, function(n) {
//		  return n.checked == true;
//		});
//		this.setState({
//			keyId: newkeyid
//		})
		deleteKeywords(campaign_id, keyword_ids).then((result) => {
	 		Modal.alert(JSON.stringify(result))
	 		
            }, (error) => {
                Modal.alert(JSON.stringify(error));

            });
	}
	highPrice () {
		Modal.prompt('请填写价格',[ 
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
	render () {
		var adgroup_id= this.state.dataobj.adgroup_id;
		var title= this.state.dataobj.name;
		var imgage= this.state.dataobj.imgage;
		var online_status= this.state.dataobj.online_status;
		var itemStatus= online_status == 'online' ? '推广中' : '暂停中';
		var keyWordsData= this.state.keyId.length=== 0 ? '' : this.state.keyId;
		var keyobj= this.state.keyobj == null ? '' : this.state.keyobj
		return (
			<View>
			     <View style={styles.cellItemList}>
			     	<Image source={{uri: imgage}} style={{width:'180rem',height:'180rem'}}/>
            		<View style={styles.itemTextList}>
            			<Text style={{fontSize: '30rem', paddingBottom: '15rem', width: '600rem'}}>{title}</Text>
            			<View style={{ flexDirection:"row",display: 'flex'}}>
            				<Text style={{color: '#3089dc'}}>
            					状态: {itemStatus}
            				</Text>
            				<Text style={{paddingLeft: '40rem',paddingBottom: '20rem', color: 'red'}}>已添加关键词: {keyWordsData.length} 个</Text>
                		</View>
            			<View style={{flexDirection:'row', marginTop: '10rem', marginLeft: '10rem'}}>
	        				<Button size='small'  onPress={this.showkeywordslist.bind(this, adgroup_id)} type="secondary">
	        				添加
	        				</Button>
	        				<Button size='small' type="secondary" onPress={this.highPrice.bind(this)}>
	        				提价
	        				</Button>
	            			<Button size='small' type="secondary">降价</Button>
	            			<Button size='small' type="secondary" onPress={this.delkeywords.bind(this)}>删除</Button>
        			</View>
        			</View>
			     </View>
			     <ScrollView style={styles.scroller} onEndReachedThreshold={300}>
			        <View style={styles.cellItemList}>
			        	<Text style={styles.arrow}></Text>
			            <Text style={styles.arrow}>关键词</Text>
			        	<Text style={styles.arrow}>出价</Text>
			        	<Text style={styles.arrow}>展现</Text>
			        	<Text style={styles.arrow}>点击</Text>
			        	<Text style={styles.arrow}>成交</Text>
			        	<Text style={styles.arrow}>质量分</Text>
			        </View>
			        { this.state.keyId.length == 0 ? <Text>您还没有添加关键词</Text> : this.state.keyId.map((item, index) =>{
			        	  return (
			        			<View style={styles.cellItemList}>
			        			    <Checkbox onChange={this.itemCheck.bind(this, item)}/>
									<Text style={styles.arrows}>{keyobj[item].word}</Text>
									<Text style={styles.arrows}>{keyobj[item].max_price/100}</Text>
									<Text style={styles.arrows}>{ keyobj[item].impressions}</Text>
									<Text style={styles.arrows}>{keyobj[item].click}</Text>
									<Text style={styles.arrows}>{keyobj[item].paycount}</Text>
									<Text style={styles.arrows}>{keyobj[item].qscore}</Text>
								</View>
			        		)
			        	})
			        	
			        }
			     </ScrollView>
			</View>
		)
	}
}

const styles={
	scroller:{
	      width: 750,
	      height: height-300,
	      flex: 1
	   },
	listContainer: {
		heigth: height-300
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
   arrows: {
  	width: '120rem'
  	
  },
  arrow: {
  	flex: 3
  	
  }
}

mount(<GetKeywordsView />, 'body');


