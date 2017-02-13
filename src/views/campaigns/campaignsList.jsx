'use strict';
import {mount} from 'nuke-mounter';
import {createElement, Component} from 'weex-rx';
import {View, Text, Link, Image, Modal, ScrollView, Button, Navigator, TouchableHighlight } from 'nuke';
import QN from 'QAP-SDK';
import {getCampaign, getAuthSign, setBuget, getArea, setStatus} from '../../api';
import _ from 'lodash';
import { showLoading,hideLoading } from '../util';
import GetAreaView from './getAreaView'

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
		console.log('计划')
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
        Navigator.push('qap://views/schedule.js?campaign_id='+tid);
    }
	onPressPlat (tid) {
        Navigator.push('qap://views/platform.js?campaign_id='+tid);
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
				   			    	<View style={styles.Arrow}>
				   			    		<Button style={{width: 150, margintLeft: '40rem'}} onPress={this.statusItem.bind(this, tid, title, online_status)} type="secondary">
					   			    	{itemStatus}
					   			    	</Button>
				   			    	</View>
				   			    </View>
				   			    <View style={styles.report}>
							   		<View style={styles.amoutList}>
							   			<View style={styles.dayArrow}>
			  		   	                  <Text style={styles.setFontSize}>每日限额:</Text>  
			   							</View>
			  		   	              	 <View style={{left:'-30rem',fontSize:'30rem'}} >	
			  		   	                  <Button
			  		   	                  	onPress={this.prompt.bind(this, tid, is_smooth, itemcost)}
											id={this.state.budgetId}
											type="primary">
			  		   	                  ￥{this.state.budget !== '' && this.state.budgetId === tid ? this.state.budget : item.budget}
			  		   	                  </Button >
			  		   	                </View>
			  		   	                <View style={styles.itemArrow}>
			  		   	                  <Text style={[styles.setFontSize,{left:'30rem'}]}>投放平台:</Text>
			  		   	                </View>
			  		   	                <View style={{left:'-20rem',fontSize:'30rem'}} >
				  		   	                 <Button
				  		   	                  	onPress={this.onPressPlat.bind(this, tid)}
				  		   	                  	type="primary"
												>
				  		   	                 设置
				  		   	                </Button>
			  		   	                </View>
			  		   	            </View>
					                <View style={styles.amoutList}>
							   		    <View style={styles.dayArrow}>
			  		   	                	<Text style={styles.setFontSize}>投放地域:</Text>
			  		   	                </View>
			  		   	                <GetAreaView style={styles.amoutitemArrow} localId={item.campaign_id}/>
			  		   	                <View style={styles.itemArrow}>
			  		   	                	<Text style={styles.setFontSize}>投放时段:</Text>
			  		   	                </View>
			  		   	                <View style={{left:'-20rem',fontSize:'30rem'}} >
			  		   	                	<Button
			  		   	                  	onPress={this.onPressSche.bind(this, tid)}
			  		   	                  	type="primary"
											>
			  		   	                 		设置
			  		   	                	</Button>
			  		   	                </View>
					                </View>
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

		  		   	                <View style={[styles.itemArrow,{left:'-10rem'}]}>
			  		   	                <Text style={styles.setFontSize}>展现量:</Text>
			  		   	            </View>
			  		   	            <View style={{left:'-90rem'}} >
			  		   	                <Text style={styles.setFontSize}>{item.pv}</Text>
			  		   	            </View>
			  		   	            <View style={styles.itemArrow}>
			  		   	                <Text style={styles.setFontSize}>点击量:</Text>
			  		   	            </View>
			  		   	            <View style={{left:'-80rem'}} >
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

		  		   	                <View style={styles.itemArrow}>
			  		   	                <Text style={styles.setFontSize}>点击率:</Text>
			  		   	            </View>
			  		   	            <View style={{left:'-80rem'}} >
			  		   	                <Text style={styles.setFontSize}>{item.ctr +'%'}</Text>
			  		   	            </View>
			  		   	            <View style={styles.itemArrow}>
			  		   	                <Text style={styles.setFontSize}>转化率:</Text>
			  		   	            </View>
			  		   	            <View style={{left:'-80rem'}} >
			  		   	                <Text style={styles.setFontSize}>{item.click_ROi}</Text>
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
        padding:"10rem 30rem",
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
	    	flex: 7,
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
	   }
	 }
export default CampaignsListView