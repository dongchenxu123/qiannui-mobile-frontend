'use strict';
import {mount} from 'nuke-mounter';
import {createElement, Component} from 'weex-rx';
import {View, Text, Button, Modal} from 'nuke';
import QN from 'QAP-SDK';


class Demo extends Component {
    constructor(props) {
      super(props);
    
      this.state = {};
    }

     handleTOPInvoke() {
        QN.top.invoke({
            query: {
                method: 'taobao.time.get'
            }
        }).then((result) => {
            Modal.toast(result.time_get_response.time);
        }, (error) => {
            Modal.toast(error);
        });
    }


    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    欢迎使用千牛!
                </Text>
                <Text style={styles.instructions}>
                    编辑src/index.jsx文件，开始QAP之旅，
                </Text>
                <Text style={styles.instructions}>
                    点击手机千牛右上角刷新ok，
                </Text>
                <Text style={styles.instructions}>
                    或者刷新浏览器立即查看效果ddddd
                </Text>
                  <Button block="true" onPress={() => {this.handleTOPInvoke()}} type="primary">QN.top.invoke</Button>
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
};

mount(<Demo />, 'body');


export default Demo