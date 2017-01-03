'use strict';

import QN from 'QAP-SDK';
import * as DateAPi from './date';

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