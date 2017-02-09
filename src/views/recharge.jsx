import { Dialog, Dimensions, Modal, Checkbox, Button } from 'nuke';
import {createElement, Component} from 'weex-rx';
import { View, Text,TouchableHighlight, ScrollView} from 'nuke-components';
import {mount} from 'nuke-mounter';
import QN from 'QAP-SDK';
import {number_format} from './util';
let {height} = Dimensions.get('window');
var  ItemList={
        backgroundColor:"#fff",
        padding: '20rem',
        borderWidth:"2rem",
        borderStyle:"solid",
        borderColor:"#e8e8e8",
       	paddingLeft:"30rem",
        alignItems:"center",
        width: '650rem'
   }
   var hightItemList={
        backgroundColor:"#fff",
        padding: '20rem',
        borderWidth:"2rem",
        borderStyle:"solid",
        borderColor:"#f50",
       	paddingLeft:"30rem",
        alignItems:"center",
        width: '650rem'
   }
class RechargeView extends Component {
    constructor(props) {
        super(props);
        this.state={
        	defaultStyle: ItemList,
        	hightStyle: hightItemList
    	}
    }
   showModal () {
        var self = this;
        this.refs.modal.show();
        Modal.alert(JSON.stringify(this.props.moneys))
    }
	hideModal = () => {
        this.refs.modal.hide();
    }
    onShow() {
      
    }
	onHide = (param) => {
        console.log('modal hide', param);
    }
   
    render() {
    	var self= this;
    	var moneys= this.props.moneys;
    	var real_text= this.props.real_text;
    	var luckily_text_1= this.props.luckily_text_1;
    	return (
            <View>
                <View style={{left:'-22rem'}} >        
                  <Button type="primary" onPress={this.showModal.bind(self)}>充值</Button>
                </View>
                <Dialog ref="modal" contentStyle={styles.modalStyle} onShow={this.onShow.bind(self)} onHide={this.onHide}>
                    <ScrollView style={styles.body} onEndReachedThreshold={300}>
                    	<TouchableHighlight>
	                    	<Text style={[styles.cellItemList,{backgroundColor: '#e8e8e8'}]}>选择充值金额</Text>
	                    	
	                    	{
	                    	  moneys.length ===0 ? <Text>Loading...</Text> : moneys.map((item, index) => {
	                    	  	var discount = parseInt(item.discount);
	                            var total_fee = parseInt(item.total_fee);
	                            var luckily_money_1 = parseInt(item.luckily_money_1);
	                            var luckily_money_2 = parseInt(item.luckily_money_2);
	                            var highlight = parseInt(item.highlight);
	                            var tl1l2 = total_fee + luckily_money_1 + luckily_money_2;
	                           
	                    	  	return (
	                    	  		<View style={styles.cellItemList}>
	                    	  			<TouchableHighlight style={highlight == 1 ? this.state.hightStyle: this.state.defaultStyle}>
	                    	  				<View>
	                    	  				    {discount == 1
	                    	  				    	? <Text>{number_format(tl1l2)}元</Text>
	                    	  				    	: <Text>{number_format(total_fee)}元</Text>
	                    	  				    }
	                    	  				</View>
	                    	  				<View>
	                    	  				    {parseInt(item.discount) == 1 && total_fee > 0
	                    	  				    	? <View>
	                    	  				    														<Text> {(parseFloat(total_fee)/tl1l2 * 10).toFixed(1)} 折</Text>
	                    	  				    		<Text style={styles.highfont}>现仅需{
	                    	  				    			item.total_fee
	                    	  				    		}元</Text>
	                    	  				    														
	                    	  				    	</View>
	                    	  				    	: <Text style={styles.highfont}>实得{number_format(tl1l2)}元</Text>
	                    	  				    }
	                    	  				</View>	
	                    	  				<View>
	                    	  					{luckily_money_1>0 
	                    	  							? <Text>{real_text.replace(/\{money\}/gi, luckily_money_1)}</Text>
	                    	  							: ''
	                    	  					}
	                    	  					{
	                    	  						luckily_money_2> 0
	                    	  							? <Text>{luckily_text_1.replace(/\{money\}/gi, luckily_money_2)}</Text>
	                    	  							: ''
	                    	  					}
	                    	  					{
	                    	  						item.luckily_text ? item.luckily_text : ''
	                    	  					}
	                    	  				</View>
	                    	  				
	                    	  				
	                    	  				
	                    	  				
	                    	  			</TouchableHighlight>
	                    	  		</View>
	                    	  	)
	                    	  })
	                    	}
	                    	</TouchableHighlight>
	                    
                    </ScrollView>
                    <View style={{marginLeft:'20rem',marginRight:'20rem'}} >
                            <Button style={{height:"80rem",marginBottom:'30rem'}} block="true" type="secondary">支付宝充值</Button>
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
  cellItemList:{
        backgroundColor:"#fff",
        padding: '20rem',
       	paddingLeft:"30rem",
        alignItems:"center",
        flexDirection:"row",
        display:'flex' 
   },
   ItemList:{
        backgroundColor:"#fff",
        padding: '20rem',
        borderWidth:"2rem",
        borderStyle:"solid",
        borderColor:"#e8e8e8",
       	paddingLeft:"30rem",
        alignItems:"center",
        width: '650rem'
   },
   hightItemList:{
        backgroundColor:"#fff",
        padding: '20rem',
        borderWidth:"2rem",
        borderStyle:"solid",
        borderColor:"#f50",
       	paddingLeft:"30rem",
        alignItems:"center",
        width: '650rem'
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
    width: '60rem',
    height: '60rem',
    borderRadius: '40rem',
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
      },
   highfont: {
   	color: '#FF6600'
   }
};

export default RechargeView