import {Button, Modal} from 'nuke';
import {mount} from 'nuke-mounter';
import {createElement, Component} from 'weex-rx';
import { View, Text, TouchableHighlight,ScrollView} from 'nuke-components';
import { getTodayReport, getHistoryReport } from '../api';

import QN from 'QAP-SDK';


export default class HandBook extends Component{
    constructor() {
        super();   
        this.state = {
           
        }    
    }
     componentDidMount(){
       
    }

    render(){
        return (
               /* <ScrollView style={app.content}>
                    <View style={app.car}>
                        <View style={app.cardContent}>
                            <View style={app.cardContentInner}>
                                <Text style={fontSize:'0.8rem'}>
                                电脑登陆网页版喜宝DSP可使用更多功能
                                </Text>
                                <Text style={fontSize:'1rem'}>
                                    dsp.xibao100.com
                                </Text>
                                <TouchableHighlight style={fontSize:'0.8rem'}>
                                    <Button>我要登陆网页版</Button>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                */
            )
    }
}
/*const app = {
    content:{
        top: '2.2rem';
    },
    car:{
        background: '#fff',
        boxShadow: '0 0.05rem 0.1rem rgba(0, 0, 0, 0.3)',
        margin: '0.5rem',
        position: 'relative',
        borderRadius: '0.1rem',
        fontSize: '0.7rem',
        backgroundColor: '#e5e5e5',
        height: '180px',
        textAlign: 'center'
    },
    cardContent:{
        position: 'relative'
    },
    cardContentInner:{
        padding: '0.75rem'
        position: 'relative'
    }
}*/