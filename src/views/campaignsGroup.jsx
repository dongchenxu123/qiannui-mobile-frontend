'use strict';
import {mount} from 'nuke-mounter';
import {createElement, Component} from 'weex-rx';
import {View, Text, Link, Image, Button, Modal, Dimensions, Navigator} from 'nuke';
import { ScrollView} from 'nuke-components';
import QN from 'QAP-SDK';
import { getAdgroupsByCid, getAuthSign, deleteAdgroup } from '../api'
import ListViewGroupView from './listViewGroup'
import { showLoading,hideLoading } from './util';

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
      showNodata:0
		}
		this.setNewSatusFunc = this.setNewSatusFunc.bind(this);
		this.delItemsFunc = this.delItemsFunc.bind(this);
        showLoading();
	}
	componentDidMount () {
        getAuthSign().then((result) => {
           	this.setState({
           		subway_token: result
           	})

           	getAdgroupsByCid(this.state.subway_token, campaign_id, 1).then((res) => {
              if(_.isArray(res) && res.length > 0){
                  this.setState({
                        campaginsData: res,
                        showNodata:2
                    })    
              }else{
                 this.setState({
                    showNodata: 1,
                    })
               hideLoading();
              }
           	}, (error) => {
                hideLoading();
	            Modal.alert(JSON.stringify(error));
	        });
     	}, (error) => {
            hideLoading();
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
   
	render () {

		return (
			<ScrollView style={styles.scroller} onEndReachedThreshold={300}>
			   <View><Button type='primary' style={{margin: '20rem'}} onPress={this.addToView.bind(this, this.state.campaign_id)} block="true" type="secondary"> 新增宝贝推广</Button></View>
			   {
         this.state.showNodata == 1 ? 
          <View>
               <Text style={{fontSize:'30rem',padding:'100rem'}}>暂时还没有推广宝贝，赶快去推广吧</Text> 
          </View>
           :
          this.state.showNodata == 2  ?
          <ListViewGroupView data={this.state.campaginsData}  
              showNodata={this.state.showNodata}        
              callbackSetNewSatus={this.setNewSatusFunc}
              delItems={this.delItemsFunc}
              campaign_id={this.state.campaign_id}
          />
          :
          <Text></Text>
         }
         
			</ScrollView>
		)
	}
}
const styles={
	 scroller:{
      backgroundColor:'#ffffff',
      width: 750,
      height: height
      },
	  header: {
	  	 height: '120rem',
	  	 width: '100%'
	  },
	  main: {
	  	flexFlow: 'column',
	  	flex: 1,
	  	width: '100%',
	  	background: '#ccc'
	  }
	  
}

mount(<CampaignsGroupView />, 'body');


export default CampaignsGroupView