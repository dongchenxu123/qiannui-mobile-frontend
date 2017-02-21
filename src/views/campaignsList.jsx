'use strict';
import {mount} from 'nuke-mounter';
import {createElement, Component} from 'weex-rx';
import {View, Text, Link, Image, Modal, ScrollView, Button, Navigator, TouchableHighlight } from 'nuke';
import QN from 'QAP-SDK';
import {getCampaign, getAuthSign, setBuget, getArea, setStatus} from '../api';
import _ from 'lodash';
import { showLoading,hideLoading } from './util';
import {more} from '../static/static';

class CampaignsListView extends Component {
	constructor() {
		super()
		this.state= {
			subway_token: '',
			campaignData: [],
			budget: '',
			budgetId: ''
		}
		showLoading();
	}
	componentDidMount(){
		getAuthSign().then((result) => {
			   this.setState({
                        subway_token: result
                    })
               getCampaign(this.state.subway_token).then((result) => {
               	hideLoading();
               	this.setState({
	                        campaignData: result
	                    });
             	}, (error) => {
	                Modal.alert(JSON.stringify(error));
					hideLoading();
	            });
            }, (error) => {
            	hideLoading();
                Modal.alert(JSON.stringify(error));
			});
			
	}
	prompt(id, is_smooth, itemcost){
		var is_smoothString = is_smooth.toString();
	 	Modal.prompt('修改日限额（修改后的日限额不得小于当日花费）',[ 
		    {
		        onPress:(result)=>{
		        	var data = result.data *1;
		        	setBuget(id, data, is_smoothString).then((resultData) => {
		        		if(data< 30) {
		        			Modal.alert('日限额不能低于30元');
		        		   return false
		        		} else if(data< itemcost) {
		        			Modal.alert('日限额不得小于当日花费');
		        			return false
		        		}
		              	this.setState({
		             	   		budget: resultData,
		             	   		budgetId: id
		             	   })
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
	onPress (tid) {
		QN.navigator.push({
			    url: 'qap://views/campaignsGroup.js',
			    query: { campaign_id: tid },
			    settings: {
			        animate: true,
			        request: true,
			    } 
			});
    }
	onPressSche (tid) {
		QN.navigator.push({
			    url: 'qap://views/schedule.js',
			    query: { campaign_id: tid },
			    settings: {
			        animate: true,
			        request: true,
			    } 
			});    
    }
	onPressPlat (tid) {
		QN.navigator.push({
		    url: 'qap://views/platform.js',
		    query: { campaign_id: tid },
		    settings: {
		        animate: true,
		        request: true,
		    } 
		});
    }
	onPressGetArea (tid) {
		QN.navigator.push({
			    url: 'qap://views/getAreaView.js',
			    query: { campaign_id: tid },
			    settings: {
			        animate: true,
			        request: true,
			    } 
			});
    }
	statusItem (tid, title, online_status) {
		var new_status= online_status== 'online'?  'offline' : 'online'
		setStatus(tid, title, new_status).then((res) => {
		 	var newStatus= res.online_status
   		    var index = _.findIndex( this.state.campaignData,function(v){
            return v.campaign_id == tid;
            });
            this.state.campaignData[index].online_status =  newStatus;
            var statusData = this.state.campaignData
           	this.setState({
   				campaignData: statusData	
   			}) 
   		}, (error) => {
            Modal.alert(JSON.stringify(error));
        });
	}
	render () {
		return (
			<ScrollView style={styles.scroller} onEndReachedThreshold={300}>
			   {
			   	this.state.campaignData.length === 0 ? " " : this.state.campaignData.map((item, index) =>{
			   		var tid= item.campaign_id;
			   		var is_smooth= item.is_smooth;
			   		var itemcost= item.cost;
			   		var online_status= item.online_status;
					var itemStatus= online_status == 'online' ? '推广中' : '暂停中';
					var title= item.title;
			   		return (
			   			<View key={index}>
			   			    <View>
				   			    <View style={styles.cellItemList}>
				   			    	<TouchableHighlight onPress={this.onPress.bind(this, tid)} style={styles.itemTextList}>
					   			    	<Text style={{color:"#0894EC",fontSize:'32rem'}}>{title}</Text>
				   			    	</TouchableHighlight>
				   			    	<View>
				   			    		<Button onPress={this.statusItem.bind(this, tid, title, online_status)} type="primary">
					   			    		{itemStatus}
					   			    	</Button>
				   			    	</View>
				   			    </View>
				   			    <View>
							   		<TouchableHighlight style={styles.setItemList} 	onPress={this.prompt.bind(this, tid, is_smooth, itemcost)}
							   			id={this.state.budgetId}>
			  		   	                  <Text style={styles.setitemTextList}>每日限额:</Text>
			  		   	                  <Text style={styles.setitemArrow}>￥{this.state.budget !== '' && this.state.budgetId === tid ? this.state.budget : item.budget}</Text>
			   						</TouchableHighlight>
			  		   	            <TouchableHighlight style={styles.setItemList} onPress={this.onPressPlat.bind(this, tid)}>
		  		   	                  <Text style={styles.setitemTextList}>投放平台</Text>
		  		   	                  <View style={styles.setmoreArrow}>
		  		   	                		<Image style={{width: '50rem', height: '50rem'}} source={{uri: more}} ></Image >
		  		   	                 </View>
		  		   	                </TouchableHighlight>
		  		   	                <TouchableHighlight style={styles.setItemList} onPress={this.onPressGetArea.bind(this, tid)}>
		  		   	                	<Text style={styles.setitemTextList}>投放地域</Text>
		  		   	                	<View style={styles.setmoreArrow}>
		  		   	                		<Image style={{width: '50rem', height: '50rem'}} source={{uri: more}} ></Image >
		  		   	                	</View>
		  		   	                </TouchableHighlight>
		  		   	                <TouchableHighlight style={styles.setItemList} onPress={this.onPressSche.bind(this, tid)}>
		  		   	                	<Text style={styles.setitemTextList}>投放时段</Text>
		  		   	                	<View style={styles.setmoreArrow}>
		  		   	                		<Image style={{width: '50rem', height: '50rem'}} source={{uri: more}} ></Image >
		  		   	                	</View>
		  		   	                	 
		  		   	                </TouchableHighlight>
			  		   	        </View>
			                </View>

			                <View style={styles.report}>
			                	<View style={styles.amoutList}>
		                			<View style={styles.dayArrow}>
		  		   	                	<Text style={styles.setFontSize}>花费:</Text>
		  		   	                </View>
		  		   	                <View style={{left:'-120rem'}} >
		  		   	                   <Text style={styles.setFontSize}>{item.cost}</Text>
		  		   	                </View>

		  		   	                <View style={[styles.itemArrow,{left:'10rem'}]}>
			  		   	                <Text style={styles.setFontSize}>展现量:</Text>
			  		   	            </View>
			  		   	            <View style={{left:'-70rem'}} >
			  		   	                <Text style={styles.setFontSize}>{item.pv}</Text>
			  		   	            </View>
			  		   	            <View style={[styles.itemArrow,{left:'30rem'}]}>
			  		   	                <Text style={styles.setFontSize}>点击量:</Text>
			  		   	            </View>
			  		   	            <View style={{left:'-20rem'}} >
			  		   	                <Text style={styles.setFontSize}>{item.click}</Text>
			  		   	             </View>
			  		   	                	
			                	</View>
			                	<View style={styles.amoutList}>
		                			<View style={styles.dayArrow}>
		  		   	                	<Text style={styles.setFontSize}>成交金额:</Text>
		  		   	                </View>
		  		   	                <View style={{left:'-40rem'}} >
		  		   	                   <Text style={styles.setFontSize}>{item.pay}</Text>
		  		   	                </View>

		  		   	                <View style={[styles.itemArrow,{left:'20rem'}]}>
			  		   	                <Text style={styles.setFontSize}>点击率:</Text>
			  		   	            </View>
			  		   	            <View style={{left:'-40rem'}} >
			  		   	                <Text style={styles.setFontSize}>{item.ctr +'%'}</Text>
			  		   	            </View>
			  		   	            <View style={[styles.itemArrow,{left:'40rem'}]}>
			  		   	                <Text style={styles.setFontSize}>转化率:</Text>
			  		   	            </View>
			  		   	            <View style={{left:'-20rem'}} >
			  		   	                <Text style={styles.setFontSize}>{item.click_ROi +'%'}</Text>
			  		   	             </View>
			  		   	                	
			                	</View>
				          	</View>
						</View>
			   		)
			   	})
			   }
				
			</ScrollView>
		)
	}
}

const styles={
	     click: {
		    flex: 8,
		    color: '#3089dc',
	   		fontSize: '24rem',
  		},
	    scroller:{
	      width: 750,
	      height: 500
	    },
	   textCenter:{
	  	textAlign: 'center'
	   },
	   title: {
	   	padding:'20rem',
	   	color: '#0894EC',
	   	fontSize: '30rem',
	   	flex: 11
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
    setItemList:{
        backgroundColor:"#ffffff",
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
	   report: {
	   	borderBottomWidth:"2rem",
        borderBottomStyle:"solid",
        borderBottomColor:"#e8e8e8",
        marginBottom: '20rem'
	   },
	   amoutList:{
	        backgroundColor:"#ffffff",
	        padding:"15rem 10rem",
	       	alignItems:"center",
	        flexDirection:"row",
	        display:'flex'
	    },
	  	amoutitemArrow:{
	    	flex: 2,
	    	fontSize:"30rem",
	    	right: '20rem'
	    },
	    itemTextList:{
        		fontSize:"30rem",
        		color:"#0894EC",
        		flex:18
    		},
	   ArrowFirst:{
	    	flex: 8,
	    	fontSize:"24rem",
	        color:"#5F646E"
	    },
	   Arrow:{
	    	flex: 5,
	    	fontSize:"24rem",
	        color:"#5F646E" 
	   },
	   itemArrow: {
	   	    flex: 3,
	    	fontSize:"30rem",
	        color:"#5F646E",
	        textAlign: 'right',
        	marginRight:'2rem'
	   },
	   dayArrow: {
	   		flex: 3,
	    	fontSize:"24rem",
	        color:"#5F646E",
	        marginLeft: '20rem'
	   },
	   setFontSize:{
	   	fontSize:'30rem'
	   },
	   setitemTextList:{
        fontSize:"30rem",
        color:"#000",
        flex:15
    	},
	   setitemArrow:{
    	flex: 4,
    	fontSize:"32rem",
        color:"#000" ,
        textAlign: 'right',
        marginRight:'3rem'
       },
       setmoreArrow:{
    	flex: 1,
    	fontSize:"32rem",
        color:"#000" ,
        textAlign: 'right',
        marginRight:'3rem'
        }
	 }
export default CampaignsListView

mount(<CampaignsListView/>, 'body');