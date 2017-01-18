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
	         	Modal.alert(JSON.stringify(result))
				var keywords={};
				var keywrodsId=[]
				for (var i=0; i< result.length; i++) {
					keywords[i] = result[i];
					keywords[i]['checked'] = 0;
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
//		var keywords= this.state.keywordsList.length=== 0 ? '' : this.state.keywordsList;
//		var idx=0;
//		var n=0
//		var newKeywordList= this.state.newKeywordList;
//		var words= this.state.words;
//		if(value== 1) {
//				for(var i=0; i<keywords.length; i++) {
//				if(index==i) {
//					idx = i
//				newKeywordList.push(keywords[idx])
//				}
//			}
//		}else{
//			for (var j=0; j<newKeywordList.length; j++) {
//				if(index==j) {
//					n= j
//					var delword= newKeywordList.slice(n, newKeywordList.length)
//					
//					newKeywordList= new Set([...newKeywordList, ...delword])
//				}
//			}
//		}
		let newKeywords = Object.assign({}, this.state.keywords, {[item]: {checked: value}})
		
		this.setState({
			keywordObj: newKeywords
		})
//		Modal.alert(JSON.stringify(delword))
		
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


