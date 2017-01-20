'use strict';

import QN from 'QAP-SDK';
import * as DateAPi from './date';
import {checkAPIError} from './checkerror';
import { Modal } from 'nuke';
import {getLocalstoreUser} from './authsign';
import {createNewDspUser,getProfileReport} from './profile';
import {getOnsaleItem} from  './onsale-item'
import Async from 'async';
import _ from 'lodash';



var app = app || {}; 
app.user_id = '';
app.telephone = true; //标记淘外引流页面 是否弹出手机号窗口
app.account_id = '';
export function checkIssetDspUser(){
    return new Promise((resolve, reject) => {

        // 1 先从缓冲里面取
        //2 没有则去检查或者创建 
        // 3 创建成功后需要放入缓存
        //4 返回userinfo 数据



            getLocalstoreUser().then((res)=>{
                app.account_id  = res.taobao_user_id;
             QN.fetch(DateAPi.httphost+'/checkUser', {
                    method: 'POST',
                    mode: 'cors',
                    dataType: 'json',
                    body:"account_id="+ res.taobao_user_id
                })
                .then(response => {     
                    return response.json(); // => 返回一个 `Promise` 对象
                })
                .then(data => {
                 
                    if(data.user_id == undefined){
                        createNewDspUser().then((value) => {
                          if(value.user_id){
                        
                            resolve(value);
                          }else{
                            resolve([]);
                          }
                        });
                    }else{
                        resolve(data);
                    }
                 
                })
                .catch(error => {
                    Modal.toast(JSON.stringify(error));
                });

            });
        
    });
}

/*
* 获取dsp 用户余额 cpc type = 1;  日限额: type= 2 ； dsp推广中的宝贝 type =3
*/
export function getDspUserMarket(user_id,type){
    return new Promise((resolve, reject) => {
        QN.fetch(DateAPi.httphost+'/getUser', {
          
            method: 'POST',
            mode: 'cors',
            dataType: 'json',
            body:"user_id="+user_id+'&type='+type
        })
        .then(response => {     
            return response.json(); // => 返回一个 `Promise` 对象
        })
        .then(data => {
           resolve(data);    
        })
        .catch(error => {
           resolve(error);
        });
    });
}

/*
* 检测dsp用户是否添加了手机号  dsp 用户基本信息 
*/
export function getDspUserInfo(user_id,tel){
    return new Promise((resolve, reject) => {
                var param = {
                    user_id:user_id
                };
                if(tel)
                {
                    param.telephone = tel;
                }

                QN.fetch(DateAPi.httphost+'/getUserInfo', {
                  
                    method: 'POST',
                    mode: 'cors',
                    dataType: 'json',
                    body:QN.uri.toQueryString(param)
                })
                .then(response => {     
                    return response.json(); // => 返回一个 `Promise` 对象
                })
                .then(data => {

                  resolve(data);                
                })
                .catch(error => {
                    resolve(error);
                });      
          });
}

/*
* 淘外引流宝贝列表 支持宝贝搜索
*/
export function getDspOnsaleItems(q){
  return new Promise((resolve, reject) => {
        //直通车在售宝贝
        getOnsaleItem().then((result) => {
             var salesData = [];
            if(result.length > 0 ){
             
                getDspUserMarket(3).then((data) => {
                    var dsp_item =data.Items;
                   var a2  = [];
                   result.forEach(function(value, index, array) {
                            if(value.img_url == undefined){
                                value.img_url = value.pic_url +'_150x150.jpg';
                            }
                            if(array[index].dsp_onLineStatus == undefined ){
                                    array[index].dsp_onLineStatus = 0;
                                }
                            if(dsp_item.length >0){
                                dsp_item.forEach(function(v, i, a) {
                                    if(v.item_id ==  value.num_iid){
                                        array[index].dsp_onLineStatus = 1;
                                    }
                                });
                            }   

                            if(q){
                                if(value['title'].includes(q)){
                                    salesData = result;
                                }
                            } 
                    });

                    if(!q && dsp_item.length >0){
                        salesData = _.sortBy(result, [function(o) { return -o.dsp_onLineStatus; }]);
                    }else{
                        salesData = result;
                    }
                    resolve(salesData);
                });
            }                  
    }, (error) => {
       
    });

  });
     
}

