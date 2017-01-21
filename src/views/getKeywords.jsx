'use strict';
import {mount} from 'nuke-mounter';
import {createElement, Component} from 'weex-rx';
import {View, Text,Input,TextInput,Image, Modal, Dialog, TouchableHighlight, Navigator, Button, ScrollView, ListView, Dimensions, Checkbox} from 'nuke';
import { getAuthSign, getallKeywords, deleteKeywords } from '../api'
import QN from 'QAP-SDK';
import _ from 'lodash';
let {height} = Dimensions.get('window');
class GetKeywordsView extends Component {
	constructor() {
		super()
		this.state={
			subway_token: '',
			dataobj: {},
            keywordList:[],
		}

        this.keywordPrice = 0;
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
	changePrice () {

         this.refs.modal.show();
		/*Modal.prompt('请填写关键词出价',[ 
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
 		]);*/
	}
    hideModal(){
          this.refs.modal.hide();
    }
    checkPrice(){
        var price = this.keywordPrice;
        var re =/^\d+(\.\d+)?$/;  

        if(price * 100  <5   || price * 100  > 10000)
           {
                Modal.toast('填写价格需要在0.05元 - 100元之间');
                return;
            }

         if(!re.test(price)) {
             Modal.toast('关键词价格必须是正数');
            return;
        }   

        return price;
    }
    submitPrice(){
        var price = this.checkPrice();
        if(price){
              Modal.alert('修改出价成功');
        }
      
    }
	render () {
		var adgroup_id= this.state.dataobj.adgroup_id;
		var title= this.state.dataobj.name;
		var imgage= this.state.dataobj.imgage;
		var online_status= this.state.dataobj.online_status;
		var itemStatus= online_status == 'online' ? '推广中' : '暂停中';
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
	        				<Button size='small' type="secondary" onPress={this.changePrice.bind(this)}>
	        				调价
	        				</Button>
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

                 <Dialog ref="modal" contentStyle={styles.modalStyle} onShow={this.onShow} onHide={this.onHide}>
                   <View>
                       <Text style={{padding:'20rem'}}>修改关键词出价</Text>
                   </View>
                    <View style={styles.body}>
                        <Input keyboardType="numbers-and-punctuation"  onBlur={(value)=>{this.keywordPrice =  value.target.attr.value;}}/>   
                    </View>
                    <View style={styles.footer}>
                        <Button type='secondary' size="small" style={{paddingLeft:'20rem'}} onPress={this.hideModal.bind(this)}> 取消</Button>
                        <Button type='secondary' size="small" style={{paddingRight:'20rem'}} onPress={this.submitPrice.bind(this,value)}> 确定</Button>
                    </View>
                </Dialog>
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
  	
  },

  wrapper: {
    height: height,
    paddingLeft: '24rem',
    paddingRight: '24rem',
    paddingTop: '24rem'
  },
  click: {
    height: '100rem',
    lineHeight: '100rem',
    textAlign: 'center',
    borderWidth: '1rem',
    borderStyle: 'solid',
    borderColor: '#ccc'
  },
  modalStyle: {
    width: '640rem',
    height: '340rem'
  },
  body: {
    padding:'20rem'
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
  
    alignItems:"center",
    flexDirection:"row",
    display: 'flex',
    margin:0
  },
  close: {
    borderWidth: '1rem',
    borderStyle: 'solid',
    borderColor: '#ccc',
    position: 'absolute',
    top: '-18rem',
    right: '-18rem',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40rem',
    height: '40rem',
    borderRadius: '20rem',
    backgroundColor: '#ffffff'
  },
  closeText: {
    fontSize: '28rem',
    color: '#000000'
  }
}

mount(<GetKeywordsView />, 'body');


