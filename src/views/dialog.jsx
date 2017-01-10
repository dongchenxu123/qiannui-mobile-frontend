import { Dialog, Dimensions, Button } from 'nuke';
import {createElement, Component} from 'weex-rx';
import { View, Text,TouchableHighlight} from 'nuke-components';

import {mount} from 'nuke-mounter';
let {height} = Dimensions.get('window');

class DialogView extends Component {
    constructor() {
        super();
    }
     showModal = () => {
        this.refs.modal.show();
    }
	hideModal = () => {
        this.refs.modal.hide();
    }

    onShow = (param) => {
        console.log('modal show', param);
    }

    onHide = (param) => {
        console.log('modal hide', param);
    }
    render() {
        return (
            <View>
                <TouchableHighlight onPress={this.showModal}>
                  <Button style={{color: '#3089dc'}}>设置</Button>
                </TouchableHighlight>
                <Dialog ref="modal" contentStyle={styles.modalStyle} onShow={this.onShow} onHide={this.onHide}>
                    <View style={styles.body}>
                        <Text>
                          Conetnt
                        </Text>
                    </View>
                    <View style={styles.footer}>
                        <TouchableHighlight style={styles.button} onPress={this.hideModal}>
                            <Text>OK</Text>
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
  click: {
    height: '100rem',
    lineHeight: '100rem',
    textAlign: 'center',
    borderWidth: '1rem',
    borderStyle: 'solid',
    borderColor: '#ccc'
  },
  modalStyle: {
    width: '640rem',
    height: '340rem'
  },
  body: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e5e5e5',
    height: '220rem'
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '120rem'
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
  }
};

export default DialogView