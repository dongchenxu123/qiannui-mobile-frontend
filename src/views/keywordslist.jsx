'use strict';
import {mount} from 'nuke-mounter';
import {createElement, Component} from 'weex-rx';
import {View, Text, Link, Grid, Col, Image, Modal, Input, Checkbox, TabSlider } from 'nuke';
import {getRecommendKeywords, addNewKeyword} from '../api'
import KeywordsView from './recommendKeywords';
import _ from 'lodash'

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
	         	result.map((v,i)=>{

                    if(v.checked == undefined){
                       v.checked = 0;
                    }
                })
				
	            this.setState({
	            	keywords: result
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
	changecheckbox(w, value) {
        var checked = value == true? 1:0;
        var index = _.findIndex(this.state.keywords, function(o) { return o.word == w; });
        var newdata = this.state.keywords[index].checked = checked;
        this.setState({keywords:newdata});
            
        var data = _.findIndex(this.state.keywords, function(o) { return o.checked == 1; });

            console.log(JSON.stringify(data));

		
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
	 	var min= parseInt(this.state.minprice);
	 	var max= parseInt(this.state.maxprice);
	 	var keywrodsId= this.state.keywrodsId;
	 	console.log(keywords)
	 	Modal.alert(JSON.stringify(keywords))
	 	for (var i=0; i< keywords.length; i++) {
	 		if(keywords[i].checked ==1) {
	 			res.push(keywords[i])
	 		}
	 	}
	 	Modal.alert(JSON.stringify(res))
	 	var newData= this.formatNewword(res,2,min,max);
	 	Modal.alert(JSON.stringify(newData))
	 	addNewKeyword(this.state.adgroup_id, newData).then((result) => {
         	Modal.alert(JSON.stringify(result))
           
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
	    		    <Input onChange={this.changeMinnum.bind(this)} value={this.state.minprice}/>
	    		    <Text style={{paddingLeft: '10rem'}}>至</Text>
	    		    <Input style={{paddingLeft: '10rem'}} onChange={this.changeMaxnum.bind(this)} value={this.state.maxprice}/>
	    		    <Text style={{paddingLeft: '10rem'}}>元</Text>
    		    </View>
    		     <TabSlider width={750} style={styles.barStyle} active={this.state.active}  index={this.state.index} onChange={this.sliderChange.bind(this)}  customBar={false} navTop={true}>
		            <Pane title={'关键词库'} style={{width:750,backgroundColor:'#414A8C'}}>
		            	<View style={styles.tab}>123</View>
		            </Pane>
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


