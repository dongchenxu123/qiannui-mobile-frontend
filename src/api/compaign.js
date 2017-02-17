'use strict';
import QN from 'QAP-SDK';
import * as DateAPi from './date'
import { Modal } from 'nuke';
import Async from 'async';
import _ from 'lodash';
import {checkAPIError} from './checkerror';

function makeFunc(subway_token,compaign){
    return function(callback){
        getCompaignReport(subway_token,compaign).then((result) => {
            callback(null,result);
        }, (error) => {  
               callback(error,null);
        }); 
    }
}

export function getCampaign(subway_token){
      return new Promise((resolve, reject) => {
        QN.top.invoke({
            query: {
                method: 'taobao.simba.campaigns.get', // TOP 接口名称
            }
        }).then((result)=>{
            var campignArr = [],data = [];
            var compaign = result.simba_campaigns_get_response.campaigns.campaign;
            if(compaign.length > 0){
                for (var j in  compaign){
                    campignArr.push(makeFunc(subway_token,compaign[j]));
                }
                Async.parallelLimit(campignArr,5,  function (err, res) {
                    if(err == null){
                        data = _.sortBy(res, [function(o) { return o.campaign_id;}]);
                    }
                    resolve(data);
                });
            }
        },(error)=>{
            return error.error_response;
        })
        .catch(error=>{
            Modal.toast(error);
        }); 
    })  
}

export function getCompaignReport(subway_token,compaingn){

     return new Promise((resolve, reject) => {
        var ca = compaingn;
        return QN.top.batch({
                    query: [
                        {
                            method:'taobao.simba.campaign.budget.get',
                            fields:'campaign_id',
                            campaign_id:ca.campaign_id
                        }, {
                            method:'taobao.simba.rpt.campaignbase.get',
                            fields:'subway_token,start_time,end_time,campaign_id,source,search_type',
                            campaign_id: ca.campaign_id,
                            subway_token: subway_token,
                            start_time:DateAPi.formatDate(DateAPi.yesterday),
                            end_time:DateAPi.formatDate(DateAPi.yesterday),
                            source:'SUMMARY',
                            search_type:'SEARCH' 
                        },{
                            method:'taobao.simba.rpt.campaigneffect.get',
                            fields:'subway_token,start_time,end_time,campaign_id,source,search_type',
                            campaign_id: ca.campaign_id,
                            subway_token: subway_token,
                            start_time:DateAPi.formatDate(DateAPi.yesterday),
                            end_time:DateAPi.formatDate(DateAPi.yesterday),
                            source:'SUMMARY',
                            search_type:'SEARCH' 
                        }
                    ]
                }).then(result => {
                    var rpt = {};

                    if(result.length === 3){
                    	var budget = result[0].simba_campaign_budget_get_response != undefined && result[0].simba_campaign_budget_get_response.campaign_budget != undefined ? result[0].simba_campaign_budget_get_response.campaign_budget : '';
                        var baseData = result[1].simba_rpt_campaignbase_get_response != undefined ? result[1].simba_rpt_campaignbase_get_response.rpt_campaign_base_list :[];
                        var effectData =  result[2].simba_rpt_campaigneffect_get_response != undefined ? result[2].simba_rpt_campaigneffect_get_response.rpt_campaign_effect_list :[];
                        rpt =  formatRptData(baseData, effectData);
                        rpt.budget = budget.budget;
                        rpt.is_smooth = budget.is_smooth;
                        rpt.campaign_id = ca.campaign_id;
                        rpt.title = ca.title;
                        rpt.online_status = ca.online_status;
                        resolve(rpt);
                    }else{
                        resolve(rpt);
                    }
                }, error => {
                    reject(error);
                });   
     });
}

/*
* 设置计划日限额
* new_budget 新的日限额
*/
export function setBuget(campaign_id,new_budget,is_smooth = 'true'){
    return QN.top.invoke({
            query: {
                method: 'taobao.simba.campaign.budget.update', 
                fields: 'campaign_id,use_smooth',
                campaign_id: campaign_id,
                budget:new_budget,
                use_smooth:is_smooth
            }
        }).then((result)=>{
            return result.simba_campaign_budget_update_response.campaign_budget.budget;        
        },(error)=>{
            return error.error_response;
        })
        .catch(error=>{
            Modal.toast(error);
        });  
}

/*
* 设置计划推广状态 offline-下线；online-上线；
*/
export function setStatus(campaign_id,title,newstatus){
    return QN.top.invoke({
            query: {
                method: 'taobao.simba.campaign.update', 
                fields: 'campaign_id,title,online_status',
                campaign_id: campaign_id,
                title: title,
                online_status:newstatus
            }
        }).then((result)=>{
            return result.simba_campaign_update_response.campaign;        
        },(error)=>{
            return error.error_response;
        })
        .catch(error=>{
            Modal.toast(error);
        });  
}
/*
* 取得一个推广计划的分时折扣设置
*/
export function getSchedule(campaign_id){
     return QN.top.invoke({
            query: {
                method: 'taobao.simba.campaign.schedule.get', 
                fields: 'campaign_id',
                campaign_id: campaign_id  
            }
        }).then((result)=>{
            return result.simba_campaign_schedule_get_response.campaign_schedule;        
        },(error)=>{
            return error.error_response;
        })
        .catch(error=>{
            Modal.toast(error);
        }); 
}

