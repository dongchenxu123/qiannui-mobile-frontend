'use strict';
import {mount} from 'nuke-mounter';
import {createElement, Component} from 'weex-rx';
import { View, Text, Image,ScrollView, TouchableHighlight} from 'nuke-components';;
import { Tabbar, Button, Icon, ListView, Iconfont, Modal } from 'nuke';
import QN from 'QAP-SDK';
import Util from 'nuke-core';
const Location = Util.Location;
import { getAuthSign, 
        getSellerUser,
        UserInfo,
        ProfileReport,
        WuxianBalance,
        getCampaign,
        setStatus,
        setBuget,
        getPlatfrom,
        getAdgroups,
        getOnsaleItem,
        deleteAdgroup,
        updateAdgroup,
        getUnSaleItem,
        addAdgroup,
        getallKeywords,
        getRecommendKeywords,
        getItemNumByKeyword,
        createNewDspUser,
        getArea,
        checkIssetDspUser,
        getDspUserMarket,
        getDspOnsaleItems
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
      /*  var myHeaders = new Headers();
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
            Modal.alert(JSON.stringify(data));
            console.log(data); // 真正地数据结果
        })
        .catch(error => {
           Modal.alert(error);
        });*/
      
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

     handleGetCampaigns(){

         getCampaign(subway_token).then((result) => {
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
        getAdgroups(subway_token,'12297040',1).then((result) => {
          Modal.alert(JSON.stringify(result));
           
        }, (error) => {
           // Modal.alert(JSON.stringify(error));
            //Modal.alert(1);
        });
     }
     OnsaleItemsFunc(){
		getOnsaleItem().then((result) => {
          Modal.alert(JSON.stringify(result));
           
        }, (error) => {
           // Modal.alert(JSON.stringify(error));
            //Modal.alert(1);
        });
     }
     deleteAdgroupsFunc(){
          deleteAdgroup('654231684').then((result) => {
            Modal.alert(JSON.stringify(result));
             
          }, (error) => {
             // Modal.alert(JSON.stringify(error));
              //Modal.alert(1);
          });
     }
     updateAdgroupsFunc(){
       updateAdgroup(733482419,'offline').then((result) => {
          Modal.alert(JSON.stringify(result));
           
        }, (error) => {
           // Modal.alert(JSON.stringify(error));
            //Modal.alert(1);
        });
     }
     UnsaleItemsFunc(){
       getUnSaleItem(12297040).then((result) => {
          Modal.alert(JSON.stringify(result));
           
        }, (error) => {
           // Modal.alert(JSON.stringify(error));
            //Modal.alert(1);
        });
     }
     addAdgroupFunc(){
      addAdgroup(12297040,36560210330,'春秋装新款情侣卫衣套装男女士','https://img.alicdn.com/bao/uploaded/i1/T1Xj1zFhhcXXXXXXXX_!!0-item_pic.jpg_150x150.jpg').then((result) => {
          Modal.alert(JSON.stringify(result));
           
        }, (error) => {
           // Modal.alert(JSON.stringify(error));
            //Modal.alert(1);
        });
     }

     getallKeywordsFunc(){
        getallKeywords(subway_token,654211671,12297040).then((result) => {
          Modal.alert(JSON.stringify(result));
           
        }, (error) => {
          
        });
     }
     getRecommendKeywordsFunc(){
        getRecommendKeywords(654211671).then((result) => {
           Modal.alert(JSON.stringify(result));
           
        }, (error) => {
          
        });
     }
     getItemNumByKeywordFunc(){

        getItemNumByKeyword("卫衣男性").then(data => {
            
           Modal.alert(data);
        });
       //9511638
     }
     getAreafromFunc(){
         getArea('9511638').then((result) => {
            Modal.alert(JSON.stringify(result));
           
        }, (error) => {
            Modal.alert(JSON.stringify(error));
            Modal.alert(1);
        });
     }

     checkIssetDspUserFunc(){
        checkIssetDspUser().then((value) => {
             Modal.alert(JSON.stringify(value));
           
          });
     }
     getDspUserMarketFunc(type){
         getDspUserMarket(type).then((value) => {
             Modal.alert(JSON.stringify(value));
           
          });
     }
     getOnsaleItemsFunc(){
         getDspOnsaleItems().then((value) => {
             Modal.alert(JSON.stringify(value));
           
          });
     }
    render() {
        return (
            <ScrollView style={styles.scroller}>
                <View style={styles.container}>
                <Button block="true" onPress={() => {this.handleTOPInvoke()}} type="primary" style={styles.btnlist}>subway_token</Button>         
                <Button block="true" onPress={() => {this.handleGetCustBase()}} type="primary" style={styles.btnlist}>店铺报表</Button>    
                <Button block="true" onPress={() => {this.handleGetCampaigns()}} type="primary" style={styles.btnlist}>计划列表</Button>    
                <Button block="true" onPress={() => {this.handleSetCampaignsStatus()}} type="primary" style={styles.btnlist}>更改计划状态</Button>  
                <Button block="true" onPress={() => {this.setBugetFunc()}} type="primary" style={styles.btnlist}>设置计划日限额</Button>  
                <Button block="true" onPress={() => {this.getPlatfromFunc()}} type="primary" style={styles.btnlist}>获取平台设置</Button>  
                <Button block="true" onPress={() => {this.getAreafromFunc()}} type="primary" style={styles.btnlist}>获取区域设置</Button> 
                <Button block="true" onPress={() => {this.getAdgroupsFunc()}} type="primary" style={styles.btnlist}>获取计划下推广组</Button> 
                <Button block="true" onPress={() => {this.deleteAdgroupsFunc()}} type="primary" style={styles.btnlist}>删除一个推广组</Button> 
                <Button block="true" onPress={() => {this.updateAdgroupsFunc()}} type="primary" style={styles.btnlist}>更新推广组状态</Button> 
                <Button block="true" onPress={() => {this.OnsaleItemsFunc()}} type="primary" style={styles.btnlist}>在售宝贝</Button>                                     
                <Button block="true" onPress={() => {this.UnsaleItemsFunc()}} type="primary" style={styles.btnlist}>未推广宝贝</Button> 
                <Button block="true" onPress={() => {this.addAdgroupFunc()}} type="primary" style={styles.btnlist}>新增计划下推广组</Button> 
                <Button block="true" onPress={() => {this.getallKeywordsFunc()}} type="primary" style={styles.btnlist}>推广组关键词</Button> 
                <Button block="true" onPress={() => {this.getRecommendKeywordsFunc()}} type="primary" style={styles.btnlist}>获取推荐关键词</Button> 
                <Button block="true" onPress={() => {this.getItemNumByKeywordFunc()}} type="primary" style={styles.btnlist}>获取使用当前关键词的宝贝数量</Button> 
                <Button block="true" onPress={() => {this.checkIssetDspUserFunc()}} type="primary" style={styles.btnlist}>检测是否是dsp用户</Button>  
                <Button block="true" onPress={() => {this.getDspUserMarketFunc(1)}} type="primary" style={styles.btnlist}>dsp用户基本信息</Button>    
                <Button block="true" onPress={() => {this.getDspUserMarketFunc(3)}} type="primary" style={styles.btnlist}>在线销售的宝贝</Button> 
                <Button block="true" onPress={() => {this.getOnsaleItemsFunc()}} type="primary" style={styles.btnlist}>淘外引流数据列表</Button> 
                 <Text>
                    {JSON.stringify(Location)}
                </Text>
                </View>
            </ScrollView>
 		  );
    }
}

const styles = {
    scroller:{
      backgroundColor:'#ffffff'  
    },
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
