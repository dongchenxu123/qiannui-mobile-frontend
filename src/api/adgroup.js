'use strict';

import QN from 'QAP-SDK';
import * as DateAPi from './date';
import { Tabbar, Button, Icon, ListView, Iconfont, Modal } from 'nuke';

/*
* 需要先将所有在售的宝贝取出来 因为已经推广的宝贝要显示在前面
*/

export function getOnsaleItem (page){
    var page_no = page > 1 ? page : 1;
    var page_size = 200;
    QN.top.invoke({
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
                localstore('onLineItem',response).then((result)=>{
                     Modal.alert(JSON.stringify(result)); 
                });
                let getData = getLocalstore('onLineItem');
                   Modal.alert(JSON.stringify(res));
 /*
                if(res){
                    page_no = page_no+1;
                    let totalpage = Math.ceil(dataNum / page_size);

                    if(totalpage >= page_no)
                    {
                        setTimeout(function(){
                            getOnsaleItem(title_seach,page_no,callback);
                        },100);
                    }else
                    {
                       return;
                    }
                }*/
            }
    })
    .catch(error=>{
        Modal.toast(error);
    });  
}
function localstore(key,val){
    return QN.database.execSql({
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

function getLocalstore(key){
    QN.database.execSql({
      query: {
        sql: ['select * from OnlineItems limit 1'],
      },
      success(result) {
    
      },
      error(error) {
        console.log('[ERROR]', error);
      },
    }).then((result) => {
      console.log('[RESOLVE]', result);
      
    }, (error) => {
      console.log('[REJECT]', error);
    });

}
export function getOnsaleItems (page){
    var page_no = page > 1 ? page : 1;
    var page_size = 200;
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


export function getAdgroupsByCid(subway_token,campaign_id,page_no){
    var page = page_no > 0 ? page_no : 1,
        page_size = 200;
    return QN.top.batch({
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
                    start_time: DateAPi.yesterday,
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
                    start_time: DateAPi.yesterday,
                    end_time:DateAPi.yesterday,
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
                //rpt =  formatRptData(baseData, effectData);
                //rpt.budget = budget.budget;
                //rpt.is_smooth = budget.is_smooth; 
                return result; 
               
            }
        }, error => {
            Modal.toast(error);
        });
}