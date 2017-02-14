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
            showLoading:false,
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
        Modal.confirm('确定删除推广吗？',[ 
            {
                onPress:()=>{
                    deleteAdgroup(adgroup_id).then((res) => {
                        Modal.toast('已取消推广');
                        var itemId= res.data.adgroup_id;
                        this.props.delItems(itemId);
                        
                        }, (error) => {
                            Modal.alert(JSON.stringify(error));
                
                    });
                },
                text:"确定"
            },
            {
                onPress:()=>{},
                text:"取消"
            }
        ]); 	
	}
    getkeyWords (adgroup_id, campaign_id, title, imgage, online_status,default_price) {
          QN.navigator.push({
            url:'qap://views/getKeywords.js',
            query:{adgroup_id:adgroup_id,
                   campaign_id: campaign_id,
                   name: title,
                   imgage: imgage,
                   online_status: online_status,
                   default_price:default_price
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
    	var imgage= item.img_url.replace('jpg_sum.','jpg_150x150.');
    
    	return (
        	<View>
        		<View style={app.cellItemList}>
                		<Image source={{uri: imgage}} style={{width:'160rem',height:'180rem'}}/>
                		<View style={app.itemTextList}>
                			<Text style={{fontSize: '32rem', paddingBottom: '15rem'}}>{item.title}</Text>
                			<View style={{ flexDirection:"row",display: 'flex'}}>
                				<Text style={{fontSize:'30rem',color:'#f50'}}>
                					状态: {itemStatus}
                				</Text>
                				<Text style={{paddingLeft: '40rem',paddingBottom: '20rem', fontSize:'30rem'}}>昨日点击: {item.report.click}</Text>
                			</View>
                			<View style={{flexDirection:'row'}}>
                				<Button size='small' type="secondary" onPress={self.press.bind(self, adgroup_id, online_status)}>
                				{newStatus}
                				</Button>
                    			<Button size='small' type="secondary" onPress={self.delpress.bind(self, adgroup_id)}>删除推广</Button>
                    			<Button size='small' type="secondary" onPress={self.getkeyWords.bind(self, adgroup_id, campaign_id, title, imgage, online_status ,item.default_price)}>关键词</Button>
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
        var showNodata = this.props.showNodata;
        return (
        	showNodata == true ? 
            <Text style={{fontSize:'30rem',padding:'100rem'}}>暂时还没有推广宝贝，赶快去推广吧</Text> : 
            <ListView
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
        height: height-100
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