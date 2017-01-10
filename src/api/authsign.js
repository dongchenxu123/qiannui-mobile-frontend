'use strict';
import QN from 'QAP-SDK';
import APIError from './checkerror';
import { Tabbar, Button, Icon, ListView, Iconfont, Modal } from 'nuke';
var key_name = 'subway_token';

// 还需要检查一下token过期时间
export function getAuthSign(){

    return  QN.sessionstore.get({
        query: {
            key: 'subway_token'
        },
        success(result) {
                return result;
        },
        error(error) {
          
        }
    }).then((result)=>{
 
        if(result.data && result.data.subway_token){
            return result.data.subway_token;
        }else{
               return getSign().then((result)=>{ //获取subway_token
                    storeSubwayToken(result); // 存储stoken
                    return result;
                });  
             }      
    });
}
function getSign(){
    return  QN.top.invoke({
            query: {
                 method:'taobao.simba.login.authsign.get'
            }
        }).then((result)=>{
            return result.simba_login_authsign_get_response.subway_token;
        })
        .catch(error => {
           return false;
        });
}
function storeSubwayToken(val){
    QN.sessionstore.set({
        query: {
                subway_token: val
            },
        success(result) {
          
        },
        error(error) {
           
            }
    }).then(result => {
       
    }, error => {
        
    });
}


export function localstoreUser(obj){
    return QN.localstore.set({
        query: {userInfo:obj},
        success(result) {
           
        },
        error(error) {
           
        }
    }).then(result => {
        return result;
    }, error => {
        
    });
}
/*
* 获取登陆用户基本信息
*/
export function getLocalstoreUser(){
    return QN.localstore.get({
        query: {
            key: 'userInfo'
        },
        success(result) {
           
        },
        error(error) {
           
        }
    }).then(result => {
        if(result.code == "QAP_SUCCESS" && result.data){
            return result.data.userInfo;
        }
    }, error => {
       Modal.toast(error);
    });
}



