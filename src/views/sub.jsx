import { Button } from 'nuke';
import {createElement, Component} from 'weex-rx';
import { View, Text} from 'nuke-components';
import { mount } from 'nuke-mounter';

class Sub extends Component {
    press() {
        this.props.change('m3');
    }

    render() {
        return (
            <View style={[{backgroundColor: '#eeeeee', height: '200rem'}]}>
                <Text>子容器</Text>
                <Button onPress={this.press.bind(this)} type="normal">切换为m3</Button>
            </View>
        )
    }
}
export default Sub