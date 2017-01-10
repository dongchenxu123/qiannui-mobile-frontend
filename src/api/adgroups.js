'use strict';

import QN from 'QAP-SDK';
import * as DateAPi from './date';
import {checkAPIError} from './checkerror';
import { Modal } from 'nuke';
import {getOnsaleItem} from './onsale-item';

export function getUnSaleItem(campaign_id){
    var data = [];
     return new Promise((resolve, reject) => {

        getOnsaleItem().then((result) => {
            
           ifAdgroupExist(campaign_id,result).then((data) => {
                        resolve(data);   
                    }).catch(err => {
                        reject(err);
                    });
           
        }, (error) => {
        
        });
     });
}


function ifAdgroupExist(campaign_id,result){
    var data= [];

    return new Promise((resolve, reject) => {
           result.forEach(function (item, index, array) {
                (function (ci,item) {
                   
                    return  QN.top.invoke({
                                query: {
                                    method:'taobao.simba.adgroups.item.exist',
                                    fields:'campaign_id,item_id',
                                    campaign_id:campaign_id,
                                    item_id:item.num_iid
                                }
                            }).then((result)=>{
                               
                                if(result.simba_adgroups_item_exist_response != undefined && result.simba_adgroups_item_exist_response.exist == false){
                                    data.push(item);
                                }

                                if(parseInt(ci+1) == array.length){
                                    resolve(data); 
                                }
                            })
                            .catch(error=>{
                                    resolve(data);   
                            });


                })(index,item)
           });

    })
}


/*
        获取一个计划下的所有的推广组
*/
function getAdgroups(campaign_id){
    return new Promise((resolve, reject) => {
        QN.top.invoke({
            query: {
                method:'taobao.simba.adgroupsbycampaignid.get',
                    fields:'campaign_id,page_size,page_no',
                    campaign_id:campaign_id,
                    page_size:1,
                    page_no:0
            }
        }).then((result)=>{
                var data = [];
                var dataNum = parseInt(result.items_onsale_get_response.total_results);
                if(dataNum > 0){

                    getOnsaleItem_sign(dataNum).then((data) => {
                            resolve(data);
                             Modal.alert(JSON.stringify(data));
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
                    start_time: DateAPi.formatDate(DateAPi.lastMonth),
                    end_time:DateAPi.formatDate(DateAPi.yesterday),
                    source:'SUMMARY',
                    search_type:'SUMMARY',
                    page_size:page_size,
                    page_no:page
                },{
                    method:'taobao.simba.rpt.campadgroupeffect.get',
                    fields:'subway_token,start_time,end_time,campaign_id,source,search_type,page_no,page_size',
                    subway_token:subway_token,
                    campaign_id:campaign_id,
                    start_time: DateAPi.formatDate(DateAPi.lastMonth),
                    end_time:DateAPi.formatDate(DateAPi.yesterday), //todo 需要改变日期
                    source:'SUMMARY',
                    search_type:'SUMMARY',
                    page_size:page_size,
                    page_no:page 
                }
            ]
        }).then(result => {
            var rpt = {};
            var data = [];
            if(result.length === 3){

                var adgroups = result[0].simba_adgroupsbycampaignid_get_response.adgroups.adgroup_list.a_d_group;
                var baseData = result[1].simba_rpt_campadgroupbase_get_response.rpt_campadgroup_base_list;
                var effectData = result[2].simba_rpt_campadgroupeffect_get_response.rpt_campadgroup_effect_list;
                
                if(baseData.code && baseData.sub_code){
                    return baseData.sub_msg;
                }
                 data = AdgroupRptFormat(adgroups,baseData,effectData); 
            } 
            return data; 
        }, error => {
            Modal.toast(error);
        });
}

function AdgroupRptFormat(adgroups,baserpt,effectrpt){

    var ba={}, ef={};

    if(baserpt.length >0)
    {
        for(var i in baserpt)
        {
            if(ba[baserpt[i].adgroupId] === undefined ){
               ba[baserpt[i].adgroupId] = baserpt[i] ;
            }
        }
    }

    if(effectrpt.length >0)
    {
        for(var j in effectrpt)
        {
            if(ef[effectrpt[j].adgroupId] === undefined )
            {
                ef[effectrpt[j].adgroupId] = effectrpt[j] ;
            }
        }
    }

    if(adgroups.length >0)
    {
        for(var t in adgroups)
        {
            var adgroup_id = adgroups[t].adgroup_id;
            if(adgroups[t].report === undefined)
            {
                adgroups[t].report = {
                    click:0,
                    cost:0,
                    pv:0,
                    pay:0,
                    payCount:0,
                    favcount:0
                };
            }
            if(ba[adgroup_id])
            {
                adgroups[t].report.click += parseInt(ba[adgroup_id].click);
                adgroups[t].report.cost += parseInt(ba[adgroup_id].cost);
                adgroups[t].report.pv += parseInt(ba[adgroup_id].impressions);
            }

            if(ef[adgroup_id])
            {
                adgroups[t].report.pay += (ef[adgroup_id].indirectpay ? parseInt(ef[adgroup_id].indirectpay):0)+ (ef[adgroup_id].directpay ? parseInt(ef[adgroup_id].directpay):0);
                adgroups[t].report.payCount += parseInt(ef[adgroup_id].indirectpaycount ? ef[adgroup_id].indirectpaycount:0) + parseInt(ef[adgroup_id].directpaycount ? ef[adgroup_id].directpaycount:0);
                adgroups[t].report.favcount += parseInt(ef[adgroup_id].favItemCount ? ef[adgroup_id].favItemCount :0) + parseInt(ef[adgroup_id].favShopCount ? ef[adgroup_id].favShopCount :0);
            }
        }
    }

    return adgroups;
}

export function deleteAdgroup(adgroup_id){
    return QN.top.invoke({
            query: {
                method: 'taobao.simba.adgroup.delete', 
                fields:'adgroup_id',
                adgroup_id:adgroup_id
            }
        }).then((result)=>{
            var error = null;
           // error = checkAPIError(result);
            if(null == error)
            {
                return {code:0,data:result.simba_adgroup_delete_response.adgroup};
            }else
            {
                return error;
            }
        }).catch(error=>{
            Modal.toast(JSON.stringify(error));
        }); 
}

export function updateAdgroup(adgroup_id,statusnew){
    var status = (statusnew ==='online')?'offline':'online';
    return QN.top.invoke({
            query: {
                method: 'taobao.simba.adgroup.update', 
                fields:'adgroup_id,online_status',
                adgroup_id:adgroup_id,
                online_status:status
            }
        }).then((result)=>{
        
            var error = null;
           // error = checkAPIError(result);
           
            if(null == error)
            {
                return {code:0,data:result.simba_adgroup_update_response.adgroup};
            }else
            {
                return error;
            }
        }).catch(error=>{
            Modal.toast(JSON.stringify(error));
        }); 
}

export function addAdgroup(campaign_id,num_iid,title,img_url){
    
    return QN.top.invoke({
            query: {
                method: 'taobao.simba.adgroup.add', 
                fields:'campaign_id,item_id,default_price,title,img_url',
                campaign_id:campaign_id,
                item_id:num_iid,
                default_price:5,
                title:title,
                img_url:img_url
            }
        }).then((result)=>{
       
            var error = null;
            error = checkAPIError(result);
           
            if(null == error)
            {
                return {code:0,data:result.simba_adgroup_add_response.adgroup};
            }else
            {
                return error;
            }
        }).catch(error=>{
            Modal.toast(JSON.stringify(error));
        }); 
}

