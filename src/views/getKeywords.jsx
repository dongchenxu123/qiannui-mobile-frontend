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
			keyobj: {},
            keywordList:[]
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
                    if(result.length > 0){
                        this.setState({keywordList:result});
                    }
		       }, (error) => {
		                Modal.toast(JSON.stringify(error));
		            });  
	         }, (error) => {
	              Modal.toast(JSON.stringify(error));
	          });  
        
	}
	showkeywordslist (adgroup_id) {
		Navigator.push('qap://views/keywordslist.js?adgroup_id='+adgroup_id);
	}
	itemCheck (item, value) {
      
        var index = _.findIndex( this.state.keywordList, function(o) { return o.word == item.word; });
        this.state.keywordList[index].checked = (value == true ? 1 : 0);
        let newkeyword = this.state.keywordList;
        this.setState({keywordList:newkeyword});	
	}
    delkeywords () {
	Modal.confirm('确定删除所选关键词吗？',[ 
        {
            onPress:()=>{
                var keyword_ids=[];
                var len = this.state.keywordList.length;

                this.state.keywordList.map((v,i)=>{
                    if(v.checked != undefined && v.checked == 1){
                        keyword_ids.push(v.keyword_id);
                    }
                });
              
            
                deleteKeywords(this.state.dataobj.campaign_id, keyword_ids).then((result) => {
                        var self = this;

                       if(result.length > 0){

                            Modal.toast('删除关键词成功');
                            var lastKeyword = [];
                            result.map((v,i)=>{
                                lastKeyword = _.remove(self.state.keywordList, function(n) {
                                      return n.keyword_id == v.keyword_id;
                                    });  
                            })
                            var  datas = self.state.keywordList;
                   
                            self.setState({keywordList:datas});                             
                        }
                    
                    }, (error) => {
                        Modal.alert(JSON.stringify(error));

                    });

            },
            text:"确定"
        },
        {
            onPress:()=>{

            },
            text:"取消"
        }
    ]);
        
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
		/*var keyobj= this.state.keyobj == null ? '' : this.state.keyobj*/
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
            				<Text style={{paddingLeft: '40rem',paddingBottom: '20rem', color: 'red'}}>已添加关键词: {this.state.keywordList.length} 个</Text>
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
			        { this.state.keywordList.length == 0 ? <Text>您还没有添加关键词</Text> : this.state.keywordList.map((item, index) =>{
			        	  return (
			        			<View style={styles.cellItemList}>
			        			    <Checkbox onChange={this.itemCheck.bind(this, item)} checked={(item.checked && item.checked) == 1 ? true : false}/>
									<Text style={styles.arrows}>{item.word}</Text>
									<Text style={styles.arrows}>{item.max_price/100}</Text>
									<Text style={styles.arrows}>{item.impressions}</Text>
									<Text style={styles.arrows}>{item.click}</Text>
									<Text style={styles.arrows}>{item.paycount}</Text>
									<Text style={styles.arrows}>{item.qscore}</Text>
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


