import {Button, Modal, Col, Grid, Dimensions,TimePicker} from 'nuke';
import {mount} from 'nuke-mounter';
import {createElement, Component} from 'weex-rx';
import { View, Text, TouchableHighlight,ScrollView} from 'nuke-components';
import { getTodayReport, getHistoryReport } from '../api';
import {yesterday, threeMonthAgo, lastWeek,formatDate} from '../api/date';
import { showLoading,hideLoading,number_format } from './util';
import QN from 'QAP-SDK';
let {height} = Dimensions.get('window');
let URL= document.URL;
let params= QN.uri.parseQueryString(URL.split('?')[1]);

class DrainageRpt extends Component{
    constructor() {
        super();   
        this.state = {
            user_id:params.user_id,
            account_id:params.account_id,
            todayRpt:{},
            historyRpt:[],
            start_date:formatDate(lastWeek,'yy-mm-dd'),
            end_date:formatDate(yesterday,'yy-mm-dd'),
            showLoading:false
        }    
        showLoading();
    }
    componentDidMount(){
       this.getTodayReport();
       this.getHistoryReport(this.state.start_date,this.state.end_date);
    }

    getTodayReport(){
        getTodayReport(this.state.user_id).then((result)=>{
            if(result.report){
                this.setState({todayRpt:result});
                hideLoading();
            }
        },(error)=>{
            hideLoading();
            Modal.toast(error);
        });
    }

    getHistoryReport(start_date,end_date){

        start_date = start_date !== undefined ? start_date : this.state.start_date;
        end_date = end_date !== undefined ? end_date :this.state.end_date;

        let checkReault = this.checkDate(start_date,end_date);
        var param = {user_id:this.state.user_id,start_date:start_date,end_date:end_date};

        if(!checkReault) {
            return;
        }

        getHistoryReport(this.state.user_id,start_date,end_date).then((result)=>{
                hideLoading();
               if(result.error !== ""){
                    Modal.toast(result.error === 40060?'日期格式错误':result.error === 40010?'无效的用户':'获取失败');
               }else{
                if(result.report){
                    this.setState({historyRpt:result.report});
                }
               }
        })
    }
    checkDate(start_date,end_date){
        var default_start_date = formatDate(threeMonthAgo,'yy-mm-dd');
        if(start_date < default_start_date)
        {
            Modal.toast('只能选择三个月以内日期');
            return ;
        }

        if(start_date > end_date)
        {
             Modal.toast('日期选择有误,开始时间不能大于结束时间');
            return;
        }
        return true;
    }
    _renderTodayRpt(){

        let v = this.state.todayRpt;
        var pv = parseInt(v.impressions),
           cost = v.cost,
           click = parseInt(v.clicks),
           cpc = (click >0) && ((cost)/click).toFixed(3),//平均点击花费
           cpm = pv > 0? (click >0 ? ((cost/pv * 100).toFixed(3)):0) :0, 
           ctr = pv > 0? (click >0 ? ((click/pv * 100).toFixed(3)):0) :0;

        return (
                <View>
                     <View style={app.subCell}>
                       <Grid style={app.subGid}>
                         <Col style={app.col1}><Text>展现量</Text></Col>
                         <Col style={app.col2}><Text>{number_format(pv) || 0}</Text></Col>
                        </Grid>
                   
                       <Grid style={app.subGid}>
                         <Col style={app.col1}><Text>点击量</Text></Col>
                         <Col style={app.col2}><Text>{number_format(click) || 0}</Text></Col>
                        </Grid>
              
                       <Grid style={app.subGid}>
                         <Col style={app.col1}><Text>点击率(%)</Text></Col>
                         <Col style={app.col2}><Text>{ctr || 0}</Text></Col>
                        </Grid>
                   
                       <Grid style={app.subGid}>
                         <Col style={app.col1}><Text>花费</Text></Col>
                         <Col style={app.col2}><Text>{cost >0 ?number_format(parseFloat(cost).toFixed(2)):0 || 0}元</Text></Col>
                        </Grid> 
                       <Grid>
                         <Col style={app.col1}><Text>平均点击花费</Text></Col>
                         <Col style={app.col2}><Text>{cpc || 0}</Text></Col>
                        </Grid>
                   
                       <Grid style={app.subGid}>
                         <Col style={app.col1}><Text>千人成本</Text></Col>
                         <Col style={app.col2}><Text>{cpm || 0}</Text></Col>
                        </Grid>
                    </View>      
                </View>
            )
    }

