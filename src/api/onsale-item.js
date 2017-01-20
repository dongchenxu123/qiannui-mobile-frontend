'use strict';

import QN from 'QAP-SDK';
import * as DateAPi from './date';
import {checkAPIError} from './checkerror';
import { Modal } from 'nuke';

var is_complete = false;

export function getOnsaleItem(){
    return new Promise((resolve, reject) => {
        QN.top.invoke({
            query: {
                method:'taobao.items.onsale.get',
                fields:'pic_url,price,num_iid,title,num,cid',
                page_no:1,
                page_size:1
            }
        }).then((result)=>{
                var data = [];
                var dataNum = parseInt(result.items_onsale_get_response.total_results);
                if(dataNum > 0){

                    getOnsaleItem_sign(dataNum).then((data) => {
                            resolve(data);
                        }).catch(err => {
                            reject(err);
                        });

                }else{
                    resolve(data);
                }     
        }) 
        .catch(error=>{

        });
   })           

}

function getOnsaleItem_sign(dataNum){  
     var data= [];
     var page_size = 2;
     var len = Math.ceil(dataNum / page_size);

    return new Promise((resolve, reject) => {

        for (var i=1; i<=len; i++){
            (function (ci) {
                
                return QN.top.invoke({
                    query: {
                        method:'taobao.items.onsale.get',
                        fields:'pic_url,price,num_iid,title,num,cid',
                        page_no:ci,
                        page_size:page_size
                    }
                }).then((result)=>{  
                  
                    if(result.items_onsale_get_response.items == undefined){
                        resolve(data); 
                    } 
                    var response = result.items_onsale_get_response.items.item;
                    if(response.length > 0 ){
                         response.forEach(v => {
                                   data.push(v);
                                    });
                        if(ci == len){
                            resolve(data);
                        }
                    }else{
                        resolve(data);
                    }
                })
                .catch(error=>{
                }); 
            })(i)        
        }
    });
}