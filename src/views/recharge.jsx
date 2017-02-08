import { Dialog, Dimensions, Modal, Checkbox, Button } from 'nuke';
import {createElement, Component} from 'weex-rx';
import { View, Text,TouchableHighlight, ScrollView} from 'nuke-components';
import {mount} from 'nuke-mounter';
import QN from 'QAP-SDK';

let {height} = Dimensions.get('window');

class RechargeView extends Component {
    constructor(props) {
        super(props);
        this.state={
        	
    	}
    }
   showModal () {
        var self = this;
        this.refs.modal.show();
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
  		return (
            <View>
                <View style={{left:'-22rem'}} >        
                  <Button type="primary" onPress={this.showModal.bind(self)}>充值</Button>
                </View>
                <Dialog ref="modal" contentStyle={styles.modalStyle} onShow={this.onShow.bind(self)} onHide={this.onHide}>
                    <ScrollView style={styles.body} onEndReachedThreshold={300}>
                    	<View>
	                    	<Text style={[styles.cellItemList,{backgroundColor: '#e8e8e8'}]}>选择充值金额</Text>
	                    	<View style={styles.cellItemList}>
	                    		<View style={styles.ItemList}>
	                    			<Text>1元</Text>
	                    			<Text style={styles.highfont}>实得4元</Text>
	                    			<Text>赠送您2元</Text>
	                    			<Text>再赠送您1元红包</Text>
	                    		</View>
	                    		<View style={[styles.ItemList,{marginLeft: '40rem'}]}>
	                    			<Text>3元</Text>
	                    			<Text>3.3折</Text>
	                    			<Text style={styles.highfont}>现仅需1元</Text>
	                    			<Text>赠送您1元</Text>
	                    			<Text>再赠送您1元 红包3</Text>
	                    		</View>
	                    	</View>
	                    	<View style={styles.cellItemList}>
	                    		<View style={styles.ItemList}>
	                    			<Text>9元</Text>
	                    			<Text style={styles.highfont}>现仅需3元</Text>
	                    			<Text>赠送您3元</Text>
	                    			<Text>再赠送您3元  红包2</Text>
	                    		</View>
	                    	</View>
                    	</View>
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
        height: '300rem',
        width: '300rem',
        lineHeight: '60rem'
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
    width: '80rem',
    height: '80rem',
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