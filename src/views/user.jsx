'use strict';
import {mount} from 'nuke-mounter';
import {createElement, Component} from 'weex-rx';
import {View, Text, Link, Grid, Col, Image} from 'nuke';
import { browser, appCont, homeActive, my, shareLight } from '../static/static';
import QN from 'QAP-SDK';
import { getAuthSign, getSellerUser,UserInfo,ProfileReport,WuxianBalance } from '../api'
class User extends Component {
	render () {
		return (
			<View>
			    
    		    <View style={styles.main}>
    		        <Text>user</Text>
    		    </View>
    		   
			</View>
		)
	}
}
const styles={
	  header: {
	  	 height: '120rem',
	  	 width: '100%'
	  },
	  main: {
	  	flexFlow: 'column',
	  	flex: 1,
	  	width: '100%',
	  	background: '#ccc'
	  },
	  footer: {
	  	height: '120rem',
	  	width: '100%'
	  },
	  textColor: {
	  	color: '#333',
	  	display: 'block',
	  	textAlign: 'center'
	  },
	  imgStyle: {
	  	width:'48rem',
	  	height:'48rem',
	  	borderRadius:'60rem',
	  	display: 'block', 
	  	margin: '0 auto',
	  	padding:'15rem 0'
	  },
	  gridWrap:{
	        height:'280rem'
	    	},
	  col1:{
	        justifyContent:'center',
	        alignItems:'center'
	    },
	  col2:{
	        justifyContent:'center',
	        alignItems:'center'
	    },
	  col3:{
	        justifyContent:'center',
	        alignItems:'center'
	   },
	  col4:{
	        justifyContent:'center',
	        alignItems:'center'
	   },
	  col5:{
	        justifyContent:'center',
	        alignItems:'center'
	  }
}




export default User