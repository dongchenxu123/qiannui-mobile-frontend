'use strict';
import {mount} from 'nuke-mounter';
import {createElement, Component} from 'weex-rx';
import {View, Text, Link, Grid, Col, Image, Modal, TouchableHighlight, Navigator } from 'nuke';
import { getAuthSign, getallKeywords } from '../api'
class GetKeywordsView extends Component {
	constructor() {
		super()
		this.state={
			subway_token: '',
			keyWordsData: [],
			adgroup_id: ''
		}
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
        var adgroup_id= obj.adgroup_id;
        var campaign_id= obj.campaign_id;
        this.setState({
        	adgroup_id: obj.adgroup_id
        })
        getAuthSign().then((result) => {
         	this.setState({
                    subway_token: result
                })
                
            getallKeywords(this.state.subway_token, adgroup_id, campaign_id).then((result) => {
//           	Modal.alert(JSON.stringify(result))
	                
	            }, (error) => {
	                Modal.alert(JSON.stringify(error));
	
	            });  
            }, (error) => {
                Modal.alert(JSON.stringify(error));

            });  
        
	}
	showkeywordslist (adgroup_id) {
		Navigator.push('qap://views/keywordslist.js?adgroup_id='+adgroup_id);
	}
	render () {
		var adgroup_id= this.state.adgroup_id;
		return (
			<View>
			     <View></View>
			     <View>
			     	<TouchableHighlight onPress={this.showkeywordslist.bind(this, adgroup_id)} style={{margin:'100rem auto'}}>去添加关键词</TouchableHighlight>
			     </View>
    		</View>
		)
	}
}

mount(<GetKeywordsView />, 'body');