    _renderHistoryRpt(v){
        return (
                <View>
                    <View style={[app.cellItemList,{backgroundColor:'#fff'}]}>
                        <Text style={[app.itemTextList,{color:'#f50'}]}>{v.record_on}</Text> 
                    </View> 
                     <View style={app.subCell}>
                       <Grid style={app.subGid}>
                         <Col style={app.col1}><Text>展现量</Text></Col>
                         <Col style={app.col2}><Text>{v.pv > 0 ? number_format(v.pv):0}</Text></Col>
                        </Grid>
                   
                       <Grid style={app.subGid}>
                         <Col style={app.col1}><Text>点击量</Text></Col>
                         <Col style={app.col2}><Text>{v.clicks > 0 ? number_format(v.clicks) :0}</Text></Col>
                        </Grid>
              
                       <Grid style={app.subGid}>
                         <Col style={app.col1}><Text>点击率(%)</Text></Col>
                         <Col style={app.col2}><Text>{v.pv > 0 ?( v.clicks >0? ((v.clicks/v.pv * 100).toFixed(3)):0):0}</Text></Col>
                        </Grid>
                   
                       <Grid style={app.subGid}>
                         <Col style={app.col1}><Text>花费</Text></Col>
                         <Col style={app.col2}><Text>{v.cost/100}元</Text></Col>
                        </Grid> 
                       <Grid>
                         <Col style={app.col1}><Text>平均点击花费</Text></Col>
                         <Col style={app.col2}><Text>{v.clicks > 0? ((v.cost/100)/v.clicks).toFixed(3):0}</Text></Col>
                        </Grid>
                   
                       <Grid style={app.subGid}>
                         <Col style={app.col1}><Text>千人成本</Text></Col>
                         <Col style={app.col2}><Text>{(v.pv > 0 ?( v.cost >0? ((v.cost/100/v.pv * 1000).toFixed(3)):0):0)}</Text></Col>
                        </Grid>
                    </View>      
                </View>
            )
    }
    selectData(v){
        this.state.showLoading = true;
        var minDate = formatDate(threeMonthAgo,'yy-mm-dd'),
            maxDate = formatDate(yesterday,'yy-mm-dd');
        TimePicker.show({
            title: '请选择日期',
            range: [
                minDate,maxDate
            ],
            default: formatDate(yesterday),
            type: 'date'
        }, (e) => {
        }, (e) => {
           
        },(e)=>{
            if(e){
                var date_selected = e.split(' ')[0].replace(/\//g,'-');
                if(v == 1){
                    this.setState({start_date: date_selected});
                }else{
                    this.setState({end_date: date_selected});
                }
                this.getHistoryReport(this.state.start_date,this.state.end_date);     
            }
            
        },()=>{
           
        });
    }
    render(){
        return (
                <ScrollView>
                    <View>
                    <View style={app.cellItemList}>
                        <Text style={app.itemTextList}>今日概况</Text> 
                    </View>
                    {
                        this.state.todayRpt == null ? '' :
                        this._renderTodayRpt()
                    }
                    </View>
                    <View>
                    <View style={app.cellItemList}>
                        <Text style={app.itemTextList}>历史数据</Text> 
                    </View> 
                    <View style={app.dateList}>
                        <Button style={app.amoutitemArrow} onPress={this.selectData.bind(this,1)}>
                            {this.state.start_date === ''
                                ? '开始日期'
                                : this.state.start_date
                            }
                        </Button>
                        <Button style={app.amoutitemArrow} onPress={this.selectData.bind(this,2)}>
                            {this.state.end_date === ''
                                ? '结束日期'
                                : this.state.end_date
                            }
                        </Button>
                       
                    </View>
                    { 
                        this.state.historyRpt.length == 0 || this.state.showLoading == true ? '加载中...':
                        this.state.historyRpt.map((item,index)=>{
                            return (
                                <View>
                                {this._renderHistoryRpt(item)}
                                </View>
                                )
                        })
                    }
                    </View>
                </ScrollView>

            )
    }
}

const app = {
 
    cellItemList:{
        backgroundColor:"#e8e8e8",
        height:"90rem",
        borderBottomWidth:"2rem",
        borderBottomStyle:"solid",
        borderBottomColor:"#e8e8e8",
        paddingRight:"30rem",
        paddingLeft:"30rem",
        alignItems:"center",
        flexDirection:"row",
        display:'flex' 
    },
    itemTextList:{
        fontSize:"30rem",
        flex:15
    },
    refresh:{
        height:"80rem",
        width:"750rem",
        backgroundColor:"#cccccc",
        justifyContent:"center",
        alignItems:"center"
    },
    loading:{
        height:"80rem",
        display:"flex",
        width:"750rem",
        flexDirection:"row",
        backgroundColor:"#cccccc",
        alignItems:"center",
        justifyContent:"center"
    },
    loadingText:{
        color:"#666666"
    },
    amoutList:{
            backgroundColor:"#ffffff",
            padding:"15rem",
            alignItems:"center",
            flexDirection:"row",
            display:'flex'
        },
    scroller:{
        backgroundColor:'#ffffff'  
      },
    item:{
        height:'100rem',
        borderBottomStyle:'solid',
        borderBottomWidth:'1rem',
        borderBottomColor:'#e8e8e8'
    },
    subCell:{
        
        borderBottomStyle:'solid',
        borderBottomWidth:'1rem',
        borderBottomColor:'#e8e8e8',  
        fontColor:'#e8e8e8'
    },
    subGid:{
        flexDirection:"row",
        display:'flex',
    },
    col1:{
        padding:'20rem',
        marginLeft:'10rem',
        borderBottomStyle:'solid',
        borderBottomWidth:'1rem',
        borderBottomColor:'#e8e8e8',
        flex:15
    },
    col2:{
        padding:'20rem',
        borderBottomStyle:'solid',
        borderBottomWidth:'1rem',
        borderBottomColor:'#e8e8e8',
        flex:4,
        textAlign: 'right',
        marginRight:'20rem' 
    },
    itemArrow:{
        flex: 4,
        fontSize:"30rem",
        color:"#5F646E" ,
        textAlign: 'right',
        marginRight:'2rem'
    },
    dateList: {
        height: '100rem',
        alignItems: "center",
        flexDirection: "row",
        display: 'flex'
    },
    amoutitemArrow: {
        flex: 4,
        fontSize: "24rem",
        color: "#5F646E"
    },
}
mount(<DrainageRpt/>, 'body');

