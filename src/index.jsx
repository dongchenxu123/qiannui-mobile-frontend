'use strict';
import {mount} from 'nuke-mounter';
import {createElement, Component} from 'weex-rx';
import {View, Text, Link,Modal} from 'nuke';
import QN from 'QAP-SDK';
import { getAuthSign, getSellerUser,UserInfo,ProfileReport,WuxianBalance } from './api'


class HomeView extends Component {
    constructor(props) {
      super(props);
	  this.state = {};
    
    }
    render () {
    	return (
    		<View>
    		    <Link href="qap://views/test.js">TOP API 接口页面</Link>
    		</View>
    	)
    }
   
};

mount(<HomeView />, 'body');


export default HomeView