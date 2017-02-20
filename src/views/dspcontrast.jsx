import {Button,ListView, Modal, Dimensions, Dialog } from 'nuke';
import {mount} from 'nuke-mounter';
import {createElement, Component} from 'weex-rx';
import QN from 'QAP-SDK';
import { View, Text, TouchableHighlight,ScrollView } from 'nuke-components';
import Async from 'async';
import _ from 'lodash';
import { getCustbaseRpt, getHistoryReport } from '../api';

let URL= document.URL;
let params= QN.uri.parseQueryString(URL.split('?')[1]);
const subway_token = params.subway_token;

const user_id = params.user_id;

class DspcontrastView extends Component{
	componentDidMount () {
		this.getReports()
	}
	getReports() {
  
        Async.parallel({
            baserpt:function(callback){
                getCustbaseRpt (subway_token).then((result) => {
					callback(null,result);
				}, (error) => {
		            callback(error,[]);
		
		        })
            },
            dsprpt:function(callback){
            	 getHistoryReport(user_id).then((res) => {
            	 	var items = [];
        
                        //注：report 结果是按照日期倒叙排列的
                        if(_.keys(res.report).length >0)
                        {
                             var index =  _.findLastIndex(res.report,function(item){
                                return item.pv > 0;
                             });

                             if(index > -1)
                             {
                                var itemslist = res.report.slice(0,index+1);
                                items=  _.sortBy(itemslist,'record_on');//正
                             }
                        }
                    
                    callback(null,items);
                   
				}, (error) => {
		            callback(error,[]);
		
		        })
                
            }
        },function(error,result){
        	
        	Modal.alert(result.length )
        	var obj={};
            if(result.length > 0 )
            {
                obj = this.formatEchartsData(result);//正序 
            }else
            {
              
            }
         
            
        });
    }
    formatEchartsData(report)
    {
    	Modal.alert(3);
        var 
            date_temp = [],//日期数据
            dsp_temp = {pv:[],click:[],cost:[],cpc:[]},  // dsp数据
            ztc_temp = {pv:[],click:[],cost:[],cpc:[]}; //直通车数据
        var ztc_length = report.baserpt.length;

        report.dsprpt.map((v,i) => {
            v.clicks = parseInt(v.clicks);
            v.cost = parseInt(v.cost);
            var dateArr = v.record_on.split('-');
            date_temp.push(dateArr[1]+'-'+dateArr[2]);
            dsp_temp.pv.push((v.pv));
            dsp_temp.click.push((v.clicks));
            dsp_temp.cost.push((v.cost/100).toFixed(2));
            dsp_temp.cpc.push( (v.clicks!==0)?((v.cost/100)/v.clicks).toFixed(3):0);
            var zpv = 0,zclick= 0,zcost= 0,zcpc = 0;

            if(ztc_length >0)
            {
                var item =  _.find( report.baserpt,function(m){
                    return m.date.toString() === v.record_on.toString();
                });
                if(item !== undefined)
                {
                    zpv = item.impressions ? item.impressions :0;
                    zclick = item.click ? item.click :0;
                    zcost = item.cost ? item.cost :0;
                    zcpc =  item.cpc ? parseFloat(item.cpc/100).toFixed(3) :0;
                }
            }
            ztc_temp.pv.push(zpv);
            ztc_temp.click.push(zclick);
            ztc_temp.cost.push(zcost);
            ztc_temp.cpc.push(zcpc);
        });
        return  {date_data:date_temp,dsp_data:dsp_temp,ztc_data:ztc_temp};
    }
	render () {
		return (
			<View>对比数据</View>
		)
	}
}




mount(<DspcontrastView />, 'body')
