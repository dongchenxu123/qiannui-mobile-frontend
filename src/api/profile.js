'use strict';
import QN from 'QAP-SDK';
import { checkAPIError } from './checkerror';
import * as DateAPi from './date';
import {Modal } from 'nuke';
import {getLocalstoreUser} from './authsign';
/*
获取卖家基本信息
*/
export function getSellerUser(){
    return QN.top.invoke({
            query: {
                method: 'taobao.user.seller.get', 
                fields: 'seller_credit,type,avatar, user_id'               
            }
        }).then((result)=>{
             return  result.user_seller_get_response.user;
        })
        .catch(error=>{
            Modal.toast(error);
        });  
}

export function createNewDspUser(){

     return new Promise((resolve, reject) => {
       getLocalstoreUser().then((result) => {
            var isSub = 'false';
            if(result.sub_taobao_user_id){ //sub_taobao_user_id淘宝子账号对应id
                    isSub = 'true';
            } 
            var user ={
                        is_sub:isSub,
                        nick:result.taobao_user_nick,
                        ts:new Date().getTime(),
                        top_session:result.access_token,
                        refresh_token:result.refresh_token,
                        r1_expires_in:result.r1_expires_in,
                        r2_expires_in:result.r2_expires_in, 
                        w1_expires_in:result.w1_expires_in, 
                        w2_expires_in:result.w2_expires_in,
                        expires_in:result.expires_in, 
                        re_expires_in:result.re_expires_in
                };  

              getSellerUser().then((res)=>{
                user.seller_credit = res.seller_credit;
                user.type = res.type;
                user.avatar = res.avatar;
                user.account_id = res.user_id

                 var headers = {
                        'Accept': 'application/json,text/javascript',
                        'Content-Type': 'application/x-www-form-urlencoded',
                    };

                 QN.fetch(DateAPi.httphost+'/new_user_new', {
                        headers:headers,
                        method: 'POST',
                        mode: 'cors',
                        dataType: 'json',
                        body:QN.uri.toQueryString(user)
                    })
                    .then(response => {     
                        return response.json(); // => 返回一个 `Promise` 对象
                    })
                    .then(data => {
                       resolve(data);
                    })
                    .catch(error => {
                       
                    });  
              });
       });
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

export function getProfileReport(subway_token, start_date= null, end_date= null){
    start_date = start_date != null ? start_date :DateAPi.formatDate(DateAPi.lastWeek);
    end_date = end_date != null ? end_date : DateAPi.formatDate(DateAPi.yesterday);

    return QN.top.batch({
            query: [
                {
                    method:'taobao.simba.rpt.custbase.get',
                    fields:'start_time,end_time,subway_token,source',
                    start_time:start_date, 
                    end_time:end_date,
                    subway_token:subway_token,
                    source:'SUMMARY'
                }, {
                    method:'taobao.simba.rpt.custeffect.get',
                    fields:'start_time,end_time,subway_token,source',
                    start_time:start_date,
                    end_time:end_date,
                    subway_token:subway_token,
                    source:'SUMMARY'
                }
            ]
        }).then(result => {
          
            var baseData = result[0].simba_rpt_custbase_get_response.rpt_cust_base_list;
            var effect = result[1].simba_rpt_custeffect_get_response.rpt_cust_effect_list;
            if(baseData.code && baseData.sub_msg){
                return baseData;
            }else{      
                return formatbaseData(baseData, effect);
            }
          
        }, error => {
            Modal.toast(error);
        });
}

  /**
     * 格式化数据
     * @returns 
     */
    function formatbaseData (baseData, effect)
    {
        var data = {yesterday:[],threedaysago:[],alldays:[]};
        var basedata = {};
        var daysago = {pv:0,click:0,paycount:0,cost:0,click_ROi:0,cpc:0,pay:0,favcount:0,ROI:0,ctr:0};
        var mm = effect;
        var db = baseData;

        if(undefined !== db &&  undefined !== mm){

            if(db.length === 0){
                data.yesterday.push(daysago) ;
                data.threedaysago.push(daysago);
                data.alldays.push(daysago);
            }else{
                  db.reverse();//翻转是为了下面时间段好计算 翻转后数据是按照日期倒叙排列的
                  mm.reverse();
            }

            for(let i in db){
                    basedata[db[i].date] =  db[i];
            }

            for(var j in mm){   

                if(basedata[mm[j].date]){

                    var v = basedata[mm[j].date]; //基础表数据
                    var pay = (mm[j].indirectpay ? parseInt(mm[j].indirectpay):0 ) + (mm[j].directpay ? parseInt(mm[j].directpay):0) ,//总收入 总成交金额
                        paycount = (mm[j].indirectpaycount ? parseInt(mm[j].indirectpaycount):0) + (mm[j].directpaycount ?parseInt( mm[j].directpaycount) : 0 );
                    daysago.pv  += v.impressions ? parseInt(v.impressions) :0 ;
                    daysago.click  += v.click ? parseInt(v.click):0;
                    daysago.paycount += parseInt(paycount);
                    daysago.cost += v.cost ? parseInt(v.cost):0 ;
                    daysago.pay += pay;
                    daysago.favcount += mm[j].favitemcount ? parseInt(mm[j].favitemcount) :0 ;
                
                    //昨天
                    if(v.date === DateAPi.formatDate(DateAPi.yesterday)){

                        data.yesterday.push({pv : daysago.pv,
                                    click :   daysago.click,
                                    paycount :daysago.paycount,
                                    cost : parseFloat(daysago.cost / 100).toFixed(2),
                                    pay :daysago.pay,
                                    favcount:daysago.favcount,
                                    ctr : v.ctr ?v.ctr :0.00,
                                    click_ROi : daysago.click > 0 ? (parseFloat((daysago.paycount/ daysago.click) * 100).toFixed(2)) :0,//转化率
                                    cpc : v.cpc ? parseFloat(v.cpc/100).toFixed(2) :0,
                                    ROI : (daysago.pay === 0) ? 0: parseFloat(daysago.pay/ daysago.cost).toFixed(2)//投入产出比
                                });
                    }

                    //过去三天
                    if( v.date >=  DateAPi.formatDate(DateAPi.threedaysAgo) ){

                        data.threedaysago.push({
                            pv : daysago.pv,
                            click :   daysago.click,
                            paycount :daysago.paycount,
                            cost : parseFloat(daysago.cost / 100).toFixed(2),
                            pay :daysago.pay,
                            favcount:daysago.favcount,
                            ctr : daysago.pv === 0 ?0 :(parseFloat(daysago.click/daysago.pv * 100) .toFixed(2)),
                            click_ROi : daysago.click > 0 ? (parseFloat((daysago.paycount/ daysago.click) * 100).toFixed(2)) :0,
                            cpc : parseFloat((daysago.cost/daysago.click) /100).toFixed(2),
                            ROI : (daysago.cost === 0) ?0:parseFloat(daysago.pay/ daysago.cost).toFixed(2)
                        });
                    }

                    //过去时间段内的所有天
                    if(parseInt(j)+1 === mm.length){

                        daysago.ctr = daysago.pv ===0 ? 0:(parseFloat(daysago.click/daysago.pv * 100).toFixed(2));
                        daysago.click_ROi = daysago.click > 0 ? (parseFloat((daysago.paycount/ daysago.click) * 100).toFixed(2)) :0;
                        daysago.cpc = daysago.click >0 ? (parseFloat((daysago.cost/daysago.click /100)).toFixed(2)) :0;
                        daysago.ROI = (daysago.cost === 0) ?0:parseFloat(daysago.pay/ daysago.cost).toFixed(2);
                        daysago.cost = parseFloat(daysago.cost / 100).toFixed(2);  
                        daysago.pay = parseFloat(daysago.pay / 100).toFixed(2);      
                        data.alldays.push(daysago);
                    }
                }
            }

         }else{
            data.yesterday.push(daysago) ;
            data.threedaysago.push(daysago);
            data.alldays.push(daysago);
        }    

        if(data.yesterday.length == 0){
            data.yesterday.push(daysago);
        }

        if(data.threedaysago.length == 0){
            data.threedaysago.push(daysago);
        }
        if(data.alldays.length == 0){
            data.alldays.push(daysago);
        }
        return data;
    }


/*
* 获取店铺基本报表数据
*/
export function getCustbaseRpt(subway_token){
  return QN.top.invoke({
            query: {
                method:'taobao.simba.rpt.custbase.get',
                fields:'start_time,end_time,subway_token,source',
                start_time:DateAPi.formatDate(DateAPi.lastWeek), //todo 需要改成最近一周
                end_time:DateAPi.formatDate(DateAPi.yesterday),
                subway_token:subway_token,
                source:'SUMMARY'            
            }
        }).then((result)=>{
        	
        	var error = null,response = [];
            error = checkAPIError(result);
           
            if(error == null){
                 response = res.simba_rpt_custbase_get_response.rpt_cust_base_list;
            }
            
             return  response;
             
        },(error)=>{
        	
           return error.error_response;
           
        })
        .catch(error=>{
            Modal.toast(error);
        });
    }