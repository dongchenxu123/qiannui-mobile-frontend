import { Button, Link } from 'nuke';
import {createElement, Component} from 'weex-rx';
import { View, Text} from 'nuke-components';
import { mount } from 'nuke-mounter';
import Sub from './sub';
const styles = {
    tabContent: {flex: 1, alignItems: 'center'},
    text: {color: 'white', margin: 50 }
   
}
class Green extends Component {

    constructor(props) {
        super(props);
        console.log('green constructor');

        this.hasInit = true;
    }

    press(param) {
        // this.props.changeTab('m3')
        this.changeTo(param)
    }
    getFocus(status) {
      console.log('green:', status)
    }
    componentWillReceiveProps(nextProps) {
        // console.log(nextProps)
    }
    shouldComponentUpdate(nextProps, nextState) {
        if(this.hasInit){
            console.log('green: shouldComponentUpdate')
            return true
        }else{
            return false
        }
    }

    render() {
        return (
            <View style={[styles.tabContent, {backgroundColor: '#337838'}]}>
                <Sub change={this.press.bind(this)}></Sub>
                <Text style={styles.text}>Blue Tab 大家好我是nv色的区域</Text>
                <Button onPress={this.press.bind(this, 'm4')} type="normal">切换为m4</Button>
                <Link href="qap://test.js">点我去下个页面</Link> 
            </View>
        )
    }
}
export default Green