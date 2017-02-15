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
            console.log(JSON.stringify(getCampaign),'')
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
                        var budget = result[0].simba_campaign_budget_get_response.campaign_budget;
                        var baseData = result[1].simba_rpt_campaignbase_get_response != undefined ? result[1].simba_rpt_campaignbase_get_response.rpt_campaign_base_list :[];
                        var effectData =  result[2].simba_rpt_campaigneffect_get_response != undefined ? result[2].simba_rpt_campaigneffect_get_response.rpt_campaign_effect_list :[];
                        rpt =  formatRptData(baseData, effectData);
                        rpt.budget = budget.budget;
                        rpt.is_smooth = budget.is_smooth;
                        rpt.campaign_id = ca.campaign_id;
                        rpt.title = ca.title;
                        rpt.online_status = ca.online_status;
    