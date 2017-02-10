'use strict';
import {mount} from 'nuke-mounter';
import {createElement, Component} from 'weex-rx';
import { View, Text, Image,ScrollView, TouchableHighlight} from 'nuke-components';;
import { Tabbar, Button, Icon, ListView, Iconfont, Modal, Dimensions } from 'nuke';
import QN from 'QAP-SDK';
import { getUnSaleItem, addAdgroup } from '../api';
let {height} = Dimensions.get('window');
let URL= document.URL;
let arr= QN.uri.parseQueryString(URL.split('?')[1]);
const campaign_id = arr.campaign_id;

class AddCampaignView extends Component {
    constructor(props) {
      super(props);
      this.state={
      	datalist: [],
      	stop: false,
        isRefreshing: false,
        showLoading:true,
        refreshText: '↓ 下拉刷新',
        campaign_id: campaign_id
        
      }
        
    }
    
 
  componentDidMount(){
      getUnSaleItem(campaign_id).then((result) => {
           this.setState({
           		datalist: result
           	})
        }, (error) => {
            Modal.alert(JSON.stringify(error));

        });
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
    jointuiguang (num_iid,title,imgUrl) {
    	addAdgroup(this.state.campaign_id,num_iid,title,imgUrl).then((result) => {
     
        if(result.code && result.sub_msg){
          Modal.alert(result.sub_msg);
          return;
        }

        var idx= 0;
	   		for (var i=0; i<this.state.datalist.length; i++) {
	   			if(num_iid === this.state.datalist[i].num_iid) {
	   				idx = i
	   				break
	   			}
	   		}
	   		var arrs= this.state.datalist.splice(idx+1, this.state.datalist.length);
	   		
	   		this.setState({
	   			datalist: arrs
	   		})
     	}, (error) => {
            Modal.alert(JSON.stringify(error));
        });
    }
    renderItem (item, index){
    	var itemcid= item.cid;
    	var campaign_id= this.state.campaign_id;
    	var imgUrl= item.pic_url;
    	var title= item.title;
    	var num_iid=item.num_iid;
    	return (
        	<View>
        		<View style={app.cellItemList} onPress={this.linkTo.bind(this,item)}>
                		<Image source={{uri: item.pic_url}} style={{width:'180rem',height:'180rem'}}/>
                		<View style={app.itemTextList}>
                			<Text style={{fontSize: '30rem', paddingBottom: '15rem'}}>{item.title}</Text>
                			<Text style={{color: 'red', paddingBottom: '20rem'}}>状态: 未推广</Text>
                		    <Button style={{color: '#3089dc'}} block="true" onPress={this.jointuiguang.bind(this,num_iid,title,imgUrl)}>参与推广</Button>
                		</View>
                </View>
        		
        	</View>
        	
            );

    }
   render(){
        var self=this;
        var listGroup= this.state.datalist;
        return (
        	<ScrollView style={app.scroller} onEndReachedThreshold={300}>
	        	{
		        	listGroup.length === 0 ? 
		        	<Text>Loading...</Text> : 
		        	<ListView
						renderRow={this.renderItem.bind(this)} 
						dataSource={listGroup}
						style={app.listContainer}
						onEndReached={this.handleLoadMore.bind(this)} 
					/>
	        	}
        	</ScrollView>

        )
    }
}
const app = {
	 scroller:{
      backgroundColor:'#ffffff',
      width: 750,
      height: height
      },
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

mount(<AddCampaignView />, 'body');


export default AddCampaignView
