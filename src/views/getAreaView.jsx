import { Dialog, Dimensions, Modal, Checkbox, Button } from 'nuke';
import {createElement, Component} from 'weex-rx';
import { View, Text,TouchableHighlight, ScrollView} from 'nuke-components';

import {mount} from 'nuke-mounter';
import QN from 'QAP-SDK';
import {getArea, setArea} from '../api'
let {height} = Dimensions.get('window');

let URL= document.URL;
let arr= QN.uri.parseQueryString(URL.split('?')[1]);
const campaign_id = arr.campaign_id;

class GetAreaView extends Component {
    constructor(props) {
        super(props);
        this.state={
        	localData: {},
        	areaArr: [],
        	areaStr: '',
        	checked: false,
        	areaId: '',
        	campaign_id: campaign_id,
        	areaArrs:[1,2,3,4,5,6,7,8],
        	areas:{
        		1:{
        			name: '华北地区', 
        			data:['19', '461', '125', '393', '333']
        		},
        		2:{
        			name: '东北地区', 
        			data:['294', '234', '165']
        		},
        		3:{
        			name: '华东地区', 
        			data:['417', '255', '508', '39', '1', '368']
        		},
        		4:{
        			name: '华中地区', 
        			data:['145', '184', '212', '279']
        		},
        		5:{
        			name: '华南地区', 
        			data:['68', '120', '92']
        		},
        		6:{
        			name: '西南地区', 
        			data:['532', '438', '488', '109', '463']
        		},
        		7:{
        			name: '西北地区', 
        			data:['406', '52', '357', '351', '471']
        		},
        		8:{
        			name: '其他地区', 
        			data:['578', '599', '576', '574']
        		}
        	},
        	areaobj: {
        		"19": {
        			parent: 1,
        			name: '北京',
        			s: 0
        		},
        		"461": {
        			parent: 1,
        			name: '天津',
        			s:0
        		},
        		"125": {
        			parent: 1,
        			name: '河北',
        			s:0
        		},
        		"393": {
        			parent: 1,
        			name: '山西',
        			s:0
        		},
        		"333": {
        			parent: 1,
        			name: '内蒙古',
        			s:0
        		},
        		"294": {
        			parent: 2,
        			name: '辽宁',
        			s:0
        		},
        		"234": {
        			parent: 2,
        			name: '吉林',
        			s:0
        		},
        		"165": {
        			parent: 2,
        			name: '黑龙江',
        			s:0
        		},
        		"417": {
        			parent: 3,
        			name: '上海',
        			s:0
        		},
        		"255": {
        			parent: 3,
        			name: '江苏',
        			s:0
        		},
        		"508": {
        			parent: 3,
        			name: '浙江',
        			s:0
        		},
        		"39": {
        			parent: 3,
        			name: '福建',
        			s:0
        		},
        		"1": {
        			parent: 3,
        			name: '安徽',
        			s:0
        		},
        		"368": {
        			parent: 3,
        			name: '山东',
        			s:0
        		},
        		"145": {
        			parent: 4,
        			name: '河南',
        			s:0
        		},
        		"184": {
        			parent: 4,
        			name: '湖北',
        			s:0
        		},
        		"212": {
        			parent: 4,
        			name: '湖南',
        			s:0
        		},
        		"279": {
        			parent: 4,
        			name: '江西',
        			s:0
        		},
        		"68": {
        			parent: 5,
        			name: '广东',
        			s:0
        		},
        		"120": {
        			parent: 5,
        			name: '海南',
        			s:0
        		},
        		"92": {
        			parent: 5,
        			name: '广西',
        			s:0
        		},
        		"532": {
        			parent: 6,
        			name: '重庆',
        			s:0
        		},
        		"438": {
        			parent: 6,
        			name: '四川',
        			s:0
        		},
        		"488": {
        			parent: 6,
        			name: '云南',
        			s:0
        		},
        		"109": {
        			parent: 6,
        			name: '贵州',
        			s:0
        		},
        		"463": {
        			parent: 6,
        			name: '西藏自治区',
        			s:0
        		},
        		"406": {
        			parent: 7,
        			name: '陕西',
        			s:0
        		},
        		"52": {
        			parent: 7,
        			name: '甘肃',
        			s:0
        		},
        		"357": {
        			parent: 7,
        			name: '青海',
        			s:0
        		},
        		"351": {
        			parent: 7,
        			name: '宁夏回族自治区',
        			s:0
        		},
        		"471": {
        			parent: 7,
        			name: '新疆维吾尔自治区',
        			s:0
        		},
        		"578": {
        			parent: 8,
        			name: '台湾',
        			s:0
        		},
        		"599": {
        			parent: 8,
        			name: '香港',
        			s:0
        		},
        		"576": {
        			parent: 8,
        			name: '澳门',
        			s:0
        		},
        		"574": {
        			parent: 8,
        			name: '国外',
        			s:0
        		}
        	}
        	
        }
    }
   componentDidMount () {
        var self = this;
        getArea(this.state.campaign_id).then((result) => {
        	if(result.area === 'all') {
        		result.area='19,461,125,393,333,294,234,165,417,255,508,39,1,368,145,184,212,279,68,120,92,532,438,488,109,463,406,52,357,351,471,578,599,576,574'
        	}        	
        	var res = result.area.split(',')
        	var obj = {};
        	for(var i = 0; i < res.length; i++) {
        		var idx = res[i];
        		var tobj = self.state.areaobj[idx]
        		obj[idx] = {
        			s: 1,
        			name: tobj && tobj.name
        		};
        	}
        	
        	var newcitys = Object.assign({}, self.state.areaobj, obj);
          	
        	var areaNewArr= result.area.concat([]);
        	var check = this.state.checked;
        	self.setState({
        		areaobj: newcitys,
        		areaArr: areaNewArr,
        		checked: !check
        	})
     		}, (error) => {
            Modal.alert(JSON.stringify(error));

        });
        
    }
	sureModal = () => {
        var areaobj =this.state.areaobj;
        var areaItem = [];
        var areaId= this.state.campaign_id
         for(var i in areaobj) {
         	if(areaobj[i].s == 1) {
         		areaItem.push(i)
         	}
         }
         setArea(areaId, areaItem).then((result) => {
         		if(result.length !== 0) {
         			Modal.toast('设置成功');
         			QN.navigator.push({
					    url: 'qap://views/campaignsList.js',
					   	settings: {
					        animate: true
					       
					    } 
					});
         		}
             	}, (error) => {
	                Modal.alert(JSON.stringify(error));
	
	            }); 
    }
    changeArea (id, value) {
    	var arrId = [];
		var areaobj = this.state.areaobj;
		var newareaobj = Object.assign({}, areaobj, {[id]: {name: areaobj[id]['name'], s: value}});
    	this.setState({
    		areaobj: newareaobj
    	})
    }
    render() {
    	var self= this;
    	return (
            <View>
                <View style={styles.modalStyle}>
                    <ScrollView style={styles.body} onEndReachedThreshold={300}>
                    	<View>
	                    	{this.state.areaArr.length === 0 ? <Text>Loading...</Text> : 
	                    		<View>
		                    		{ this.state.areaArrs.map((item, index) => {
		                    				var items = this.state.areas[item].data
		                    				return (
		                    					<View>
		                    						<Text style={styles.title}> {this.state.areas[item].name} </Text>
		                    						{
		                    							items.map((cityid) => {
		                    								let city = this.state.areaobj[cityid]
		                    								return (
		                    									<View style={styles.amoutList}>
								                    				<Checkbox 
								                    					defaultChecked={city.s}
								                   						onChange={this.changeArea.bind(this,cityid) }
								                       				/>
										                    		<Text>{city.name}</Text>
							                    			    </View>
		                    								)
		                    							})
		                    						}
		                    					</View>
		                    				)
		                    			})
		                    		}
	                    	</View>
	                    	}
                    	</View>
                    </ScrollView>

                    <View style={{marginLeft:'20rem',marginRight:'20rem'}} >
                            <Button style={{height:"80rem",marginBottom:'30rem'}}  onPress={this.sureModal} block="true" type="secondary">保存设置</Button>
                    </View>
				</View>
            </View>
        );
    }
}
var styles = {
 modalStyle: {
    width: '750rem',
    height: height-10
   
  },
  body: {
    alignItems: 'left',
    justifyContent: 'left',
    backgroundColor: '#fff',
    height: height-60
  },
  
  button: {
    width: '300rem',
    height: '60rem',
    borderWidth: '1rem',
    borderStyle: 'solid',
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
   	    padding: '30rem',
   	    backgroundColor: '#e8e8e8',
	   	color: '#333',
	   	fontSize: '35rem'
	   
	   },
   amoutList:{
   	    paddingLeft:'30rem',
   	    alignItems:"center",
        flexDirection:"row",
        display:'flex'
       }
   
};

export default GetAreaView

mount(<GetAreaView/>, 'body');