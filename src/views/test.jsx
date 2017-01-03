'use strict';
import {mount} from 'nuke-mounter';
import {createElement, Component} from 'weex-rx';
import { View, Text, Image, TouchableHighlight} from 'nuke-components';;
import { Tabbar, Button, Icon, ListView, Iconfont, Modal } from 'nuke';
import QN from 'QAP-SDK';

import { getAuthSign, 
        getSellerUser,
        UserInfo,
        ProfileReport,
        WuxianBalance,
        getCampaign,
        getCampaignRpt,
        setStatus,
        setBuget,
        getPlatfrom,
        getAdgroups,
        getOnsaleItems
    } from '../api'

var subway_token = '';
class Api extends Component {
    constructor(props) {
      super(props);
      this.state = {subway_token:''};
       getAuthSign().then((result) => {
                 subway_token = result;
                }, (error) => {
                    Modal.toast(JSON.stringify(error));
                   
                });
    }
    
    componentDidMount(){
        
    }
   /*
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
   }*/

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

     handleGetCampaigns(){

         getCampaign(subway_token).then((result) => {
            Modal.alert(JSON.stringify(result));       
        }, (error) => {
            Modal.alert(JSON.stringify(error));
            Modal.alert(1);
        }); 
     }

     handleGetCampaignsRpt(){

          getCampaignRpt(subway_token,'45895738').then((result) => {
            Modal.alert(JSON.stringify(result));
           
        }, (error) => {
            Modal.alert(JSON.stringify(error));
            Modal.alert(1);
        });

     }

     handleSetCampaignsStatus(){
         setStatus('45895738','万姐火锅鸡','online').then((result) => {
            Modal.alert(JSON.stringify(result));
           
        }, (error) => {
            Modal.alert(JSON.stringify(error));
            Modal.alert(1);
        });
     }

     setBugetFunc(){
        setBuget('45895738',60).then((result) => {
            Modal.alert(JSON.stringify(result));
           
        }, (error) => {
            Modal.alert(JSON.stringify(error));
            Modal.alert(1);
        });
     }

     getPlatfromFunc(){
        getPlatfrom('45895738').then((result) => {
            Modal.alert(JSON.stringify(result));
           
        }, (error) => {
            Modal.alert(JSON.stringify(error));
            Modal.alert(1);
        });
     }
     getAdgroupsFunc(){
        getAdgroups(subway_token,'45895738',1).then((result) => {
            Modal.alert(JSON.stringify(result));
           
        }, (error) => {
            Modal.alert(JSON.stringify(error));
            Modal.alert(1);
        });
     }
     OnsaleItemsFunc(){
        getOnsaleItems(1).then((result) => {
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
            <Button block="true" onPress={() => {this.handleGetCustBase()}} type="primary" style={styles.btnlist}>店铺报表</Button>    
            <Button block="true" onPress={() => {this.handleGetCampaigns()}} type="primary" style={styles.btnlist}>计划列表</Button>    
            <Button block="true" onPress={() => {this.handleGetCampaignsRpt()}} type="primary" style={styles.btnlist}>计划报表</Button>  
            <Button block="true" onPress={() => {this.handleSetCampaignsStatus()}} type="primary" style={styles.btnlist}>更改计划状态</Button>  
            <Button block="true" onPress={() => {this.setBugetFunc()}} type="primary" style={styles.btnlist}>设置计划日限额</Button>  
            <Button block="true" onPress={() => {this.getPlatfromFunc()}} type="primary" style={styles.btnlist}>获取平台设置</Button>  
            <Button block="true" onPress={() => {this.getAdgroupsFunc()}} type="primary" style={styles.btnlist}>获取计划下推广组</Button> 
            <Button block="true" onPress={() => {this.OnsaleItemsFunc()}} type="primary" style={styles.btnlist}>在售宝贝</Button>                                     

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
