'use strict';
import {mount} from 'nuke-mounter';
import {createElement, Component} from 'weex-rx';
import {View, Text, Link, Grid, Col, Image, Modal } from 'nuke';
import { browser, appCont, homeActive, my, shareLight } from '../static/static';
import QN from 'QAP-SDK';
import { getAuthSign, getSellerUser,UserInfo,ProfileReport,WuxianBalance } from '../api'
class User extends Component {
	constructor() {
		super()
		this.state= {
			userData: null,
			signData: null
		}
		getAuthSign().then(result => {
			Modal.alert(result);
			this.setState({
		    	signData: result
		    })
		}, error => {
		    Modal.alert(error);
		});
		
		
	}
	
	
	componentDidMount() {
		ProfileReport(this.state.signData).then(result => {
			Modal.alert(result);
		    this.setState({
		    	userData: result
		    })
		}, error => {
		    Modal.alert(error);
		});
	}
	render () {
		 
		return (
			<View>
			    
			      	<Text>123</Text>
			    
			    			
			  
    		   
    		   
			</View>
		)
	}
}





export default User