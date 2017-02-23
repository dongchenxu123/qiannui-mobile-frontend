'use strict';
import {mount} from 'nuke-mounter';
import {createElement, Component} from 'weex-rx';
import {View, Text, Link, Image,ListView, Button, Modal, Dimensions, Navigator} from 'nuke';
import { ScrollView,TouchableHighlight,RefreshControl} from 'nuke-components';
import QN from 'QAP-SDK';
import { getAdgroupsByCid,
          getAuthSign, 
          deleteAdgroup,
          updateAdgroup 
        } from '../api'
/*import ListViewGroupView from './listViewGroup'*/
import { showLoading,hideLoading } from './util';
import _ from 'lodash';


let {height} = Dimensions.get('window');
let URL= document.URL;
let arr= QN.uri.parseQueryString(URL.split('?')[1]);
const campaign_id = arr.campaign_id;

class CampaignsGroupView extends Component {
	constructor() {
		super()
		this.state={
			subway_token: '',
			campaginsData: [],
			campaign_id: campaign_id,
      showNodata:0,
      stop: false,
      isRefreshing: false,
      showLoading:true,
      refreshText: '↓ 下拉刷新',
      checked: false,
      status: '',
      totalPage:''
		}
    this.limit = 100;
    this.currentPage = 1;
		this.setNewSatusFunc = this.setNewSatusFunc.bind(this);
		this.delItemsFunc = this.delItemsFunc.bind(this);
    showLoading();
	}
	componentDidMount () {
        getAuthSign().then((result) => {
           	this.setState({
           		subway_token: result
           	})

            this.getAdgroupsByCid();
          
     	}, (error) => {
            hideLoading();
            Modal.alert(JSON.stringify(error));
        });    
	}
  getAdgroupsByCid(){
      getAdgroupsByCid(this.state.subway_token, campaign_id, this.currentPage,this.limit).then((res) => { 
              if(this.currentPage == 1 ){
                hideLoading();
              }
              
              if(_.isArray(res) && res.length > 0){
                  let hasMoreData = false;

                  if(this.limit == res.length ){
                      hasMoreData = true;
                  }

                  if(res.length <=4){
                    this.state.showLoading = false;
                  }

                  res.map((item,index)=>{
                    this.state.campaginsData.push(item);
                  })

                  this.state.showNodata = 2;
                  this.state.hasMoreData = hasMoreData;
                  this.setState(this.state);         
              }else{
                var Nodata = 0;
                if(this.currentPage == 1 ){
                   Nodata = 1;
                 }else{
                    Nodata = 2
                 }

                 this.setState({
                    showNodata: Nodata,
                    hasMoreData:false
                    })
              }
            }, (error) => {
              if(this.currentPage == 1 ){
                hideLoading();
              }
              Modal.alert(JSON.stringify(error));
          });
  }
	setNewSatusFunc(adgroup_id,status){
		var index = _.findIndex( this.state.campaginsData,function(v){
                    return v.adgroup_id == adgroup_id;
                });
            this.state.campaginsData[index].online_status =  status;
            var aa = this.state.campaginsData
            this.setState({
   			  campaginsData: aa
   		   }) 

	}
    delItemsFunc (itemId) {
	    var newArrs= [];
      this.state.campaginsData.map((item, index) => {
        if(item.adgroup_id !== itemId) {
            newArrs.push(item)
        }
      })
   		this.setState({
   			campaginsData: newArrs
   		})
    }
    addToView(campaign_id) {
        QN.navigator.push({
            url:'qap://views/addCampaign.js',
            query:{campaign_id:campaign_id},
            settings: {
                    animate: true
             }
        })	
	}
  press (adgroup_id, online_status) {
      updateAdgroup(adgroup_id, online_status).then((res) => {
              var newStatus = res.data.online_status;
              this.setNewSatusFunc(adgroup_id,newStatus);
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
                        this.delItemsFunc(itemId);
                        
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
      var newStatus= item.online_status == 'online' ? '暂停宝贝' : '推广宝贝';
      var campaign_id= this.state.campaign_id;
      var title= item.title;
      var imgage= item.img_url.replace('jpg_sum.','jpg_150x150.');
    
      return (
          <View>
            <View style={app.cellItemList}>
                    <Image source={{uri: imgage}} style={{width:'160rem',height:'180rem'}}/>
                    <View style={app.itemTextList}>
                      <Text style={{fontSize: '32rem', paddingBottom: '15rem'}}>{item.title}</Text>
                      <View style={{ flexDirection:"row",display: 'flex'}}>
                        <Text style={{fontSize:'30rem'}}>
                          状态: {item.online_status == 'online' ? '推广中' :'暂停中'}
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
  renderFooter=()=>{
      return this.state.showLoading == true ?
        <View style={[app.loading]}><Text style={app.loadingText}>加载中...</Text></View>
      :null
  }
  
  handleLoadMore() {
     var self = this;
        // 这里进行异步操作
        if (self.state.hasMoreData == false) {
            self.setState({showLoading:false})
            return;
        }else{
          this.currentPage++;
          this.getAdgroupsByCid();
        }  
  }
	render () {

		return (
			<ScrollView style={app.scroller}>
			   
         <View><Button type='primary' style={{margin: '20rem'}} onPress={this.addToView.bind(this, this.state.campaign_id)} block="true" type="secondary"> 新增宝贝推广</Button></View>
			   {
         this.state.showNodata == 1 ? 
          <View>
               <Text style={{fontSize:'30rem',padding:'100rem'}}>暂时还没有推广宝贝，赶快去推广吧</Text> 
          </View>
           :
          this.state.showNodata == 2  ?
           <ListView
                renderFooter={this.renderFooter}
                renderRow={this.renderItem.bind(this)} 
                dataSource={this.state.campaginsData}
                style={app.listContainer}
                onEndReached={this.handleLoadMore.bind(this)} 
              />
          :
          <Text></Text>
         }
         
			</ScrollView>
		)
	}
}
const app={
	 scroller:{
      backgroundColor:'#ffffff',
      width: 750,
      height: height
      },
    listContainer:{
        flex:1,
       // height: height-100
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

mount(<CampaignsGroupView />, 'body');


export default CampaignsGroupView