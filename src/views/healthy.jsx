import {Link, ListView, Modal, Col, Grid, Navigator } from 'nuke';
import {createElement, Component} from 'weex-rx';
import { View, Text, TouchableHighlight,ScrollView   } from 'nuke-components';
import { getAuthSign,getCampaign } from '../api';
import { showLoading,hideLoading } from './util';
import QN from 'QAP-SDK';
  
class HealthyView extends Component{
   constructor() {
        super();   
        this.state = {
            subway_token:'',
            campaigns:[],
            normal_val:'正常',
            too_low:'过低'
        }  
        showLoading();    
    }

     componentWillMount(){
        getAuthSign().then((result) => {
            if(result.errorCode == undefined){
                this.setState({subway_token:result});
                //获取推广计划
                getCampaign(result).then((campaign) => {
                 hideLoading();
                   if(campaign.length >0){
                        this.setState({campaigns:campaign});
                   }   
                }, (error) => {
                   hideLoading();
                    Modal.toast(JSON.stringify(error));    
                });
            }else{
                 hideLoading();
                Modal.alert('登陆授权失败，请重新授权 或者您还没有订购该软件');
            }
    
        },(error)=>{
              hideLoading();
             Modal.alert('出错了,请检查您是否已经订购该软件');
        });
    }
  
    renderItem(item,index){
        return (
                <View>
                    <TouchableHighlight style={app.cellItemList} onPress={this.onPress.bind(this,item.campaign_id,item.title)}>
                        <Text style={app.itemTextList}>{item.title}</Text>
                        {
                            item.online_status == 'online' ?
                             <Text style={[app.itemArrow,{color:'#5F646E'}]}>推广中</Text>:
                            <Text style={[app.itemArrow,{color:'#5F646E'}]}>暂停中</Text>
                        }
                     </TouchableHighlight>

                     <View style={app.subCell}>
                       <Grid style={app.subGid}>
                         <Col style={app.col1}><Text>点击量</Text></Col>
                         <Col style={app.col2}><Text>{this.setItemSource('click',item.click,'')}</Text></Col>
                        </Grid>
                   
                       <Grid style={app.subGid}>
                         <Col style={app.col1}><Text>点击率</Text></Col>
                         <Col style={app.col2}><Text>{this.setItemSource('click',item.ctr,'')}</Text></Col>
                        </Grid>
              
                       <Grid style={app.subGid}>
                         <Col style={app.col1}><Text>花费</Text></Col>
                         <Col style={app.col2}><Text>{this.setItemSource('click',item.cost,item.budget)}</Text></Col>
                        </Grid>
                   
                       <Grid style={app.subGid}>
                         <Col style={app.col1}><Text>点击转化率</Text></Col>
                         <Col style={app.col2}><Text>{this.setItemSource('click',item.click_ROi,'')}</Text></Col>
                        </Grid> 
                       <Grid>
                         <Col style={app.col1}><Text>投入产出</Text></Col>
                         <Col style={app.col2}><Text>{this.setItemSource('click',item.ROI,'')}</Text></Col>
                        </Grid>
                   
                       <Grid style={app.subGid}>
                         <Col style={app.col1}><Text>收藏</Text></Col>
                         <Col style={app.col2}><Text>{this.setItemSource('click',item.favcount,'')}</Text></Col>
                        </Grid>
                    </View>      
                </View>
            )
    }

    setItemSource(type,val,value){
      
        val = parseInt(val);
        value = value ? parseInt(value) :0;
        var result =this.state.normal_val;
        var lower = this.state.too_low;
        switch(type)
        {
            case 'click':
            case 'ctr'://点击率
            case 'click_ROi'://转化率
                    if(val <=10 ){
                        result =  lower; 
                    }
                break;
            case 'favcount':
                if(val <=1){
                    result =  lower;
                }
                break;
            case 'ROI':
                if(val  === 0){
                    result =  lower;
                }
                break;
            case 'cost':
                if((value - val < 1 && val >0) || val === 0){
                    result =  lower;
                }
                break;
        }
        return result;
    }

    renderHeader=()=>{
       
    }
    renderFooter=()=>{
    
    }

    handleLoadMore(){

    }

    onPress (campaign_id,title) {
       QN.navigator.push({
            url:'qap://views/healthyResult.js',
            query:{campaign_id:campaign_id,campaign_title:title},
            settings: {
                    animate: true
             }
        })
    }
	render () {
        return (
               
                this.state.campaigns.length == 0 ? '' :
                <ListView
                renderFooter={this.renderFooter}
                renderRow={this.renderItem.bind(this)} 
                dataSource={this.state.campaigns}
                style={app.listContainer}
                onEndReached={this.handleLoadMore.bind(this)} 
                />     
        )
	}
}

const app = {
    listContainer:{
        flex:1
    },
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
        fontSize:"32rem",
        color:"#0894EC",
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
        height:'440rem',
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
        fontSize:'30rem',
        padding:'20rem',
        marginLeft:'10rem',
        borderBottomStyle:'solid',
        borderBottomWidth:'1rem',
        borderBottomColor:'#e8e8e8',
        flex:15,
        color:'#5F646E'
    },
    col2:{
        fontSize:'30rem',
        padding:'20rem',
        borderBottomStyle:'solid',
        borderBottomWidth:'1rem',
        borderBottomColor:'#e8e8e8',
        flex:4,
        textAlign: 'right',
        marginRight:'20rem',
        color:'#5F646E'
    },
    itemArrow:{
        flex: 4,
        fontSize:"30rem",
        color:"#5F646E" ,
        textAlign: 'right',
        marginRight:'2rem'
    }
}
export default HealthyView