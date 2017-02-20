import {Button,ListView, Modal, Dimensions, Dialog, Picker } from 'nuke';
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
let {height} = Dimensions.get('window');
const user_id = params.user_id;
let ds=[{key:'1',value:'展现量'},{key:'2',value:'点击量'},{key:'3',value:'花费'},{key:'4',value:'平均点击花费'}]
class DspcontrastView extends Component{
     constructor() {
        super();   
        this.state = {
          date_data: [],
          dsp_dataPv: [],
          dsp_dataClick: [],
          dsp_dataCost: [],
          dsp_dataCpc: [],
          ztc_dataPv: [],
          ztc_dataClick: [],
          ztc_dataCost: [],
          ztc_dataCpc: [],
          selectValue: '展现量'
        }  

        this.formatEchartsData = this.formatEchartsData.bind(this); 
    }
   
	componentDidMount () {
		this.getReports();
	}
	getReports() {
        var self = this;
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
 
            if(error === null)
            {
                var obj = self.formatEchartsData(result);//正序 
                Modal.alert(JSON.stringify(obj))
                self.setState({
                	date_data: obj.date_data,
                	dsp_dataPv: obj.dsp_data.pv,
                	dsp_dataClick: obj.dsp_data.click,
			        dsp_dataCost: obj.dsp_data.cost,
			        dsp_dataCpc: obj.dsp_data.cpc,
                	ztc_dataPv: obj.ztc_data.pv,
                	ztc_dataClick: obj.ztc_data.click,
			        ztc_dataCost: obj.ztc_data.cost,
			        ztc_dataCpc: obj.ztc_data.cpc,
                })
             
            }else
            {
              
            }
         
            
        });
    }
    formatEchartsData(report){
        var self = this;
        var date_temp = [],//日期数据
            dsp_temp = {pv:[],click:[],cost:[],cpc:[]},  // dsp数据
            ztc_temp = {pv:[],click:[],cost:[],cpc:[]}; //直通车数据
        var ztc_length = report.baserpt == undefined ? 0 :report.baserpt.length;

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
    presshandle() {
    	var self= this;
        Picker.show({title:'请选择',dataSource:ds,selectedKey:'1',maskClosable:true},(e)=>{
	        console.log('select item ',e)
	        //选择某一项
	        // [{key:'2',value:'第二排'}]
	        // 级联的情况
	        // [{key:'11222',value:'江苏'},{key:'210000',value: '南京'}]
          
	        this.setState({
           		selectValue: e.value
           })
	       if(e.value == '展现量') {
	       	 self.renderdspPv()
	       }
	    },(e)=>{
	        // {cancel:true}
	        this.setState({
           		selectValue: e.value
           })
	        
	    },(e)=>{
	    	Modal.alert(1)
	        console.log('success rendered')
	    },(e)=>{
	        console.log('fail to render picker')
	    });
    }
    renderdspPv() {
    	var self= this
    	this.state.dsp_dataPv
    }
	render () {
		Modal.alert(JSON.stringify(this.state.date_data))
		return (
			<ScrollView style={styles.scroller}>
				<View style={styles.amoutList}>
					<Text style={styles.amoutTextList}>当前数据</Text>
					<Button onPress={this.presshandle.bind(this)} style={{flex: 5}} type="secondary">
						{this.state.selectValue}
					</Button>
				</View>
				<View style={styles.amoutList}>
					<Text style={styles.textStyle}>日期</Text>
					<Text style={styles.textStyle}>淘外引流</Text>
					<Text style={styles.textStyle}>直通车</Text>
				</View>
				<View style={styles.cellList}>
					{
						this.state.date_data.length == 0 
						? <Text>Loading...</Text>
						: this.state.date_data.map((item,i) => {
							return (
								<Text style={styles.comStyle}>{item}</Text>
							)
						})
					}
				</View>
			</ScrollView>
		)
	}
}

const styles={
	scroller:{
          width: 750,
          height: height-10,
          flex: 1
       },
	amoutList: {
        backgroundColor: "#ffffff",
       	padding: '30rem',
        borderBottomWidth: "2rem",
        borderBottomStyle: "solid",
        borderBottomColor: "#e8e8e8",
        paddingTop: "40rem",
        alignItems: "center",
        flexDirection: "row",
        display: 'flex'
    },
    cellList: {
        backgroundColor: "#ffffff",
       	padding: '30rem',
        borderBottomWidth: "2rem",
        borderBottomStyle: "solid",
        borderBottomColor: "#e8e8e8",
        paddingTop: "40rem",
        alignItems: "center",
        flexDirection: "column",
        display: 'flex'
    },
    amoutTextList: {
        fontSize: "32rem",
        color: "#5F646E",
        flex: 11

    },
    textStyle: {
    	flex: 7,
    	fontSize: '30rem',
    	textAlign: 'center'
    },
    comStyle: {
    	flex: 4,
    	fontSize: '30rem',
    	textAlign: 'center'
    }
}



mount(<DspcontrastView />, 'body')
