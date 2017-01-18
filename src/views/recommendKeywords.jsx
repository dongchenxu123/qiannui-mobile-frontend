'use strict';
import {mount} from 'nuke-mounter';
import {createElement, Component} from 'weex-rx';
import {View, Text, Link, Grid, Col, Image, Dimensions, Dialog, Checkbox, ScrollView, TouchableHighlight, MultiRow, Modal, Button} from 'nuke';
let {height} = Dimensions.get('window');
import { addNewKeyword } from '../api';

class KeywordsView extends Component {
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
				    <View style={[styles.cellItemList, {borderTopWidth:"2rem",borderTopStyle:"solid",borderTopColor:"#e8e8e8"}]}>
				     	<Text style={{padding: '20rem',alignItems:"center", justifyContent: 'center'}}>推荐关键词数量为</Text>
				     	<Text style={{padding: '20rem', color: '#3089dc'}}>{lengths}</Text>
				     	<Text style={{paddingLeft: '20rem'}}>个</Text>
				    </View>
				    <View style={styles.cellItemList}>
				     	<Checkbox style={styles.arrow} checked={this.state.checked}/>
				     	<Text style={styles.arrow}>关键词</Text>
				     	<Text style={styles.arrow}>展现指数</Text>
				     	<Text style={styles.arrow}>市场平均出价</Text>
				     	<Text style={styles.arrow}>相关度</Text>
				    </View>
				    {
				    	keywords.length === 0 
				    	? <Text>Loading...</Text>
				    	: <View>{
				    		keywords.map((item, index) =>{
				    			return (
				    				<View style={styles.cellItemList}>
				    					<Checkbox style={styles.arrow} onChange={this.changeControl.bind(this, item)}/>
								     	<Text style={styles.arrow}>{keywordObj[item].word}</Text>
								     	<Text style={styles.arrow}>{keywordObj[item].pv}</Text>
								     	<Text style={styles.arrow}>{keywordObj[item].average_price}</Text>
								     	<Text style={styles.arrow}>{keywordObj[item].pertinence}</Text>
				    				</View>
				    			)
				    		})
				    	}
				    	</View>	
				    	
				    }
				    
			     </ScrollView>
			     <View>
                    <Button type="secondary" style={{marginTop: '20rem'}} onPress={this.props.submitKeywords}>保存设置</Button>
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
        display: 'flex'
  },
  
  arrow: {
  	flex: 3
  	
    
  },
  gridcell:{
        height:'200rem',
        'justifyContent':'center',
        'alignItems':'center',
        'border':'1rem',
        'borderStyle':'solid',
        'borderColor':'#e8e8e8',
        'marginTop':'-1rem',
        'marginLeft':'-1rem'
    },
}

export default KeywordsView