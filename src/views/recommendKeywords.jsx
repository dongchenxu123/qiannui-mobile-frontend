'use strict';
import {mount} from 'nuke-mounter';
import {createElement, Component} from 'weex-rx';
import {View, Text, Link, Grid, Col, Image, Dimensions, Dialog, Checkbox, ScrollView, TouchableHighlight, MultiRow, Modal, Button} from 'nuke';
let {height} = Dimensions.get('window');
import { addNewKeyword } from '../api';
import {number_format } from './util';

class RecommendKeywords extends Component {
	constructor() {
        super();
        this.state = {
            checked:false
        }
    }
	changeControl (index, value) {
		this.props.changecheckbox(index, value)
	}

	render () {
		var keywords= this.props.keywords.data;
		var keywordObj = this.props.keywords.obj;
		var lengths= keywords.length === 0 ? 0: keywords.length;
		return (
			    <View>
				<ScrollView style={styles.scroller} onEndReachedThreshold={300}>
				    <View style={styles.cellItemList}>
				     	<Text style={{padding: '10rem',alignItems:"center", justifyContent: 'center',fontSize:'32rem'}}>推荐关键词数量为</Text>
				     	<Text style={{padding: '20rem', color: '#3089dc',fontSize:'32em'}}>{lengths}</Text>
				     	<Text style={{paddingLeft: '20rem',fontSize:'32rem'}}>个</Text>
				    </View>
                     <View style={[styles.subCell,{backgroundColor:'#EBEBEB'}]}>       
                       <View style={{flex:'30rem'}}><Text></Text></View>
                       <View style={styles.col2}><Text style={styles.col4}>关键词</Text></View>
                       <View style={styles.col2}><Text style={styles.col4}>展现指数</Text></View>
                       <View style={styles.col2}><Text style={styles.col4}>平均出价</Text></View>
                       <View style={styles.col1}><Text style={styles.col4}>相关度</Text></View>
                    </View> 
				    
				    {
				    	keywords.length === 0 
				    	? ''
				    	: <View>{
				    		keywords.map((item, index) =>{
				    			return (
			    				 <View style={styles.subCell}> 
			    				   	<View style={{flex:'30rem'}}><Checkbox onChange={this.changeControl.bind(this, item)}/></View>
			    					<View style={styles.col2}><Text style={styles.col3}>{keywordObj[item].word}</Text></View>
							     	<View style={styles.col2}><Text style={styles.col3}>{keywordObj[item].pv ? number_format(keywordObj[item].pv) : 0}</Text></View>
							     	<View style={styles.col2}><Text style={styles.col3}>{keywordObj[item].average_price? keywordObj[item].average_price : 0}</Text></View>
							     	<View style={styles.col1}><Text style={styles.col3}>{keywordObj[item].pertinence ? keywordObj[item].pertinence : 0}</Text></View>
							     </View>
				    			)
				    		})
				    	}
				        </View>	
				    }
				    
			     </ScrollView>
			     <View style={{margin: '10rem'}}>
                    <Button type="secondary" block="true" onPress={this.props.submitKeywords}>保存设置</Button>
                </View>
			</View>
		)
	}
}

const styles={
	scroller:{
	      width: 750,
	      height: height-330,
	      flex: 1
	   },
	cellItemList:{
        backgroundColor:"#ffffff",
       	borderBottomWidth:"2rem",
        borderBottomStyle:"solid",
        borderBottomColor:"#e8e8e8",
       	alignItems:"center",
        flexDirection:"row",
        display: 'flex',
        padding: '10rem',
        borderTopWidth:"2rem",
        borderTopStyle:"solid",
        borderTopColor:"#e8e8e8"
  },
   subCell:{
    padding:'20rem 0 20rem 10rem',
    borderBottomStyle:'solid',
    borderBottomWidth:'1rem',
    borderBottomColor:'#e8e8e8',  
    flexDirection:"row",
    display:'flex',
  },
   col1:{
        fontSize:'30rem',
        color:'#5F646E',
        paddingRight:'5rem',
        flex:45
    },
  col2:{
        fontSize:'30rem',
        color:'#5F646E',
        paddingRight:'5rem',
        flex:62
  },
  col3:{
    fontSize:'26rem',
  },
   col4:{
    fontSize:'30rem'
  }
}

export default RecommendKeywords