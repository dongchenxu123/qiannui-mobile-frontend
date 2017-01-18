import { Dialog, Dimensions, Modal, Checkbox, Button } from 'nuke';
import {createElement, Component} from 'weex-rx';
import { View, Text,TouchableHighlight, ScrollView} from 'nuke-components';

import {mount} from 'nuke-mounter';
import QN from 'QAP-SDK';
import {getArea, setArea} from '../../api'
let {height} = Dimensions.get('window');

class GetAreaView extends Component {
    constructor(props) {
        super(props);
        this.state={
        	localData: {},
        	areaArr: [],
        	areaStr: '',
        	checked: false,
        	areaId: '',
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
   showModal () {
        var self = this;
        getArea(this.props.localId).then((result) => {
        	//Modal.alert(result.area)
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
            //Modal.alert(JSON.stringify(this.state.areaArr))
     		}, (error) => {
            Modal.alert(JSON.stringify(error));

        });
        this.refs.modal.show();
    }
	hideModal = () => {
        this.refs.modal.hide();
    }
    sureModal = () => {
        this.refs.modal.hide();
        var areaobj =this.state.areaobj;
        var areaItem = [];
        var areaId= this.props.localId
         for(var i in areaobj) {
         	if(areaobj[i].s == 1) {
         		areaItem.push(i)
         		
         	}
         }
         setArea(areaId, areaItem).then((result) => {
         		if(result.length !== 0) {
         			Modal.toast('设置成功')
         		}
             	}, (error) => {
	                Modal.alert(JSON.stringify(error));
	
	            }); 
       
    }
    onShow() {
      
    }
	onHide = (param) => {
        console.log('modal hide', param);
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
    	//var localItemId= self.props.localId;
    	return (
            <View>
                <TouchableHighlight onPress={this.showModal.bind(self)}>
                  <Button type="primary">设置</Button>
                </TouchableHighlight>
                <Dialog ref="modal" contentStyle={styles.modalStyle} onShow={this.onShow.bind(self)} onHide={this.onHide}>
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
                    <View style={styles.footer}>
                        <TouchableHighlight style={styles.button} onPress={this.hideModal}>
                            <Text>取消</Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={[styles.button,{marginLeft: '20rem'}]} onPress={this.sureModal}>
                            <Text>确定</Text>
                        </TouchableHighlight>
                    </View>
                    <TouchableHighlight style={styles.close} onPress={this.hideModal}>
                        <Text style={styles.closeText}>x</Text>
                    </TouchableHighlight>
                </Dialog>
            </View>


        );
    }
}
var styles = {
 modalStyle: {
    width: '700rem',
    height: height-100
   
  },
  body: {
    alignItems: 'left',
    justifyContent: 'left',
    backgroundColor: '#fff',
    height: height-260
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '120rem',
    flexDirection:"row",
	display:'flex'
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
  close: {
    borderWidth: '1rem',
    borderStyle: 'solid',
    borderColor: '#ccc',
    position: 'absolute',
    top: '-18rem',
    right: '-18rem',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40rem',
    height: '40rem',
    borderRadius: '20rem',
    backgroundColor: '#ffffff'
  },
  closeText: {
    fontSize: '28rem',
    color: '#000000'
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