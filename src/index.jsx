'use strict';
import {mount} from 'nuke-mounter';
import {createElement, Component} from 'weex-rx';
import {View, Text, Link} from 'nuke';

import QN from 'QAP-SDK';
import { getAuthSign, getSellerUser,UserInfo,ProfileReport,WuxianBalance } from './api'

var subway_token = '';

class HomeView extends Component {
    constructor(props) {
      super(props);
	  this.state = {};
    }
    render () {
    	return (
    		<View>
    		    <Link href="qap://views/test.js">dgdfgddgdfgddgdfgddgdfgddgdfgddgdfgddgdfgddgdfgddgdfgddgdfgddgdfgddgdfgddgdfgddgdfgddgdfgddgdfgddgdfgddgdfgddgdfgddgdfgddgdfgddgdfgddgdfgddgdfgddgdfgddgdfgddgdfgddgdfgddgdfgddgdfgddgdfgddgdfgddgdfgddgdfgddgdfgddgdfgddgdfgd</Link>
    		</View>
    	)
    }
   
};

mount(<HomeView />, 'body');


export default HomeView