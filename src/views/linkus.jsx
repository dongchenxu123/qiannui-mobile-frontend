import {Link, ListView, Modal,Col, Grid,Navigator,Button,Image } from 'nuke'
import {createElement, Component} from 'weex-rx';
import { View, Text, TouchableHighlight,ScrollView,TextInput  } from 'nuke-components';
import { getAuthSign,getCampaign } from '../api';
import QN from 'QAP-SDK';

class LinkUs extends Component{
   constructor() {
        super();   
        this.state = {
           
        }   
    }

     componentWillMount(){

     }
     tel(){
          Navigator.push('tel:400-627-0003'); 
     }
     render(){
        const url = encodeURI('http://amos.alicdn.com/online.aw?v=2&uid=tp_喜宝&site=cntaobao&s=1&charset=utf-8');
        
        return (
                <ScrollView style={style.scroller}  onEndReachedThreshold={300}>
                    <View style={{margin:'30rem'}}>
                        <TouchableHighlight style={[style.item, {flexDirection:"row",display:'flex' }]}>
                            <View style={{marginLeft:'80rem'}}>
                                <Image source={{uri: url}}  style={{width:'160rem',height:'40rem',marginLeft:'20rem'}}/>
                            </View>
                            <Text style={{marginLeft:'20rem',color: '#0894EC'}}>在线客服</Text>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={this.tel}>
                            <View style={style.item}><Text style={{color: '#0894EC'}}>免费400电话：400-627-0003</Text></View>
                        </TouchableHighlight>
                        <TouchableHighlight >
                            <View style={style.item}><Text style={{color: '#0894EC'}}>给我留言</Text></View>
                        </TouchableHighlight>
                    </View>

                     <View style={{margin:'20rem'}}>
                        <TextInput
                          placeholder="请在此填写留言反馈"
                          multiline="true"
                          maxNumberOfLines="20"
                          numberOfLines="20"
                          onFocus={() => console.log('onFocus')}
                          onBlur={() => console.log('onBlur')}
                          onInput={() => console.log('onInput')}
                          style={{
                              width: '710rem',
                              height: '200rem',
                              borderWidth: '1rem',
                              borderStyle:'solid',
                              borderColor:'#dddddd',

                          }}
                        />
                        <View style={{marginTop:'30rem'}}>
                            <Button type="primary">提交</Button>
                        </View>
                     </View>
                </ScrollView>
            )
     }
}

const style={
    scroller:{
      backgroundColor:'#ffffff'
    },
    item:{
        borderBottomStyle:'solid',
        borderBottomWidth:'1rem',
        borderBottomColor:'#e8e8e8',
        color:'#3089DC',
        alignItems:"center",
        padding: '20rem',
        paddingLeft:'100rem'
    }
}
export default LinkUs