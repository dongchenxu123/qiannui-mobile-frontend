'use strict';
import {mount} from 'nuke-mounter';
import {createElement, Component} from 'weex-rx';
import { View, Text, TouchableHighlight, ScrollView} from 'nuke-components';
import { Button, ListView, Modal, Radio , Grid , Col, Dialog, Dimensions,Picker} from 'nuke';
import QN from 'QAP-SDK';
import { getSchedule, setSchedule} from '../api';
import { scheduleAllDayTemplate, scheduleTemplate } from './scheduleTemplate';

let {height} = Dimensions.get('window');
let URL= document.URL;
let arr= QN.uri.parseQueryString(URL.split('?')[1]);
const campaign_id = arr.campaign_id;

 var template = [];
 scheduleTemplate.map((v,i)=>{
    template.push({key:i,value:v.name,children:v.schedule});
});

class ScheduleView extends Component {
    constructor(props) {
      super(props);
      this.state={
            value:1,
            selected:[],
            defaultselected:[],
            scheduleTemplate:[],
            selectedTemplate:''
      }
      this.groupChange = this.groupChange.bind(this);
    }
    componentDidMount(){
       
        getSchedule(campaign_id).then((res)=>{
           
            if(res.schedule){
                var schedule = res.schedule;

                if(res.schedule == 'all'){
                    schedule = scheduleAllDayTemplate[0].schedule;
                }
                schedule = this.formatData(schedule);
                this.setState({selected:schedule,defaultselected:schedule});                 
            }
        },(error)=>{

        });
    }

    formatData(schedule){
        var weeks =  schedule.split(';');//周
        var formate = [];
        for(var i in weeks){
            var obj = {};

            var index = this.numberTranslate(parseInt(i)+1);
             obj.title = '星期'+(index == '七'?'日':index);
             obj.schedule = weeks[i].split(',');
            formate.push(obj);
        }
        return formate;

    }
    numberTranslate(num){
        var N = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
        var str = num.toString();
        var len = num.toString().length;
        var C_Num = [];

        for(var i = 0; i < len; i++){
            C_Num.push(N[str.charAt(i)]);
        }
        return C_Num.join('');
    }
    groupChange(value){
         this.setState({
            value:value
            });
         var selected = [];
      
         switch(value){
            case 1:
                 this.setState({
                        selected:this.state.defaultselected
                    });
                break;
            case 2:
              
                this.setState({
                        selected:this.formatData(scheduleAllDayTemplate[0].schedule)
                    });
                break;
            case 3:
                var self = this;
                Picker.show({title:'请选择',dataSource:template,maskClosable:true},function(item){
                        self.setState({
                            selected:self.formatData(item.children),
                            selectedTemplate:item.children
                        });

                    },function(e){    
                    });
                break;
         }
    }
    renderItems(){
        return (
                <View>
                { 
                    this.state.selected.length === 0 ? <Text>Loading...</Text> : 
                    this.state.selected.map((item, index) =>{
                        return (
                            <View>
                            <TouchableHighlight style={app.cellItemList} >
                                <Text style={app.itemArrow}>{item.title}</Text>
                                <Text style={app.itemArrow}>时间段</Text>
                                <Text style={app.itemArrow}>出价百分比</Text>
                            </TouchableHighlight>
                            {this.setCell(item.schedule)}
                            </View>        
                        )
                    })    
                }
            </View>
        )
    }
    setCell(item){
        return (
            
                <View style={app.subCell}>
                 {  item.map((vv, i) =>{
                        return (
                            <Grid style={app.subGid}>
                                <Col style={app.col1}><Text></Text></Col>
                                <Col style={app.col2}><Text>{vv.substring(0,vv.lastIndexOf(':')) ? vv.substring(0,vv.lastIndexOf(':')) :'00:00 - 24:00'}</Text></Col>
                                <Col style={app.col3}><Text>{vv.substring(vv.lastIndexOf(':')+1)}%</Text></Col>
                            </Grid>
                            )
                        })
                }
                </View>

            )
    }
    submitData(){
        var schedule = '';
        if(this.state.value == 2){
            schedule = 'all';
        }

        if(this.state.value == 3){
            schedule = this.state.selectedTemplate;  
        }

        if(this.state.value != 1){
            setSchedule(campaign_id,schedule).then((result)=>{
                if(result != ''){
                    Modal.toast('设置分时折扣成功');
                }
               
            },(error)=>{
                Modal.toast('设置分时折扣失败');
            })
        }
    }
    render(){
         
         const dataSource = [
            {value:1, label: '当前设置'},
            {value:2, label: '全天投放'},
            {value:3, label: '模板选择'}
        ];
        return (
            <Dialog contentStyle={app.modalStyle} ref="modal" contentStyle={app.modalStyle} visible={true}>
              <ScrollView  onEndReachedThreshold={300}>
               <View style={{flexDirection:'row', display:'flex',marginBottom:'20rem'}}>
                <Radio.Group value={this.state.value} onChange = {this.groupChange.bind(this)} style={{flexDirection:'row', display:'flex',marginBottom:'20rem'}}>
                    <Radio style={{marginLeft:0,marginRight:0,paddingLeft:0}} value={1} ></Radio><Text style={{margin:'30rem 0'}} >当前设置</Text>
                    <Radio style={{marginLeft:0,marginRight:0,paddingLeft:0}} value={2} ></Radio><Text style={{margin:'30rem 0'}} >全天投放</Text>
                    <Radio style={{marginLeft:0,marginRight:0,paddingLeft:0}} value={3} ></Radio><Text style={{margin:'30rem 0'}} >模板选择</Text> 
                </Radio.Group>
                </View>
                {this.renderItems()}
               </ScrollView>
               <View style={app.footer}>
                    <View style={{backgroundColor:'#4f74b3',height:'120rem',justifyContent:'center'}}>
                        <Button style={app.btn} type="dark" shape="保存设置" onPress={this.submitData.bind(this)}>保存设置</Button>
                    </View>
                </View>
             </Dialog>
            )
    }
}

