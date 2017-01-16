'use strict';
import {mount} from 'nuke-mounter';
import {createElement, Component} from 'weex-rx';
import {View, Text, Link, Grid, Col, Image, Button, Modal, Dimensions} from 'nuke';
import { ScrollView} from 'nuke-components';
import { browser, appCont, home, my, shareLightActive } from '../static/static';
import QN from 'QAP-SDK';
import { getAdgroupsByCid, getAuthSign } from '../api'
import ListViewGroupView from './listViewGroup'
let {height} = Dimensions.get('window');
class CampaignsGroupView extends Component {
	constructor() {
		super()
		this.state={
			subway_token: '',
			campaginsData: []
		}
        this.setNewSatusFunc = this.setNewSatusFunc.bind(this);
	}
	componentDidMount () {
		var URL= document.URL;
		var arr= URL.split('?')[1];
		var newarr= arr.split('&');
		var obj={}
		var param;
        for(var i=0;i<newarr.length;i++){
            param=newarr[i].split('=');
            obj[param[0]]=param[1];
            
        }
        var itemId=obj.id;
        getAuthSign().then((result) => {
           	this.setState({
           		subway_token: result
           	})
           	getAdgroupsByCid(this.state.subway_token, itemId, 1).then((res) => {
           		
           		this.setState({
           			campaginsData: res
           		})
               
           	}, (error) => {
	            Modal.alert(JSON.stringify(error));
	
	        });
     	}, (error) => {
            Modal.alert(JSON.stringify(error));

        });
		
	}
	setNewSatusFunc(adgroup_id,status){
		
        var index = _.findIndex( this.state.campaginsData,function(v){
                    return v.adgroup_id == adgroup_id;
                });
            this.state.campaginsData[index].online_status =  status;
            this.setState();  
            this.forceUpdate();  
	}
	render () {
   
		return (
			<ScrollView style={styles.scroller} onEndReachedThreshold={300}>
			   <View><Button type='primary' style={{margin: '20rem'}}> 新增宝贝推广</Button></View>
			   <ListViewGroupView data={this.state.campaginsData} callbackSetNewSatus={this.setNewSatusFunc}/>
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