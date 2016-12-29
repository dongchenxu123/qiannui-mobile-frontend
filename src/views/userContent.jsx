import { Button } from 'nuke';
import {createElement, Component} from 'weex-rx';
import { View, Text} from 'nuke-components';
import { mount } from 'nuke-mounter';
const styles = {
    tabContent: {flex: 1, alignItems: 'center'},
    text: {color: 'white', margin: 50 }
   
}
class Gray extends Component {
    press() {
        this.changeTo('m3')
    }

    onFocus(status) {
      console.log('gray:', status)
    }

    render() {
        return (
            <View style={[styles.tabContent, {backgroundColor: '#888888'}]}>
                <Text style={styles.text}>Blue Tab 大家好我是nv色的区域</Text>
                <Button onPress={this.press.bind(this)} type="normal">切换为m3</Button>
            </View>
        )
    }
}

export default Gray