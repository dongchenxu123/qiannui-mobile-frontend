import { ListView, Button, TabSlider, Icon, Modal, TimePicker } from 'nuke';
import {createElement, Component} from 'weex-rx';
import { View, Text,Image,TouchableHighlight,ScrollView, Grid, Col} from 'nuke-components';
import QN from 'QAP-SDK';
import { getSchedule } from '../../api';
import ListViewCommon from '../listViewCommon';

const { Pane } = TabSlider;

class ScheduleConView extends Component{
  constructor() {
    super();
    this.state =  {
            index:0,
            active:0,
           	stop: false,
            page:0,
            checked: false,
            selectedTab: 'tab1'
         };
  }

  sliderChange(index){
    console.log('slide-to', index,new Date().getTime());
    this.setState({
      active:index
    })
  }
  btnClick(){
    this.setState({
      active:0
    })
  }
 numberTranslate (num)
	{
	    var N = [
	        "零", "一", "二", "三", "四", "五", "六", "七", "八", "九"
	    ];
	    var str = num.toString();
	    var len = num.toString().length;
	    var C_Num = [];
	    for(var i = 0; i < len; i++){
	        C_Num.push(N[str.charAt(i)]);
	    }
	    return C_Num.join('');
	}
  componentDidMount(){
  	var itemId= this.props.scheConId;
  	var obj={};
  	var objs={};
    getSchedule(itemId).then((res) => {
 		if(res.schedule !== 'all')
            {
                var weeks =  res.schedule.split(';');//周
                var object = {};
                var newObj = {};
                for(var i in weeks)
                {
                    var index = this.numberTranslate(parseInt(i)+1);
                    object[index] = weeks[i].split(',');
                }
                obj.schedulelist = object;
                obj.scheduleSelect = object;
                for(var j in object) {
                	 var index = this.numberTranslate(parseInt(i)+1);
                	 newObj[index] = object[j]
                }
                objs.list = newObj
            }else
            {
                obj.schedulelist = res.schedule;
                obj.scheduleSelect = res.schedule;
               
            }
        Modal.alert(JSON.stringify(objs))
     	}, (error) => {
            Modal.alert(JSON.stringify(error));

        }); 
   }
  _renderContent(color, pageText, num) {
	      return (
	        <View style={{ backgroundColor: color,width:750,height:1000 }}> 
	        <Text>{pageText}</Text>
	        </View>
	      );
	  }

 onPress(index){
      console.log('点击了',new Date().getTime());
      this.setState({
          active:index
      })
  }
 
  siwtchTitleCustom(index,current){
    let active = {color:'#3089DC'};
    var commonSty = {color:'#000',textAlign:'center'};

    switch (index) {
      case 0:
        var style = {width:210};
        style = Object.assign(style,commonSty);
        if(index == current)
            style = Object.assign({},style,active)
        return (
            <TouchableHighlight  onPress={this.onPress.bind(this,index)}>
                <Text style={style}>当前设置</Text>
            </TouchableHighlight>
        )
        
      case 1:
        var style = {width:210};
        style = Object.assign(style,commonSty);
        if(index == current)
            style = Object.assign({},style,active)
        return (
            <TouchableHighlight  onPress={this.onPress.bind(this,index)}>
                <Text style={style}>全日制投放</Text>
            </TouchableHighlight>
        )
       
      case 2:
        var style = {width:210};
        style = Object.assign(style,commonSty);
        if(index == current)
            style = Object.assign({},style,active)
        return (
            <TouchableHighlight  onPress={this.onPress.bind(this,index)}>
                <Text style={style}>行业模板</Text>
            </TouchableHighlight>
        )
        
        
    }
  }
  render() {
      var self=this;
      return (
        <View>
         	<TabSlider navTop={true} width={750} style={styles.barStyle} active={this.state.active} customBar={true} index={this.state.index} onChange={this.sliderChange.bind(this)}>
	            <Pane style={{width:750}} renderTitleCustom={this.siwtchTitleCustom.bind(self,0,this.state.active)}>
	            	<Text>tab1</Text>
	            </Pane>
	            <Pane style={{width:750}} renderTitleCustom={this.siwtchTitleCustom.bind(self,1,this.state.active)}>
	              <Text>tab2</Text>
	            </Pane>
	            <Pane style={{width:750}} renderTitleCustom={this.siwtchTitleCustom.bind(self,2,this.state.active)}>
	             <Text>tab3</Text>
	            </Pane>
           </TabSlider>
       </View>
        )
  }
}
const styles = {
  textCenter:{
  	textAlign: 'center',
  	marginTop: '100rem',
  	color: 'red'
  },
  slider: {
    width: '750rem',
    position: 'relative',
    overflow: 'hidden',
    height: '452rem',
    backgroundColor: '#cccccc'
  },
  itemWrap: {
    width: '750rem',
    height: '352rem'
  },
  image: {
    width: '750rem',
    height: '352rem'
  },
  button: {
    marginTop: '20rem',
    width: '340rem',
    height: '80rem'
  },
  paginationStyle: {
    position: 'absolute',
    width: '750rem',
    height: '40rem',
    bottom: '20rem',
    left: 0,
    itemColor: 'rgba(255, 255, 255, 0.5)',
    itemSelectedColor: 'rgb(255, 80, 0)'
  },
  tab:{
    position:'relative',
    width:750,
    height:3000
  },
  tabBottom:{
    height:166,
    width:750,
    backgroundColor:'#333333',
    display:'flex',
    alignItems:'center',
    justifyContent:'middle'
  },
  barStyle:{
    backgroundColor:'#ffffff',
    height:120,
    width:750,
    overflow:'hidden',
    justifyContent:'flex-start'
  },
  fixSetting:{
    position:'absolute',
    right:20,
    top:20
  },
  dateList: {
  	height: '100rem',
  	alignItems:"center",
    flexDirection:"row",
    display:'flex'
  },
   amoutList:{
        backgroundColor:"#ffffff",
        height:"200rem",
        borderBottomWidth:"2rem",
        borderBottomStyle:"solid",
        borderBottomColor:"#e8e8e8",
        paddingTop:"40rem",
        alignItems:"center",
        flexDirection:"row",
        display:'flex'
     },
   amoutTextList:{
        fontSize:"24rem",
        color:"#5F646E",
        flex:3
        
    },
    amoutitemArrow:{
    	flex: 4,
    	fontSize:"24rem",
        color:"#5F646E" 
    },
    amoutitemArrows:{
    	flex: 5,
    	fontSize:"24rem",
        color:"#5F646E" 
    },
    title:{
    	textAlign: 'center',
    	paddingBottom: '40rem'
    }
};

export default ScheduleConView