/*
* items : 对象数组  包含如下参数
        param = {
                             item_id:item.get('num_iid'),
                             cid:item.get('cid'),
                             title:item.get('title'),
                             price:item.get('price'),
                             img_url:item.get('pic_url'),
                             props:item.get('props'),
                             url:'https://item.taobao.com/item.htm?id='+item.get('num_iid')
                            };
*/
export function setItemsOnline(items){
    return new Promise((resolve, reject) => {
        checkIssetDspUser.then((value) => {
            if(value.user_id){
                var param = {
                    user_id:value.user_id,
                    items:items
                };
                
                QN.fetch(DateAPi.httphost+'/setItemsOnline', {
                  
                    method: 'POST',
                    mode: 'cors',
                    dataType: 'json',
                    body:QN.uri.toQueryString(param)
                })
                .then(response => {     
                    return response.json(); // => 返回一个 `Promise` 对象
                })
                .then(data => {
                  resolve(data);                
                })
                .catch(error => {
                    Modal.toast(JSON.stringify(error));
                });
            }else{
                 Modal.toast("对不起，您还不是dsp注册用户");
            }    
          });
    });
}

/*
* items  逗号隔开的 num_iid 值的数组
*/
export function setItemsOffline(items){
    return new Promise((resolve, reject) => {
        checkIssetDspUser.then((value) => {
            if(value.user_id){
                var param = {
                    user_id:value.user_id,
                    item_ids:items
                };
                
                QN.fetch(DateAPi.httphost+'/setItemsOffline', {
                  
                    method: 'POST',
                    mode: 'cors',
                    dataType: 'json',
                    body:QN.uri.toQueryString(param)
                })
                .then(response => {     
                    return response.json(); // => 返回一个 `Promise` 对象
                })
                .then(data => {
                  resolve(data);                
                })
                .catch(error => {
                    Modal.toast(JSON.stringify(error));
                });
            }else{
                 Modal.toast("对不起，您还不是dsp注册用户");
            }    
          });
    });
}

/*
* 设置cpc
*/
export function setCpc(cpc){
    return new Promise((resolve, reject) => {
        checkIssetDspUser.then((value) => {
            if(value.user_id){
                var param = {
                    user_id:value.user_id,
                    cpc:cpc
                };
                
                QN.fetch(DateAPi.httphost+'/setCpc', {
                  
                    method: 'POST',
                    mode: 'cors',
                    dataType: 'json',
                    body:QN.uri.toQueryString(param)
                })
                .then(response => {     
                    return response.json(); // => 返回一个 `Promise` 对象
                })
                .then(data => {
                    resolve(data);
                })
                .catch(error => {
                    Modal.toast(JSON.stringify(error));
                });

            }else{
                 Modal.toast("对不起，您还不是dsp注册用户");
            }    
       });
    });
}


/*
* 设置cpc
*/
export function setBudget(budget){
    return new Promise((resolve, reject) => {
        checkIssetDspUser.then((value) => {
            if(value.user_id){
                var param = {
                    user_id:value.user_id,
                    budget:budget
                };
                
                QN.fetch(DateAPi.httphost+'/setBudget', {
                  
                    method: 'POST',
                    mode: 'cors',
                    dataType: 'json',
                    body:QN.uri.toQueryString(param)
                })
                .then(response => {     
                    return response.json(); // => 返回一个 `Promise` 对象
                })
                .then(data => {
                    resolve(data);
                })
                .catch(error => {
                    Modal.toast(JSON.stringify(error));
                });
            }else{
                 Modal.toast("对不起，您还不是dsp注册用户");
            }     
        });
    });
} 

/*
* 获取今天报表
*/
export function getTodayReport(){
    return new Promise((resolve, reject) => {
        checkIssetDspUser.then((value) => {
            if(value.user_id){
                var param = {
                    user_id:value.user_id
                };
                
                QN.fetch(DateAPi.httphost+'/getTodayReport', {
                  
                    method: 'POST',
                    mode: 'cors',
                    dataType: 'json',
                    body:QN.uri.toQueryString(param)
                })
                .then(response => {     
                    return response.json(); // => 返回一个 `Promise` 对象
                })
                .then(data => {
                    resolve(data);
                })
                .catch(error => {
                   resolve(error);;
                });
            }else{
                 Modal.toast("对不起，您还不是dsp注册用户");
            }     
        });
    });
}