const app = {
    modalStyle: {
        width: 750,
        height: height
    },
    footer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: '120rem',
        flexDirection:"row",
        display:'flex'
    },
    btn:{
        marginRight:'20rem'
    },
      wrapper:{
        padding:'20rem'
    },
     btn:{
        marginRight:'20rem'
    },
    listContainer:{
        flex:1
    },
    cellItemList:{
        backgroundColor:"#e4e0e0",
        height:"90rem",
        borderBottomWidth:"2rem",
        borderBottomStyle:"solid",
        borderBottomColor:"#e8e8e8",
        paddingLeft:"30rem",
        alignItems:"center",
        flexDirection:"row",
        display:'flex' 
    },
    itemTextList:{
        fontSize:"30rem",
        color:"#80",
        flex:10
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
    amoutitemArrow:{
        flex: 4,
        fontSize:"24rem",
        right: '1rem'
    },
    scroller:{
          backgroundColor:'#ffffff'  
      },

    subCell:{
        padding:'8rem',
        borderBottomStyle:'solid',
        borderBottomWidth:'1rem',
        borderBottomColor:'#e8e8e8',  
        fontColor:'#e8e8e8' 
    },
    subGid:{
         flexDirection:"row",
         display:'flex',
         padding:'10rem',
    },
    col1:{
        padding:'8rem',
        marginLeft:'2rem',
        borderBottomStyle:'solid',
        borderBottomWidth:'1rem',
        borderBottomColor:'#e8e8e8',
        flex:14
    },
    col2:{
        padding:'8rem 8rem',
        borderBottomStyle:'solid',
        borderBottomWidth:'1rem',
        borderBottomColor:'#e8e8e8',
        flex:2,    
    },
    col3:{
        padding:'8rem 8rem',
        borderBottomStyle:'solid',
        borderBottomWidth:'1rem',
        borderBottomColor:'#e8e8e8',
        flex:2,  
    },
    itemArrow:{
        flex: 4,
        fontSize:"30rem",
        color:"#5F646E" 
    },
    title:{
  
        borderBottomStyle:'solid',
        borderBottomWidth:'1rem',
        borderBottomColor:'#e8e8e8'
    }
}

mount(<ScheduleView />, 'body');

export default ScheduleView