/*
 *   设置计划分时时段
*/
export function setSchedule(campaign_id,val){
    return QN.top.invoke({
            query: {
                method:'taobao.simba.campaign.schedule.update',
                fields:'campaign_id,schedule',
                campaign_id:campaign_id,
                schedule:val 
            }
        }).then((result)=>{
            var data = '';
             if(checkAPIError(result) == null){
                data = result.simba_campaign_schedule_update_response.campaign_schedule;  
             }
             return  data;      
        },(error)=>{
            return error.error_response;
        })
        .catch(error=>{
            Modal.toast(error);
        }); 
}

/*
* 获取投放区域
*/
export function getArea(campaign_id){
    return QN.top.invoke({
            query: {
                method:'taobao.simba.campaign.area.get',
                fields:'campaign_id',
                campaign_id:campaign_id
            }
        }).then((result)=>{
            return result.simba_campaign_area_get_response.campaign_area;        
        },(error)=>{
           return error.error_response;
        })
        .catch(error=>{
            Modal.toast(error);
        }); 
}
/*
* 设置投放区域
* val 区域id 数组
*/
export function setArea(campaign_id,val){
    return QN.top.invoke({
            query: {
                method:'taobao.simba.campaign.area.update',
                fields:'campaign_id,area',
                campaign_id:campaign_id,
                area:val.join(',')
            }
        }).then((result)=>{
            return result.simba_campaign_area_update_response.campaign_area;        
        },(error)=>{
            return error.error_response;
        })
        .catch(error=>{
            Modal.toast(error);
        }); 
}
/*
* 获取计划的投放平台设置
* campaign_id 计划id
*/
export function getPlatfrom(campaign_id){
    return QN.top.invoke({
            query: {
                method:'taobao.simba.campaign.platform.get',
                fields:'campaign_id',
            campaign_id:campaign_id
            }
        }).then((result)=>{
            return result.simba_campaign_platform_get_response.campaign_platform;        
        },(error)=>{
            return error.error_response;
        })
        .catch(error=>{
            Modal.toast(error);
        }); 
}

/*
* 设置计划的投放平台设置
* obj = {campaign_id = '', 
    search_channels = [],
    nonsearch_channels = [],
    outside_discount ='', 
    mobile_discount = ''
    }
*/
export function setPlatfrom(obj){


        var fields = 'campaign_id,search_channels,outside_discount,mobile_discount';
        if(obj.nonsearch_channels.length >0 ){
            fields = fields +' ,nonsearch_channels';
        }
        var param =  {
                method:'taobao.simba.campaign.platform.update',
                fields:fields,
                campaign_id:obj.campaign_id,
                search_channels:obj.search_channels.join(','),
                outside_discount:obj.outside_discount,
                mobile_discount:obj.mobile_discount
            }
           if(obj.nonsearch_channels.length >0 ){
            param.nonsearch_channels =obj.nonsearch_channels.join(',')
        }
     return QN.top.invoke({
            query: param
        }).then((result)=>{
            return result.simba_campaign_platform_update_response.campaign_platform;        
        },(error)=>{
            return error.error_response;
        })
        .catch(error=>{
            Modal.toast(error);
        }); 
}
function formatRptData(objbase, objeffect){
    var dateData={pv:0,click:0,cost:0.00,ctr:0.00,pay:0.00,payCount:0,ROI:0,favcount:0,click_ROi:0};

    //基础数据
    if(objbase.length > 0)
    {
        for(var i in objbase)
        {
            dateData.pv += objbase[i].impressions ? parseInt(objbase[i].impressions):0;
            dateData.click += objbase[i].click ? parseInt(objbase[i].click):0;
            dateData.cost += objbase[i].cost ? parseInt(objbase[i].cost):0.00;

            if(parseInt(i)+1 === objbase.length)
            {
                dateData.ctr = (dateData.pv === 0 )? 0.00 :parseFloat( dateData. click/dateData.pv *100 ).toFixed(2)  ;//点击率
                dateData.cost = parseFloat(dateData.cost/100).toFixed(2);
            }
        }
    }

    //效果数据
    if(objeffect.length>0)
    {
        for(var j in objeffect)
        {
            dateData.pay += (objeffect[j].indirectpay ? parseInt(objeffect[j].indirectpay):0.00)+ (objeffect[j].directpay ? parseInt(objeffect[j].directpay):0.00);//成交金额
            dateData.payCount += parseInt(objeffect[j].indirectpaycount ? objeffect[j].indirectpaycount:0) + parseInt(objeffect[j].directpaycount ? objeffect[j].directpaycount:0);
            dateData.favcount += parseInt(objeffect[j].favItemCount ? objeffect[j].favItemCount :0) + parseInt(objeffect[j].favShopCount ? objeffect[j].favShopCount :0);
        }

        if(parseInt(j)+1 === objeffect.length)
        {
            dateData.click_ROi = (dateData.click === 0) ? 0.00 :(parseFloat(dateData.payCount /dateData.click * 100).toFixed(2)); //转化率
            dateData.pay = parseFloat(dateData.pay /100).toFixed(2);
            dateData.ROI = (parseInt(dateData.cost) === 0) ? 0 :(dateData.pay / dateData.cost)  ;
        }
    }
    return dateData;
}