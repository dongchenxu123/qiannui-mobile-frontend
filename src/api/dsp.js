'use strict';

import QN from 'QAP-SDK';
import * as DateAPi from './date';
import {checkAPIError} from './checkerror';
import { Modal } from 'nuke';
import {getLocalstoreUser} from './authsign';
import {createNewDspUser} from './profile';
import {getOnsaleItem} from  './onsale-item'

var app = app || {}; 
app.user_id = '';
app.telephone = true; //标记淘外引流页面 是否弹出手机号窗口
export function checkIssetDspUser(){
    return new Promise((resolve, reject) => {
            getLocalstoreUser().then((res)=>{
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
export function getDspUserMarket(type){
    return new Promise((resolve, reject) => {

         checkIssetDspUser().then((value) => {
          
            if(value.user_id){

                QN.fetch(DateAPi.httphost+'/getUser', {
                  
                    method: 'POST',
                    mode: 'cors',
                    dataType: 'json',
                    body:"user_id="+ value.user_id+'&type='+type
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



            }
           
          });
    });
}

/*
* 检测dsp用户是否添加了手机号  dsp 用户基本信息 
*/
export function getUserInfo(tel,type){
    return new Promise((resolve, reject) => {
        checkIssetDspUser.then((value) => {
            if(value.user_id){
                var param = {
                    user_id:value.user_id
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
                    Modal.toast(JSON.stringify(error));
                });
            }else{
                 Modal.toast("对不起，您还不是dsp注册用户");
            }    
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
       
            if(result.length > 0 ){
             
                getDspUserMarket(3).then((data) => {
                    var dsp_item =data.Items;
                   var a2  = [];
                   result.forEach(function(value, index, array) {
                            if(value.img_url == undefined){
                                value.img_url = value.pic_url +'_150x150.jpg';
                            }
                            if(dsp_item.length >0){
                                if(array[index].dsp_onLineStatus == undefined ){
                                    array[index].dsp_onLineStatus = 0;
                                }

                                dsp_item.forEach(function(v, i, a) {
                                    if(v.item_id ==  value.num_iid){
                                        array[index].dsp_onLineStatus = 1;
                                    }
                                });
                            }   

                            if(q != ''){
                                if(value['title'].includes(q)){

                                }
                            } 
                    });
                    resolve(result);
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
                  resolve(JSON.parse(data));                
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
                  resolve(JSON.parse(data));                
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
                    resolve(JSON.parse(data));
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
                    resolve(JSON.parse(data));
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
