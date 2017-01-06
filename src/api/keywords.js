'use strict';
import QN from 'QAP-SDK';
import * as DateAPi from './date';
import { Modal } from 'nuke';

export function getallKeywords(subway_token，adgroup_id,campaign_id){


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
                    start_time:DateAPi.yesterday,
                    end_time:DateAPi.yesterday,
                    search_type:'SEARCH,CAT,NOSEARCH',
                    source:'SUMMARY'
                },
                {
                    method:'taobao.simba.rpt.adgroupkeywordeffect.get',
                    fields:'subway_token,campaign_id,adgroup_id,start_time,end_time,search_type,source',
                    subway_token:subway_token,
                    campaign_id:campaign_id,
                    adgroup_id:adgroup_id,
                    start_time:DateAPi.yesterday,
                    end_time:DateAPi.yesterday,
                    search_type:'SEARCH,CAT,NOSEARCH',
                    source:'SUMMARY'
                }
            ]
        }).then(result => {
           var error = [result[0]];

            
          
        }, error => {
            Modal.toast(error);
        }); 
}

