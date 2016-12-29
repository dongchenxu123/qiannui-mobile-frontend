'use strict';
import {mount} from 'nuke-mounter';
import {createElement, Component} from 'weex-rx';
import {View, Text, Button, Modal} from 'nuke';

import QN from 'QAP-SDK';
import { getAuthSign, getSellerUser,UserInfo,ProfileReport,WuxianBalance } from './api'



class Demo extends Component {
    constructor(props) {
      super(props);
    
      this.state = {};
    }

    handleTOPInvokeUserInfo(){
        //Modal.alert(JSON.stringify(document.URL));
        UserInfo().then((result) => {
          Modal.alert(JSON.stringify(result));
          Modal.alert(2222);
        }, (error) => {
            Modal.alert(JSON.stringify(error));
            Modal.alert(1);
        });
    }
    handleTOPInvoke(){
     
      getAuthSign().then((result) => {
            Modal.toast(JSON.stringify(result));
           
        }, (error) => {
            Modal.toast(JSON.stringify(error));
           
        });
    }

     handleGetCustBase(){
         ProfileReport().then((result) => {
            Modal.alert(JSON.stringify(result));
           
        }, (error) => {
            Modal.alert(JSON.stringify(error));
            Modal.alert(1);
        });

        
     }

    render() {
        return (
            <View style={styles.container}>
            <Button block="true" onPress={() => {this.handleTOPInvoke()}} type="primary">subway_token</Button>         
              
          <Button block="true" onPress={() => {this.handleGetCustBase()}} type="primary">报表</Button>    


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
};

mount(<Demo />, 'body');


export default Demo