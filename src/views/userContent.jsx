import {Icon,MultiRow } from 'nuke'
import {createElement, Component} from 'weex-rx';
import { View, Text,} from 'nuke-components';

class OutsideTaobao extends Component{
   constructor() {
        super();   
         this.state={
            icons:["all",
                "email",
                "account",
                "emailFilling",
                "favoritesFilling",
                "accountFilling",
                "smile",
                "personalCenter",
                "back",
                "arrowDown",
                "arrowUp",
                "add",
                "minus",
                "errorFilling",
                "error",
                "select",
                "success",
                "warning",
                "display",
                "prompt",
                "successFilling",
                "close",
                "semiSelect",
                "loading",
                "navMore",
                "search",
                "arrowRight",
                "favorites",
                "deleteFilling",
                "arrowLeft",
                "radio",
                "checkbox"
            ]
        } 
    }

      renderGridCell=(item,index)=>{
        return (<View style={styles.iconCell}>
                <Icon style={styles.icon} name={item} />
                <Text style={styles.iconShowCode}>{item}</Text>
            </View>)
    }

    render() {
        return (
            <View>

                <View style={styles.st}><Text style={styles.stText}>使用iconfont</Text></View>
                <Icon style={[styles.icon,{paddingLeft:'20rem'}]} name="emailFilling" />
                <View style={styles.st}><Text style={styles.stText}>nuke 内置 iconfont库</Text></View>
                <View style={styles.rows}><MultiRow dataSource={this.state.icons} rows={4} renderRow={this.renderGridCell} /></View>
            </View>

        );
    }
}

const styles={
    st:{
        marginBottom:'30rem',
        paddingTop:'10rem',
        paddingBottom:'10rem',
        paddingLeft:'20rem',
        backgroundColor:'#dddddd'
    },
    stText:{
        fontSize:'36rem'
    },
    iconCell:{
        paddingTop:'40rem',
        alignItems:'center',
    },
    rows:{

    },
    icon:{
        fontSize: '36rem',
        color:'#ff6600',
        marginBottom:'30rem',

    },
    iconShowCode:{
        fontSize: '24rem',
        color:'#999999',
    }
}

mount(<OutsideTaobao />, 'body');

export default OutsideTaobao