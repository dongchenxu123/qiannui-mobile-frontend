import { Icon, ListView, Dimensions, Button, Modal, Navigator } from 'nuke';
import {createElement, Component} from 'weex-rx';
import { View, Text, TouchableHighlight , RefreshControl, Image} from 'nuke-components';
import { updateAdgroup, deleteAdgroup } from '../api';
import _ from 'lodash';

let {height} = Dimensions.get('window');

import QN from 'QAP-SDK';
class ListViewGroupView extends Component {
    constructor() {
        super();
       this.state = {
            stop: false,
            isRefreshing: false,
            showLoading:true,
            refreshText: '↓ 下拉刷新',
            checked: false,
            status: ''
            
         };
         
    }
    handleRefresh = (e) => {
        this.setState({
          isRefreshing: true,
          refreshText: '加载中',
        });
        setTimeout(() => {
          var itemData= this.props.data;
          this.setState({
            isRefreshing: false,
            data: itemData,
            refreshText: '↓ 下拉刷新',
          });

        }, 3000);
      };

    handleLoadMore() {
        var self = this;
        // 这里进行异步操作
        if (self.index == 5) {
            self.setState({showLoading:false})
            return;
        }else{
            setTimeout(function() {
				self.state.data.push({key: 'l1',text:'loadmore1'}, {key: 'l2',text:'loadmore2'}, {key: 'l3',text:'loadmore3'},{key: 'l4',text:'loadmore4'}, {key: 'l5',text:'loadmore5'});
                self.setState(self.state);
                self.index++;
            }, 2000);

        }

    }
    linkTo(item,e) {
        console.log(e);
    }
    press (adgroup_id, online_status) {
    	updateAdgroup(adgroup_id, online_status).then((res) => {
       
           		var newStatus = res.data.online_status;

           		this.props.callbackSetNewSatus(adgroup_id,newStatus);
         
           	}, (error) => {
	            Modal.alert(JSON.stringify(error));
	
	        });
}
    delpress (adgroup_id) {
    	deleteAdgroup(adgroup_id).then((res) => {
    		var itemId= res.data.adgroup_id;
       		this.props.delItems(adgroup_id, itemId);
            
           	}, (error) => {
	            Modal.alert(JSON.stringify(error));
	
	        });
	}
    getkeyWords (adgroup_id, campaign_id, title, imgage, online_status) {
          QN.navigator.push({
            url:'qap://views/getKeywords.js',
            query:{adgroup_id:adgroup_id,
                   campaign_id: campaign_id,
                   name: title,
                   imgage: imgage,
                   online_status: online_status
            }
            
        })
	}
    renderItem (item, index){
    	var online_status= item.online_status;
    	var adgroup_id= item.adgroup_id;
    	var self= this;
    	var itemStatus= item.online_status == 'online' ? '推广中' : '暂停中';
    	var newStatus= item.online_status == 'online' ? '暂停宝贝' : '推广宝贝';
    	var campaign_id= this.props.campaign_id;
    	var title= item.title;
    	var imgage= item.img_url;
    	
    	return (
        	<View>
        		<View style={app.cellItemList} onPress={this.linkTo.bind(this,item)}>
                		<Image source={{uri: item.img_url}} style={{width:'180rem',height:'180rem'}}/>
                		<View style={app.itemTextList}>
                			<Text style={{fontSize: '30rem', paddingBottom: '15rem'}}>{item.title}</Text>
                			<View style={{ flexDirection:"row",display: 'flex'}}>
                				<Text style={{color: '#3089dc'}}>
                					状态: {itemStatus}
                				</Text>
                				<Text style={{paddingLeft: '40rem',paddingBottom: '20rem', color: 'red'}}>昨日点击: {item.report.click}</Text>
                			</View>
                			<View style={{flexDirection:'row'}}>
                				<Button size='small' type="secondary" onPress={self.press.bind(self, adgroup_id, online_status)}>
                				{newStatus}
                				</Button>
                    			<Button size='small' type="secondary" onPress={self.delpress.bind(self, adgroup_id)}>删除推广</Button>
                    			<Button size='small' type="secondary" onPress={self.getkeyWords.bind(self, adgroup_id, campaign_id, title, imgage, online_status )}>关键词</Button>
                			</View>
                		</View>
                </View>
        		
        	</View>
        	
            );

    }
    renderHeader=()=>{
        return <RefreshControl style={app.refresh} refreshing={this.state.isRefreshing} onRefresh={this.handleRefresh}><Text style={app.loadingText}>{this.state.refreshText}</Text></RefreshControl>;
    }
    renderFooter=()=>{
        return this.state.showLoading ?
        <View style={[app.loading]}><Text style={app.loadingText}>加载中...</Text></View>
        :null
    }
   render(){
        var self=this;
        var listGroup= this.props.data;
        return (
        	listGroup.length === 0 ? <Text>Loading...</Text> : <ListView
														            renderHeader={this.renderHeader}
														            renderFooter={this.renderFooter}
														            renderRow={this.renderItem.bind(this)} 
														            dataSource={listGroup}
														
														            style={app.listContainer}
														            onEndReached={this.handleLoadMore.bind(this)} 
														          />

        )
    }
}
const app = {
    listContainer:{
        flex:1,
        height: height
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
    itemTextList:{
        fontSize:"30rem",
        color:"#5F646E",
        flex: 4,
        paddingLeft: '30rem'
    },
    refresh:{
        height:"80rem",
        width:"750rem",
		backgroundColor:"#cccccc",
        justifyContent:"center",
        alignItems:"center"
    },
    loading:{
        height:"80rem",
        display:"flex",
        width:"750rem",
        flexDirection:"row",
        backgroundColor:"#cccccc",
        alignItems:"center",
        justifyContent:"center"
    },
    loadingText:{
        color:"#666666"
    },
    Arrow: {
		flex: 4
	}
}

export default ListViewGroupView