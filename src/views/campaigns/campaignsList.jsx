'use strict';
import {mount} from 'nuke-mounter';
import {createElement, Component} from 'weex-rx';
import {View, Text, Link, Grid, Col, Image, Modal, ScrollView, Button, Navigator, TouchableHighlight } from 'nuke';
import QN from 'QAP-SDK';
import {getCampaign, getAuthSign, setBuget, getArea} from '../../api';
import DialogView from '../dialog'
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
	}
	componentDidMount(){
		getAuthSign().then((result) => {
			   this.setState({
                        subway_token: result
                    })
               getCampaign(this.state.subway_token).then((result) => {
               	
             	   this.setState({
	                        campaignData: result
	                    })
             	}, (error) => {
	                Modal.alert(JSON.stringify(error));
	
	            });
            }, (error) => {
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
        Navigator.push('qap://views/campaignsGroup.js?id='+tid);
    }
	onPressSche (tid) {
        Navigator.push('qap://views/test.js?'+tid);
    }
	render () {
		return (
			<ScrollView style={styles.scroller} onEndReachedThreshold={300}>
			   {
			   	this.state.campaignData.length === 0 ? <Text>Loading...</Text> : this.state.campaignData.map((item, index) =>{
			   		var tid= item.campaign_id;
			   		var is_smooth= item.is_smooth;
			   		var itemcost= item.cost;
			   		return (
			   			<View key={index}>
			   			    <View>
				   			    <View style={[styles.amoutList, {backgroundColor:"#e8e8e8"}]}>
				   			    	<TouchableHighlight style={styles.title} onPress={this.onPress.bind(this, tid)}>{item.title}</TouchableHighlight>
				   			    	<Text style={styles.amoutitemArrow}>{item.online_status == 'online' ?'推广中':'暂停中'}</Text>
				   			    </View>
				   			    <View style={styles.report}>
							   		<View style={styles.amoutList}>
							   			<View style={styles.dayArrow}>
			  		   	                  日限额:  
			   							</View>
			  		   	              
			  		   	                  <Button
			  		   	                  	style={{color: '#3089dc', flex: 1}} 										 											onPress={this.prompt.bind(this, tid, is_smooth, itemcost)}
											id={this.state.budgetId}>
			  		   	                  ￥{this.state.budget !== '' && this.state.budgetId === tid ? this.state.budget : item.budget}
			  		   	                  </Button >
			  		   	               
			  		   	                <View style={styles.itemArrow}>
			  		   	                  投放平台:
			  		   	                </View>
			  		   	                <DialogView style={styles.amoutitemArrow}/>
			  		   	            </View>
					                <View style={styles.amoutList}>
							   		    <View style={styles.itemArrow}>
			  		   	                	投放地域:
			  		   	                </View>
			  		   	                <GetAreaView style={styles.amoutitemArrow} localId={item.campaign_id}/>
			  		   	                <View style={styles.itemArrow}>
			  		   	                	投放时段:
			  		   	                </View>
			  		   	               <Button
			  		   	                  	style={{color: '#3089dc', flex: 1}} 										 											onPress={this.onPressSche.bind(this, tid)}
											>
			  		   	                 设置
			  		   	                </Button>
					                </View>
				                </View>
			                </View>
			                <View style={styles.amoutList}>
			                	<View style={styles.ArrowFirst}>
			                		<Text style={styles.textCenter}>花费</Text>
				                	<Text style={styles.textCenter}>
				                         {item.cost}
				               		</Text>
			                	</View>
			                	<View style={styles.Arrow}>
			                		<Text style={styles.textCenter}>展现量</Text>
				                	<Text style={styles.textCenter}>
				                         {item.pv}
				               		</Text>
			                	</View>
			                	<View style={styles.Arrow}>
			                		<Text style={styles.textCenter}>点击量</Text>
				                	<Text style={styles.textCenter}>
				                         {item.click}
				               		</Text>
			                	</View>
				          	</View>
				          	<View style={styles.amoutList}>
			                	<View style={styles.ArrowFirst}>
			                		<Text style={styles.textCenter}>成交金额</Text>
				                	<Text style={styles.textCenter}>
				                         {item.pay}
				               		</Text>
			                	</View>
			                	<View style={styles.Arrow}>
			                		<Text style={styles.textCenter}>点击率</Text>
				                	<Text style={styles.textCenter}> 
				                         {item.ctr}%
				               		</Text>
			                	</View>
			                	<View style={styles.Arrow}>
			                		<Text style={styles.textCenter}>转化率</Text>
				                	<Text style={styles.textCenter}g>
				                         {item.click_ROi}%
				               		</Text>
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
	   	color: '#3089dc',
	   	fontSize: '35rem',
	   	flex: 11
	   },
	   report: {
	   	borderBottomWidth:"2rem",
        borderBottomStyle:"solid",
        borderBottomColor:"#e8e8e8",
        marginBottom: '20rem'
	   },
	   amoutList:{
	        backgroundColor:"#ffffff",
	        padding:"15rem",
	       	alignItems:"center",
	        flexDirection:"row",
	        display:'flex'
	    },
	  	amoutitemArrow:{
	    	flex: 2,
	    	fontSize:"24rem",
	    	right: '50rem'
	    },
	   ArrowFirst:{
	    	flex: 8,
	    	fontSize:"24rem",
	        color:"#5F646E"
	    },
	   Arrow:{
	    	flex: 8,
	    	fontSize:"24rem",
	        color:"#5F646E" 
	   },
	   itemArrow: {
	   	    flex: 3,
	    	fontSize:"24rem",
	        color:"#5F646E",
	        left: '20rem'
	   },
	   dayArrow: {
	   		flex: 3,
	    	fontSize:"24rem",
	        color:"#5F646E",
	        left: '50rem'
	   }
	 }

mount(<CampaignsListView />, 'body');


export default CampaignsListView