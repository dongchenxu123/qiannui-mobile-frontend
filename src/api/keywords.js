'use strict';
import QN from 'QAP-SDK';
import * as DateAPi from './date';
import { Modal } from 'nuke';
import {checkAPIError} from './checkerror';
import {getLocalstoreUser} from './authsign';

export function getallKeywords(subway_token,adgroup_id,campaign_id,needformat = true){
     return QN.top.batch({
            query: [
                {
                    method:'taobao.simba.keywordsbyadgroupid.get',
                    fields:'adgroup_id',
                    adgroup_id:adgroup_id
                }, 
                {
                    method:'taobao.simba.rpt.adgroupkeywordbase.get',
                    fields:'subway_token,campaign_id,adgroup_id,start_time,end_time,search_type,source',
                    subway_token:subway_token,
                    campaign_id:campaign_id,
                    adgroup_id:adgroup_id,
                    start_time:DateAPi.formatDate(DateAPi.yesterday),
                    end_time:DateAPi.formatDate(DateAPi.yesterday),
                    search_type:'SEARCH,CAT,NOSEARCH',
                    source:'SUMMARY'
                },
                {
                    method:'taobao.simba.rpt.adgroupkeywordeffect.get',
                    fields:'subway_token,campaign_id,adgroup_id,start_time,end_time,search_type,source',
                    subway_token:subway_token,
                    campaign_id:campaign_id,
                    adgroup_id:adgroup_id,
                    start_time:DateAPi.formatDate(DateAPi.yesterday),
                    end_time:DateAPi.formatDate(DateAPi.yesterday),
                    search_type:'SEARCH,CAT,NOSEARCH',
                    source:'SUMMARY'
                }
            ]
        }).then(result => {
            var keywords = [],baseData = [],effect = [];
            var error = null;
      
            if(checkAPIError(result[0]) == null && checkAPIError(result[1]) == null && checkAPIError(result[2]) == null){
                
                  if(result[0].simba_keywordsbyadgroupid_get_response.keywords){
                        keywords = result[0].simba_keywordsbyadgroupid_get_response.keywords.keyword;
                  }

                  if(result[1].simba_rpt_adgroupkeywordbase_get_response.rpt_adgroupkeyword_base_list){
                        baseData = result[1].simba_rpt_adgroupkeywordbase_get_response.rpt_adgroupkeyword_base_list;
                  }

                  if(result[2].simba_rpt_adgroupkeywordeffect_get_response.rpt_adgroupkeyword_effect_list){
                        effect = result[2].simba_rpt_adgroupkeywordeffect_get_response.rpt_adgroupkeyword_effect_list
                  }
                  if(needformat){
                     return formatAdgroupKeys(keywords,baseData,effect); 
                 }else{

                    return {keylist:keywords,rptbase:baseData};
                 }
                         
            }else{
                return '获取关键词数据失败';
            }
        }, error => {
            Modal.toast(error);
        }); 
}

function formatAdgroupKeys(keyobj,baseobj,effectobj){
   
         var ba={}, ef={};

        if(baseobj && baseobj.length >0){
            for(var i in baseobj){
                    if(ba[baserpt[i].keywordid] === undefined ){
                       ba[baserpt[i].keywordid] = baseobj[i] ;
                    }
                }  
        }
        if(effectobj.length >0){
            for(var j in effectobj){
                if(ef[effectobj[j].keywordid] === undefined ){
                    ef[effectobj[j].keywordid] = effectobj[j] ;
                }
            }
        }
       if(keyobj.length >0){
            for(var t in keyobj){
                var keyword_id = keyobj[t].keyword_id;
                
                keyobj[t].impressions = 0;
                keyobj[t].click = 0;
                keyobj[t].paycount =0 ;
               
                if(ba[keyword_id]){
                    keyobj[t].impressions += parseInt(ba[keyword_id].impressions);
                    keyobj[t].click += parseInt(ba[keyword_id].click);
                }

                if(ef[keyword_id]){
                    keyobj[t].payCount +=((ef[keyword_id].indirectpaycount !== undefined) ? parseInt(ef[keyword_id].indirectpaycount) : 0) + ( (ef[keyword_id].directpaycount !== undefined) ? parseInt(ef[keyword_id].directpaycount) : 0);    
                }
            }
        }
    return keyobj;
}

/*
    获取推广组推荐关键词
*/
export function getRecommendKeywords(adgroup_id){
    return QN.top.invoke({
            query: {
                method:'taobao.simba.keywords.recommend.get',
                fields:'adgroup_id,page_size,page_no,order_by',
                adgroup_id:adgroup_id,
                page_size:200,
                page_no:1,
                order_by:'search_volume'
            }
        }).then((result)=>{
            var data = [];
            var error = checkAPIError(result);

            if(error == null)
            {
                if(result.simba_keywords_recommend_get_response.recommend_words)
                {
                    data = result.simba_keywords_recommend_get_response.recommend_words.recommend_word_list.recommend_word;
                }
                return data;
            }else{
                return error;
            }
        })
        .catch(error=>{
            Modal.toast(error);
        });  
}