/*
* 获取历史报表
*/
export function getHistoryReport(start_date,end_date){
    return new Promise((resolve, reject) => {
        checkIssetDspUser.then((value) => {
            start_date = start_date !== undefined ? start_date : DateAPi.formatDate(DateAPi.lastWeek);
            end_date = end_date !== undefined ? end_date :DateAPi.formatDate(DateAPi.yesterday);
            
            if(value.user_id){
                var param = {
                    user_id:value.user_id,
                    start_date:start_date,
                    end_date:end_date
                };
                
                QN.fetch(DateAPi.httphost+'/getDspReport', {
                  
                    method: 'POST',
                    mode: 'cors',
                    dataType: 'json',
                    body:QN.uri.toQueryString(param)
                })
                .then(response => {     
                    return response.json(); // => 返回一个 `Promise` 对象
                })
                .then(data => {
                    resolve(data);
                })
                .catch(error => {
                   resolve(error);
                });
            }else{
                 Modal.toast("对不起，您还不是dsp注册用户");
            }     
        });
    });
}


/*
* 获取直通车 与dsp 对比报表
*/
export function contractRpt(subway_token, start_date= null, end_date= null){
    start_date = start_date != null ? start_date :DateAPi.formatDate(DateAPi.lastWeek);
    end_date = end_date != null ? end_date : DateAPi.formatDate(DateAPi.yesterday);

    return new Promise((resolve, reject) => {
        checkIssetDspUser.then((value) => {
             Async.parallel({
                 baserpt:function(callback){
                    getProfileReport(subway_token,start_date,end_date).then((result) => {
                       callback(null,result);
                    }, (error) => {
                        callback(error,null);
                    });    
                 },
                 dsprpt:function(callback){
                    getHistoryReport().then((result) => {
                       callback(null,result);
                    }, (error) => {
                        callback(error,null);
                    });    
                 }
             },function(err,result){
                if(err == null){
                    resolve(result);
                }else{
                    resolve('');
                }
             });
        });
    });

}

/*
* 获取充值模板
*/
export function getRechargeTempalte(){
    return new Promise((resolve, reject) => {
        checkIssetDspUser.then((value) => {
            if(value.user_id){
                var param = {
                    user_id:value.user_id
                };
                
                QN.fetch(DateAPi.httphost+'/getLuckilyPlan', {
                  
                    method: 'POST',
                    mode: 'cors',
                    dataType: 'json',
                    body:QN.uri.toQueryString(param)
                })
                .then(response => {     
                    return response.json(); // => 返回一个 `Promise` 对象
                })
                .then(data => {
                    resolve(data);
                })
                .catch(error => {
                    resolve(error);
                });
            }else{
                 Modal.toast("对不起，您还不是dsp注册用户");
            }     
        });
    });
}

/*
* 反馈
*/
export function getFeedback(content){
    return new Promise((resolve, reject) => {
         getLocalstoreUser().then((res)=>{
            var param = {
                    id: res.taobao_user_id,
                    content:content
                };
                
                QN.fetch(DateAPi.httphost+'/save_feedback/', {
                  
                    method: 'POST',
                    mode: 'cors',
                    dataType: 'json',
                    body:QN.uri.toQueryString(param)
                })
                .then(response => {     
                    return response.json(); // => 返回一个 `Promise` 对象
                })
                .then(data => {
                      Modal.toast('感谢您的留言，我们将尽快给您反馈。');
                })
                .catch(error => {
                    Modal.toast(JSON.stringify(error));
                });  
         });
                
        });
}

/*
* 打开在线聊天
*/
export function onlineChat(){
        QN.app.invoke({
        api: 'openChat',         // 通用协议接口名称
            query: {                 // 请求参数
                nick : 'tp_喜宝'  ,
                 text : '你好'  
            }
        }).then(result => {
           
        }, error => {
            
        });
}