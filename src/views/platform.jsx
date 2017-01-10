'use strict';
import {mount} from 'nuke-mounter';
import {createElement, Component} from 'weex-rx';
import { View, Text, Image, TouchableHighlight} from 'nuke-components';
import { Tabbar, Button, Icon, ListView, Iconfont, Modal } from 'nuke';
import QN from 'QAP-SDK';
import { getPlatfrom } from '../api'

class PlatformView extends Component {
    constructor(props) {
      super(props);
    }
    componentDidMount(){
    	Modal.alert(this.props.id)
        
    }
   /*
  componentDidMount(){
        var myHeaders = new Headers();
        myHeaders.append('Accept', 'application/json, text/javascript');
        QN.fetch('http://qianniu.why.xibao100.com/test', {
            headers:myHeaders,
            method: 'GET',
            mode: 'cors',
            dataType: 'json',
        })
        .then(response => {     
            return response.json(); // => 返回一个 `Promise` 对象
        })
        .then(data => {
            Modal.alert(data);
            console.log(data); // 真正地数据结果
        })
        .catch(error => {
           Modal.alert(error);
        });
   }*/
	render() {
        return (
            <View style={styles.container}>
               <Text>1235</Text>                                

            </View>
 		  );
    }
}

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    btnlist: {
    	marginBottom: 15
    }
};

mount(<PlatformView />, 'body');


export default PlatformView
