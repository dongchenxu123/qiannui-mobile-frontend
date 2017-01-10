import { Dialog, Dimensions, Modal, Checkbox, Button, Tabbar} from 'nuke';
import {createElement, Component} from 'weex-rx';
import { View, Text,TouchableHighlight, ScrollView} from 'nuke-components';

import {mount} from 'nuke-mounter';
import QN from 'QAP-SDK';
import ScheduleContView from './scheduleCont'
let {height} = Dimensions.get('window');

class GetAreaView extends Component {
    constructor(props) {
        super(props);
        this.state = {
           
        }
    }
    
  
   showModal () {
        this.refs.modal.show();
    }
	hideModal = () => {
        this.refs.modal.hide();
    }
    sureModal = () => {
        this.refs.modal.hide();
        
    }
    onShow() {
      
    }
	onHide = (param) => {
        console.log('modal hide', param);
    }
    
    render() {
    	var self= this;
    	//var localItemId= self.props.localId;
    	const {value} = this.state;
    	return (
            <View>
                <TouchableHighlight onPress={this.showModal.bind(self)}>
                  <Button style={{color: '#3089dc'}}>设置</Button>
                </TouchableHighlight>
                <Dialog ref="modal" contentStyle={styles.modalStyle} onShow={this.onShow.bind(self)} onHide={this.onHide}>
                    <ScrollView style={styles.body} onEndReachedThreshold={300}>
                    	<ScheduleContView scheConId={this.props.scheId}/>
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
  gridWrap:{
        height:'100rem'
    },
    col1:{
        justifyContent:'center',
        alignItems:'center',
        flexDirection:"row",
        display:'flex'
    },
    col2:{
        justifyContent:'center',
        alignItems:'center',
        flexDirection:"row",
        display:'flex'
    },
    col3:{
        justifyContent:'center',
        alignItems:'center',
        flexDirection:"row",
        display:'flex'
    }
   
};
const style ={
    title:{
        color:'#383B3E',
        height:'44px',
        lineHeight: '44px'
    },
    item:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        borderTopWidth:'1px',
        borderTopColor:'#EDEDEF',
        borderTopStyle:'solid',
        paddingTop:'5px',
        paddingBottom:'5px',
        paddingLeft:'20px',
        paddingRight:'20px'
    },
    delayValue:{
        color:'#383B3E'
    }
}
export default GetAreaView