/*
删除关键词
@param  keyword_ids 数组
*/
export function deleteKeywords(campaign_id,keyword_ids){
     return QN.top.invoke({
            query: {
                method:'taobao.simba.keywords.delete',
                fields:'campaign_id,keyword_ids',
                campaign_id:campaign_id,
                keyword_ids:keyword_ids.join(',')
            }
        }).then((result)=>{
        
        	var data = [];
            var error = checkAPIError(result);
        
            if(error == null)
            {
                var deleteResult = result.simba_keywords_delete_response;
                if(deleteResult && deleteResult.keywords)
                {
                    data = deleteResult.keywords.keyword;
                }
           
                return data;
               
            }else{
                return error;
            }
        })
        .catch(error=>{
            Modal.toast(error);
        });
}

/*
*  添加/创建关键词
* @param word  [ { "word": "西瓜汁", "maxPrice": 123 ,"isDefaultPrice": 0,"matchScope": 1}, { "word": "苹果汁","maxPrice": 0, "isDefaultPrice": 1 ,"matchScope": 2} ]
*/
export function addNewKeyword(adgroup_id,word){
    return QN.top.invoke({
            query: {
                method:'taobao.simba.keywordsvon.add',
                fields:'adgroup_id,keyword_prices',
                adgroup_id:adgroup_id,
                keyword_prices:JSON.stringify(word)
            }
        }).then((result)=>{
            var data = [];
            var error = checkAPIError(result);

            if(error == null)
            {
                if( result.simba_keywordsvon_add_response && result.simba_keywordsvon_add_response.keywords && result.simba_keywordsvon_add_response.keywords.keyword){
                    data = result.simba_keywordsvon_add_response.keywords.keyword;
                }
                return data;
            }else{
                return error;
            }
        },(error)=>{
             return error.error_response;
        })
        .catch(error=>{
            Modal.toast(error);
        });
}

export function getStoreKeyword(adgroup_id,num_iid,cid){

    /* var  params = {account_id:USER_ID,
            token: $('#sessionkey').val(),
            cid:cid,
            nick:self.adgroup.nick,
            item_id:self.adgroup.num_iid,
            adgroup_id: self.adgroup.adgroup_id,
            used: []};*/
     return new Promise((resolve, reject) => {
         getLocalstoreUser().then((res)=>{
            console.log(JSON.stringify(res));
            /*var param = {
                    account_id: res.taobao_user_id,
                    content:content
                };
                
                QN.fetch(DateAPi.httphost+'/save_feedback/', {
                  
                    method: 'POST',
                    mode: 'cors',
                    dataType: 'json',
                    body:QN.uri.toQueryString(param)
                })
                .then(response => {     
                    return response.json(); // => 返回一个 `Promise` 对象
                })
                .then(data => {
                      Modal.toast('感谢您的留言，我们将尽快给您反馈。');
                })
                .catch(error => {
                    Modal.toast(JSON.stringify(error));
                });  
         });*/
                
        });
     })
}

/*
* 设置关键词出价
* @param keywordid_prices : [{"keywordId":"111123567","maxPrice":0,"isDefaultPrice":1,"matchScope":2},{"keywordId":"111123567","maxMobilePrice":100,"mobileIsDefaultPrice":0}
*/
export function setKeywordPricevon(keywordid_prices){
     return QN.top.invoke({
            query: {
                 method:'taobao.simba.keywords.pricevon.set',
                 fields:'keywordid_prices',
                 keywordid_prices:JSON.stringify(keywordid_prices)
            }
        }).then((result)=>{
            var data = [];
            var error = checkAPIError(result);

            if(error == null)
            {
                data = result.simba_keywords_pricevon_set_response.keywords;

                return data;
            }else{
                return error;
            }
        })
        .catch(error=>{
            Modal.alert(11111);
            Modal.alert(JSON.stringify(error));
        });
}
/*
* 获取使用该关键词的宝贝数量
*/
export function getItemNumByKeyword(word){

     var headers = {
                'Accept': 'application/json,text/javascript',
                'Content-Type': 'application/x-www-form-urlencoded',
            };
     return QN.fetch(DateAPi.httphost+'/getSeachIteamsNew', {
            headers:headers,
            method: 'POST',
            mode: 'cors',
            dataType: 'text',
            body:'word='+word
        })
        .then(response => {     
            return response.json(); // => 返回一个 `Promise` 对象

        }) .catch(error => {
           Modal.alert(JSON.stringify(error));
        });
}

