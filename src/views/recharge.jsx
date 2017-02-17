import { Dialog, Dimensions, Modal, Checkbox, Button } from 'nuke';
import {createElement, Component} from 'weex-rx';
import { View, Text,TouchableHighlight, ScrollView} from 'nuke-components';
import {mount} from 'nuke-mounter';
import QN from 'QAP-SDK';
import { getRechargeTempalte } from '../api/dsp';
import { httphost } from '../api/date';
import { showLoading,hideLoading,number_format } from './util';
let {height} = Dimensions.get('window');
let URL= document.URL;
let params= QN.uri.parseQueryString(URL.split('?')[1]);

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
        	hightStyle: hightItemList,
        	currentIndex: -1,
        	rechargeMoney: '?',
        	user_id: params.user_id,
        	RechargeData: [],
            real_text: '',
            luckily_text_1: '',
            account_id: params.account_id
    	}
      showLoading();
    }
    componentDidMount() {
    	getRechargeTempalte(this.state.user_id).then((res) => {
                  hideLoading();
                	this.setState({
                		RechargeData: res.data.data.moneys,
                		real_text: res.data.data.real_text,
                		luckily_text_1: res.data.data.luckily_text_1
                	})
                	
                })
    }
   hideSureModal = () => {
        this.refs.suremodal.hide();
    }
    onShow() {
      
    }
	  onHide = (param) => {
        console.log('modal hide', param);
    }
    changeHighlight (index, total_fee) {
    	this.setState({
    		currentIndex: index,
    		rechargeMoney: total_fee
    	})
    	
    }
    check_highlight_index(index){
        return index===this.state.currentIndex ? this.state.hightStyle : this.state.defaultStyle;
    }
    gopay () {
    	if(this.state.rechargeMoney > 0) {
        this.refs.suremodal.show();
      } else{
        Modal.alert('请选择充值金额')
      }
    }
    gopaymoney () {
    	this.refs.suremodal.hide();
    	QN.navigator.push({
            url:httphost+'/recharge',
            query:{money:this.state.rechargeMoney,account_id:this.state.account_id},
            settings: {
                    animate: true
             }
        })
    }
    render() {
    	var self= this;
    	var paymoneys= this.state.RechargeData;
    	var real_text= this.state.real_text;
    	var luckily_text_1= this.state.luckily_text_1;
    	return (
            <View>
                <ScrollView style={styles.body} onEndReachedThreshold={300}>
	        	   <View>
	            	 <Text style={[styles.cellItemList,{backgroundColor: '#e8e8e8', fontSize: '32rem'}]}>选择充值金额  {this.state.rechargeMoney} 元</Text>
	                 {
	                    	  paymoneys.length ===0 ? <Text>Loading</Text> : paymoneys.map((item, index) => {
	                    	  	var discount = parseInt(item.discount);
	                            var total_fee = parseInt(item.total_fee);
	                            var luckily_money_1 = parseInt(item.luckily_money_1);
	                            var luckily_money_2 = parseInt(item.luckily_money_2);
	                            var tl1l2 = total_fee + luckily_money_1 + luckily_money_2;
	                           
	                    	  	return (
	                    	  		<View style={styles.cellItemList}>
	                    	  			<TouchableHighlight 
	                    	  				style={this.check_highlight_index(index)} 											
                                  onPress={this.changeHighlight.bind(this, index, total_fee)} 
	                    	  				>
	                    	  				<View>
	                    	  				    {discount == 1
	                    	  				    	? <Text style={styles.fontstyle}>{number_format(tl1l2)}元</Text>
	                    	  				    	: <Text style={styles.fontstyle}>{number_format(total_fee)}元</Text>
	                    	  				    }
	                    	  				</View>
	                    	  				<View>
	                    	  				    {parseInt(item.discount) == 1 && total_fee > 0
	                    	  				    	? <View>
	                    	  				    														<Text style={styles.fontstyle}> {(parseFloat(total_fee)/tl1l2 * 10).toFixed(1)} 折</Text>
	                    	  				    		<Text style={styles.highfont}>现仅需{
	                    	  				    			item.total_fee
	                    	  				    		}元</Text>
	                    	  				    														
	                    	  				    	</View>
	                    	  				    	: <Text style={styles.highfont}>实得{number_format(tl1l2)}元</Text>
	                    	  				    }
	                    	  				</View>	
	                    	  				<View>
	                    	  					{luckily_money_1>0 
	                    	  							? <Text style={styles.fontstyle}>{real_text.replace(/\{money\}/gi, luckily_money_1)}</Text>
	                    	  							: ''
	                    	  					}
	                    	  					{
	                    	  						luckily_money_2> 0
	                    	  							? <Text style={styles.fontstyle}>{luckily_text_1.replace(/\{money\}/gi, luckily_money_2)}</Text>
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

	            	</View>
	               <View style={{marginLeft:'20rem',marginRight:'20rem'}} >
                            <Button style={{height:"80rem",marginBottom:'30rem', marginTop: '30rem'}} block="true" type="secondary" onPress={this.gopay.bind(this)}>支付宝充值</Button>
                    </View>
                   <Dialog ref="suremodal" contentStyle={styles.minmodalStyle} onShow={this.onShow} onHide={this.onHide}>
                      <View style={styles.minbody}>
                          <View>
                            <Text style={[styles.cellItemList,{backgroundColor: '#e8e8e8',textAlign: 'center'}]}>温馨提示</Text>
                            <Text style={{padding: '30rem', color: '#333',fontSize: '30rem'}}>亲，此次充值将作为淘外流量的推广费</Text>
                            <Text style={{color: '#333', paddingLeft: '30rem',fontSize: '30rem'}}>用，而非直通车推广费用，请您确认后再</Text>
                            <Text style={{color: '#333', paddingLeft: '30rem', paddingTop: '30rem',fontSize: '30rem'}}>进行充值操作。</Text>
                          </View>
                      </View>
                      <View style={styles.minfooter}>
                          <TouchableHighlight style={styles.button} onPress={this.hideSureModal}>
                              <Text style={styles.fontstyle}>取消</Text>
                          </TouchableHighlight>
                          <TouchableHighlight style={[styles.button,{marginLeft: '20rem'}]} onPress={this.gopaymoney.bind(this)}>
                              <Text style={{color: '#3089dc', fontSize: '30rem'}}>去充值</Text>
                          </TouchableHighlight>
                      </View>
                  </Dialog>
               </ScrollView>
            </View>


        );
    }
}
var styles = {
 minmodalStyle: {
  	width: '650rem',
  	height: '400rem'
  	
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
    height: height-40
  },
  minbody:{
  	alignItems: 'left',
    justifyContent: 'left',
    backgroundColor: '#fff',
  	height: '300rem',
  	lineHeight: '40rem'
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '120rem',
    flexDirection:"row",
	display:'flex'
  },
  minfooter: {
  	alignItems: 'center',
    justifyContent: 'center',
    height: '100rem',
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
   	color: '#FF6600',
   	fontSize: '30rem'
   },
   fontstyle: {
   	fontSize: '30rem'
   }
};

export default RechargeView
mount(<RechargeView/>, 'body');