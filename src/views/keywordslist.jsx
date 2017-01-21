'use strict';
import {mount} from 'nuke-mounter';
import {createElement, Component} from 'weex-rx';
import {View, Text, Link, Grid, Col, Image, Modal, Input, Checkbox, TabSlider } from 'nuke';
import {getRecommendKeywords, addNewKeyword} from '../api'
import KeywordsView from './recommendKeywords';

const { Pane } = TabSlider;
class KeywordslistView extends Component {
	constructor() {
		super()
		this.state={
			keywordsList: [],
			selectedTab: 'tab1',
            notifCount: 0,
            presses: 0,
            index:2,
            active:0,
            adgroup_id: '',
            newKeywordList: [],
            minprice: 0,
            maxprice: 0,
            newwords: [],
            words:[],
            keywrodsId:[],
            keywords:{}
		}
		
	}
	componentDidMount () {
		var URL= document.URL;
		var arr= URL.split('?')[1];
		var newarr= arr.split('&');
		var obj={}
		var param;
        for(var i=0;i<newarr.length;i++){
            param=newarr[i].split('=');
            obj[param[0]]=param[1];
        }
        var adgroup_id= this.state.adgroup_id;
        this.setState({
        	adgroup_id: obj.adgroup_id
        })
        getRecommendKeywords(this.state.adgroup_id).then((result) => {
	         	var keywords={};
				var keywrodsId=[]
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
//	    console.log('slide-to', index);
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
	 		minprice: value
	 	})
	}
	 changeMaxnum (value) {
	 	 this.setState({
	 		maxprice: value
	 	})
	 }
	 formatNewword (res,type,min,max) {
	 	var self = this,data = [];
        var obj = {};
       if(res)
        {
            for(var i in res)
            {
                obj = {'word':res[i].word,isDefaultPrice:0,matchScope:4};
                {
                    obj.maxPrice = self.getRandomNum(min,max);
                }
                data.push(obj);
            }
        }
        return data;
       
    }
	getRandomNum (Min,Max){
        var Range = Max - Min;
        var Rand = Math.random();
        console.log(Rand);
        var num = Min + Math.round(Rand * Range);
        return num;
    }
	submitKeywords () {
	 	var res= [];
		let keywords = this.state.keywords;
	 	var min= parseInt(this.state.minprice)*100;
	 	var max= parseInt(this.state.maxprice)*100;
	 	var keywrodsId= this.state.keywrodsId;
	 	if(min< 5 && min !== 0) {
	 		Modal.alert('出价不能低于0.05元')
	 	}else if(max > 9999) {
	 		Modal.alert('出价不能高于99元')
	 	}
	 	for (var i in keywords) {
	 		if(keywords[i].checked == true) {
	 			res.push(keywords[i])
	 		}
	 	}
	 	var newData= this.formatNewword(res,2,min,max);
	 	if(res.length >200) {
	 		Modal.alert('请你添加关键词数量小于200')
	 	}
	 	addNewKeyword(this.state.adgroup_id, newData).then((result) => {
	 		Modal.alert(JSON.stringify(result))
         	  if(result.length ===0) {
         	  	Modal.alert('请你选择关键词')
         	  }else if(min==0 && max==0) {
         	  	Modal.alert('请你填写出价范围')
         	  }else{
         	  	Modal.toast('设置成功！')
         	  }
           
            }, (error) => {
                Modal.alert(JSON.stringify(error));

            });  
	 }
	render () {
		let keywords = {
			data: this.state.keywrodsId, obj: this.state.keywords
		}
		return (
			<View>
			     <View style={styles.cellItemList}>
	    		    <Text>出价范围: </Text>
	    		    <Input onChange={this.changeMinnum.bind(this)} value={this.state.minprice} keyboardType="number-pad" />
	    		    <Text style={{paddingLeft: '10rem'}}>至</Text>
	    		    <Input style={{paddingLeft: '10rem'}} onChange={this.changeMaxnum.bind(this)} value={this.state.maxprice} keyboardType="number-pad"/>
	    		    <Text style={{paddingLeft: '10rem'}}>元</Text>
    		    </View>
    		     <TabSlider width={750} style={styles.barStyle} active={this.state.active}  index={this.state.index} onChange={this.sliderChange.bind(this)}  customBar={false} navTop={true}>
		          <Pane title={'推荐关键词库'}  style={{width:750}}>
              			<View style={styles.tab}>
              				<KeywordsView keywords={keywords} 										 										  changecheckbox={this.changecheckbox.bind(this)}
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
mount(<KeywordslistView />, 'body');


