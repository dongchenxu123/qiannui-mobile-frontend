'use strict';
import QN from 'QAP-SDK';
import APIError from './checkerror';

var app = app || {} ;
var date = new Date();
const yesterday = [date.getFullYear(), date.getMonth() +1,date.getDate() -1].join('-');
 date = new Date();
const today = [date.getFullYear(), date.getMonth() +1,date.getDate()].join('-');
date = new Date();
const threedaysAgo = [date.getFullYear(), date.getMonth() +1,date.getDate() -3].join('-');
date = new Date();
const lastWeek = [date.getFullYear(), date.getMonth() +1,date.getDate() -7].join('-');
date = new Date();
const lastMonth = [date.getFullYear(), date.getMonth(),date.getDate()].join('-');

/*
获取卖家基本信息
*/
export function getSellerUser(){
    return QN.top.invoke({
            query: {
                method: 'taobao.user.seller.get', // TOP 接口名称
                fields: 'nick,sex'                // 除了`method`字段外，其他字段为请求的业务参数
            }
        }).then((result)=>{
             return  result.user_seller_get_response.user;
        })
        .catch(error=>{
            Modal.toast(error);
        });  
}


export function getUserInfo(){
    return QN.user.getInfo()
            .then((result)=>{
                  var isSub = 'false';
                   if(result.sub_user_id){ //sub_user_id淘宝子账号对应id
                        isSub = 'true';
                    }
               return result;     
            })
            .catch(error=>{
                Modal.toast(error);
            });
            
}

export function getProfileBalance(){
    return QN.top.invoke({
            query: {
                 method:'taobao.simba.account.balance.get'
            }
        }).then((result)=>{
            return result.simba_account_balance_get_response.balance;
        })
        .catch(error => {
            Modal.toast(error);
        });  
}

export function getProfileReport(){
    return QN.top.batch({
            query: [
                {
                    method:'taobao.simba.rpt.custbase.get',
                    fields:'start_time,end_time,subway_token,source',
                    start_time:lastMonth, //todo 需要改成最近一周
                    end_time:yesterday,
                    subway_token:app.subway_token,
                    source:'SUMMARY'
                }, {
                    method:'taobao.simba.rpt.custeffect.get',
                    fields:'start_time,end_time,subway_token,source',
                    start_time:lastMonth,//todo 需要改成最近一周
                    end_time:yesterday,
                    subway_token:app.subway_token,
                    source:'SUMMARY'
                }
            ]
        }).then(result => {
           /* var baseData = result[0].simba_rpt_custbase_get_response.rpt_cust_base_list;
            var effect = result[1].simba_rpt_custeffect_get_response.rpt_cust_effect_list;*/
            return formatbaseData();
            //return result;
        }, error => {
            Modal.toast(error);
        });
}

  /**
     * 格式化数据
     * @returns {{}}
     */
    function formatbaseData ()
    {
        var daysago = {pv:0,click:0,paycount:0,cost:0,click_ROi:0,cpc:0,pay:0,favcount:0,ROI:0,ctr:0};         
        return daysago;
    }