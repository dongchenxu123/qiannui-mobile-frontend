'use strict';
import {mount} from 'nuke-mounter';
import {createElement, Component} from 'weex-rx';
import {View, Text, Link, Grid, Col, Image, Modal, Input, Checkbox, TabSlider } from 'nuke';
import {getRecommendKeywords, addNewKeyword} from '../api'
import RecommendKeywords from './recommendKeywords';
import QN from 'QAP-SDK';

const { Pane } = TabSlider;
let URL= document.URL;
let arr= QN.uri.parseQueryString(URL.split('?')[1]);
const adgroup_id = arr.adgroup_id;

class AddKeyWordsView extends Component {
	constructor() {
		super()
		this.state={
			keywordsList: [],
			selectedTab: 'tab1',
            notifCount: 0,
            presses: 0,
            index:2,
            active:0,
            adgroup_id: adgroup_id,
            newKeywordList: [],
            minprice:'' ,
            maxprice: '',
            newwords: [],
            words:[],
            keywrodsId:[],
            keywords:{}
		}
		
	}
	componentDidMount () {
        getRecommendKeywords(this.state.adgroup_id).then((result) => {
	         	var keywords={};
				var keywrodsId=[];
                
				for (var i=0; i< result.length; i++) {
					keywords[i] = result[i];
					keywords[i]['checked'] = false;
					keywrodsId.push(i);
				}
	            this.setState({
	            	keywords: keywords,
	            	keywrodsId: keywrodsId
	            })
            }, (error) => {
                Modal.alert(JSON.stringify(error));
            });  
       }
	 sliderChange(index){
		this.setState({
			active: index
		})
	  }
	_renderContent(color, pageText, num) {
      return (
        <View style={{ backgroundColor: color }}>
          <Text>{pageText}</Text>
        </View>
      );
  }
	changecheckbox  (item, value) {
		let changeItem = Object.assign({}, this.state.keywords[item], {checked: value})
		let newKeywords = Object.assign({},this.state.keywords, {[item]: changeItem});
		this.setState({
			keywords: newKeywords
		})
		
	}
	changeMinnum(value){
	 	this.setState({
	 		minprice: this.clearNoNum(value)
	 	})
	}
	 changeMaxnum (value) {
	 	 this.setState({
	 		maxprice: this.clearNoNum(value)
	 	})
	 }
	 formatNewword (res,type,min,max) {
	 	var self = this,data = [];
        var obj = {};
       if(res){
            for(var i in res){
                obj = {'word':res[i].word,isDefaultPrice:0,matchScope:4};
                obj.maxPrice = self.getRandomNum(min,max);
                data.push(obj);
            }
        }
        return data; 
    }
	getRandomNum (Min,Max){
        var Range = Max - Min;
        var Rand = Math.random();
        var num = Min + Math.round(Rand * Range);
        return num;
    }

    clearNoNum(value){  
        value = value.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符   
        value = value.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的   
        value = value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");  
        value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数   
        if(value.indexOf(".")< 0 && value !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额  
          value= parseFloat(value);  
        }  
        return value
    } 
	submitKeywords () {
        var res= [];
		let keywords = this.state.keywords;
        var min = this.state.minprice * 100;
        var max = this.state.maxprice * 100;
	 	var keywrodsId= this.state.keywrodsId;

       // var reg = new RegExp("^[0-9]*$");

	 	if(min< 5) {
	 		Modal.alert('出价不能低于0.05元');
            return;
	 	}
        if(max > 9999) {
	 		Modal.alert('出价不能高于99元');
            return;
	 	}

	 	for (var i in keywords) {
	 		if(keywords[i].checked == true) {
	 			res.push(keywords[i]);
	 		}
	 	}
	 	var newData= this.formatNewword(res,2,min,max);
	 	if(res.length >200) {
	 		Modal.alert('添加关键词数量不得大于200');
            return;
	 	}
        if(newData.length == 0 ) {
            Modal.alert('请选择需要添加的关键词');
            return;
        }
     
	 	addNewKeyword(this.state.adgroup_id, newData).then((result) => {
                if(result.sub_msg != undefined ){
                    Modal.alert(result.sub_msg);
                    return;
                }else{
                    if(result.length >0){  
                        Modal.alert("关键词添加成功");
                    }
                }
            }, (error) => {
                Modal.alert(JSON.stringify(error));
            });  
	 }
	render () {
		let keywords = {
			data: this.state.keywrodsId, 
            obj: this.state.keywords
		}
		return (
			<View>
			     <View style={styles.cellItemList}>
	    		    <Text style={{fontSize:'32rem'}}>出价范围: </Text>
	    		    <Input onChange={this.changeMinnum.bind(this)} value={this.state.minprice} keyboardType="number-pad" />
	    		    <Text style={{paddingLeft: '10rem',paddingRight: '10rem',fontSize:'32rem'}}>至</Text>
	    		    <Input style={{paddingLeft: '10rem'}} onChange={this.changeMaxnum.bind(this)} value={this.state.maxprice} keyboardType="number-pad"/>
	    		    <Text style={{paddingLeft: '10rem',fontSize:'32rem'}}>元</Text>
    		    </View>
    		    <TabSlider width={750} style={styles.barStyle} active={this.state.active}  index={this.state.index} onChange={this.sliderChange.bind(this)}  customBar={false} navTop={true}>
		            <Pane title={'推荐关键词库'}  style={{width:750,fontSize:'32rem'}}>
              			<View style={styles.tab}>
              				<RecommendKeywords 
                            keywords={keywords} 										 										  
                            changecheckbox={this.changecheckbox.bind(this)}
              				submitKeywords={this.submitKeywords.bind(this)}
              				/>
              			</View>
            		</Pane>
        		</TabSlider>
    		</View>
		)
	}
}
const styles={
	cellItemList:{
        backgroundColor:"#ffffff",
        padding: '20rem',
        borderBottomWidth:"2rem",
        borderBottomStyle:"solid",
        borderBottomColor:"#e8e8e8",
       	alignItems:"center",
        flexDirection:"row",
        display: 'flex'
   },
   barStyle:{
    backgroundColor:'#ffffff',
    height: '100rem'
  }
    
}
mount(<AddKeyWordsView />, 'body');


