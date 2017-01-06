'use strict';

import QN from 'QAP-SDK';
import * as DateAPi from './date';
import { Modal } from 'nuke';

/*
* 需要先将所有在售的宝贝取出来 因为已经推广的宝贝要显示在前面
*/

export var is_complete = false;

export function getOnsaleItem(){
    var page = 1;
    //判断一下数据表里面是否有数 有数则直接返回
    var items = function(){
             getOnsaleItem_sign(page).then((result)=>{

                if(result == false){
                    is_complete = true;
                }else{
                    page ++;
                    items();
                }
            });
    }
    items();
}


function getOnsaleItem_sign (page){  
    var page_no = page >0 ? page : 1;
    var page_size = 2;
    return QN.top.invoke({
        query: {
            method:'taobao.items.onsale.get',
            fields:'pic_url,price,num_iid,title,num,cid',
            page_no:page_no,
            page_size:page_size
        }
    }).then((result)=>{
            
        var dataNum = parseInt(result.items_onsale_get_response.total_results);
       
        if(result.items_onsale_get_response.items == undefined){
           return false; 
        } 
        var response = result.items_onsale_get_response.items.item;
        if(response != undefined && response.length > 0 ){
            if(response.length == page_size){
                localstore(response);
                return response;

            }else{
                 return false;
            }  
        }else{
            return false;
        }
    })
    .catch(error=>{
    }); 
}


export function getAdgroupsByCid(subway_token,campaign_id,page_no){
    var page = page_no > 0 ? page_no : 1,
        page_size = 200;
createAdgroupDatabase();
getLocalstoreAdgroups().then((result)=>{
                        Modal.alert(JSON.stringify(result));
                      });
  /*QN.database.execSql({
    query: {
      sql: 'delete from adgroups',
    },
    success(result) {
       Modal.alert(JSON.stringify(result));
    },
    error(error) {
       Modal.alert(JSON.stringify(error));
    },
  }).then((result) => {
    Modal.alert(JSON.stringify(result));
  }, (error) => {
     Modal.alert(JSON.stringify(error));
  });*/
 


 /* return QN.top.batch({
            query: [
                {
                    method:'taobao.simba.adgroupsbycampaignid.get',
                    fields:'campaign_id,page_size,page_no',
                    campaign_id:campaign_id,
                    page_size:page_size,
                    page_no:page
                }, {
                    method:'taobao.simba.rpt.campadgroupbase.get',
                    fields:'subway_token,start_time,end_time,campaign_id,source,search_type,page_no,page_size',
                    subway_token:subway_token,
                    campaign_id:campaign_id,
                    start_time: DateAPi.lastMonth,
                    end_time:DateAPi.yesterday,
                    source:'SUMMARY',
                    search_type:'SUMMARY',
                    page_size:page_size,
                    page_no:page
                },{
                    method:'taobao.simba.rpt.campadgroupeffect.get',
                    fields:'subway_token,start_time,end_time,campaign_id,source,search_type,page_no,page_size',
                    subway_token:subway_token,
                    campaign_id:campaign_id,
                    start_time: DateAPi.lastMonth,
                    end_time:DateAPi.yesterday, //todo 需要改变日期
                    source:'SUMMARY',
                    search_type:'SUMMARY',
                    page_size:page_size,
                    page_no:page 
                }
            ]
        }).then(result => {
            var rpt = {};
           
            if(result.length === 3){

                var adgroups = result[0].simba_adgroupsbycampaignid_get_response.adgroups.adgroup_list.a_d_group;
                var baseData = result[1].simba_rpt_campadgroupbase_get_response.rpt_campadgroup_base_list;
                var effectData = result[2].simba_rpt_campadgroupeffect_get_response.rpt_campadgroup_effect_list;
                

                if(baseData.code && baseData.sub_code){
                    return baseData.sub_msg;
                }


                var res = {adgroup:adgroups,baseData:baseData,effectData:effectData};
                 
                 localstoreAdgroups(adgroups);
                   getLocalstoreAdgroups().then((result)=>{
                        Modal.alert(JSON.stringify(result));
                      });
                
                   
            }
        }, error => {
            Modal.toast(error);
        });*/
}



