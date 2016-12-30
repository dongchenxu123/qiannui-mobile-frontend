'use strict';
import {mount} from 'nuke-mounter';
import {createElement, Component} from 'weex-rx';
import { View, Text, Image, TouchableHighlight} from 'nuke-components';;
import { Tabbar, Button, Icon, ListView, Iconfont } from 'nuke';
import QN from 'QAP-SDK';
import { getAuthSign, getSellerUser,UserInfo,ProfileReport,WuxianBalance } from '../api'
import {browser, browserActive, appCont, appContActive, home, homeActive, my, myActive, shareLight, shareLightActive} from '../static/static';
import HealthyView from './healthy';
import UserView from './user'
var subway_token = '';

class Api extends Component {
    constructor(props) {
      super(props);
    
      this.state = {
      	activeKey: "m3"
      };
    }

   componentDidMount(){
        var myHeaders = new Headers();
        myHeaders.append('Accept', 'application/json, text/javascript');
        QN.fetch('http://qianniu.why.xibao100.com/test', {
            headers:myHeaders,
            method: 'GET',
            mode: 'cors',
            dataType: 'json',
        })
        .then(response => {     
            return response.json(); // => 返回一个 `Promise` 对象
        })
        .then(data => {
            Modal.alert(data);
            console.log(data); // 真正地数据结果
        })
        .catch(error => {
           Modal.alert(error);
        });
   }


    handleTOPInvoke(){
     
     if(subway_token ==""){
         getAuthSign().then((result) => {
            subway_token = result;
            Modal.toast(JSON.stringify(result));
           
        }, (error) => {
            Modal.toast(JSON.stringify(error));
           
        });
     }else{
        Modal.alert(subway_token);
     }
     
    }
    
    onChange(status) {
        console.log(status)
    }

     handleGetCustBase(){

         ProfileReport(subway_token).then((result) => {
            Modal.alert(JSON.stringify(result));
           
        }, (error) => {
            Modal.alert(JSON.stringify(error));
            Modal.alert(1);
        });

        
     }

    render() {
        return (
             <View style={styles.container}>
	            <Button block="true" onPress={() => {this.handleTOPInvoke()}} type="primary" style={styles.btnlist}>subway_token</Button>         
	            <Button block="true" onPress={() => {this.handleGetCustBase()}} type="primary" style={styles.btnlist}>报表</Button>    

     		</View>
 		);
    }
}

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    btnlist: {
    	marginBottom: 15
    }
};

mount(<Api />, 'body');


export default Api