function localstore(val){
     QN.database.execSql({
      query: {
        sql: 'CREATE TABLE IF NOT EXISTS OnlineItems(id integer PRIMARY KEY AUTOINCREMENT,num_iid varchar,num int, title varchar,price float,pic_url varchar,cid,varchar,img_url varchar,props varchar)',
      },
      success(result) {
        if(result.result == 'success'){
            for(let i=0;i<val.length;i++){
                QN.database.execSql({
                  query: {
                    sql: ['INSERT INTO OnlineItems (num_iid,num,title,price,pic_url,cid,img_url,props) VALUES (?,?,?,?,?,?,?,?)', [val[i].num_iid, val[i].num, val[i].title,val[i].price,val[i].pic_url, val[i].cid,val[i].img_url,val[i].props]],
                  },
                  success(result) {
                    
                  },
                  error(error) {
                   
                  },
                });
            }     
        }
      },
      error(error) {
        console.log('[ERROR]', error);
      }
    }).then((result)=>{
        return result.result;
    });
}

function localstoreAdgroups(adgroups){
 
   for(let i= 0;i<adgroups.length;i++){
     
        QN.database.execSql({
          query: {
            sql: ['INSERT INTO adgroups (campaign_id,adgroup_id,category_ids,num_iid,default_price,img_url,online_status,item_price,title) VALUES (?,?,?,?,?,?,?,?,?)',
             [adgroups[i].campaign_id, adgroups[i].adgroup_id, adgroups[i].category_ids,adgroups[i].num_iid,adgroups[i].default_price,adgroups[i].img_url,adgroups[i].online_status,adgroups[i].item_price,adgroups[i].title]],
          },
          success(result) {
             //Modal.alert(JSON.stringify(result));
          },
          error(error) {
            Modal.alert(JSON.stringify(error));
          },
        });
   }
}

function getLocalstoreAdgroups(){
   return QN.database.execSql({
          query: {
                sql: ['select * from adgroups']
            },
          success(result) {
            return result;
          },
          error(error) {
            Modal.alert(JSON.stringify(error));
          },
        });
}
 function createAdgroupDatabase(){

    QN.database.execSql({
      query: {
        sql:'CREATE TABLE IF NOT EXISTS adgroups(id integer PRIMARY KEY AUTOINCREMENT,campaign_id int,adgroup_id int,num_iid int,item_price float,title varchar,img_url varchar,category_ids varchar,default_price int,'+ 
                    'nick varchar,online_status varchar)'    
            
      },
      success(result) {
            // Modal.alert(JSON.stringify(result)); 
      },
      error(error) {
         
      }
    });
}



function getLocalstore(){
    return QN.database.execSql({
      query: {
        sql: ['select * from OnlineItems '],
      },
      success(result) {
        return result;
        
      },
      error(error) {
        
      },
    });

}
export function getOnsaleItems (page){
    var page_no = page > 1 ? page : 1;
    var page_size = 2;
    return QN.top.invoke({
            query: {
                method:'taobao.items.onsale.get',
                fields:'pic_url,price,num_iid,title,num,cid',
                page_no:page_no,
                page_size:page_size
            }
        }).then((result)=>{
                
                var dataNum = parseInt(result.items_onsale_get_response.total_results);
                if(dataNum ===0 && page_no ===1){
                   return; 
                }
                 if(dataNum > 0){
                     var response = result.items_onsale_get_response.items.item;
                     return response;
                }
        })
        .catch(error=>{
            Modal.toast(error);
        });  
}



export function deleteItems(){
    
    return QN.database.execSql({
      query: {
        sql: 'delete from OnlineItems'             
      },
      success(result) {
        return result;
      },
      error(error) {

      },
    }).then((result) => {
      return result;
    }, (error) => {
      
    });

}