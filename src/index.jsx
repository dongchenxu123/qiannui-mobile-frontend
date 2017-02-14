import { Tabbar, Button, Icon, ListView, Iconfont, Link,Modal } from 'nuke';
import {createElement, Component} from 'weex-rx';
import { View, Text, Image, TouchableHighlight} from 'nuke-components';
import {mount} from 'nuke-mounter';
import {browser, browserActive, appCont, appContActive, home, homeActive, my, myActive, shareLight, shareLightActive} from './static/static';
import QN from 'QAP-SDK';
import HealthyView from './views/healthy';
import LinkUs from './views/linkus';
import UserView from './views/user';
import CampaignsListView from './views/campaignsList';
import Drainage from './views/drainage';
import {  localstoreUser} from './api/authsign';

let URL= document.URL
let arr= QN.uri.parseQueryString(URL);
let authString = JSON.parse(arr.authString);
localstoreUser(authString).then((result)=>{

});

let WuXianCheShou = class WuXianCheShou extends Component {
    constructor() {
        super();
        this.state =  {
            activeKey: {key :'m1'}
        };
        Iconfont({name:"iconfont1",url:"http://at.alicdn.com/t/font_1474198576_7440977.ttf"});
    }
    changeTab(tab) {
        this.setState({activeKey:  tab})
    }

    onChange(status) {
       this.setState({
        activeKey: status
       })
    }

    render() {
        return (
          <View style={styles.container}>
              <View style={styles.view}>
               <Tabbar iconBar={true} navTop={false} navStyle={{active: app.activeBorder, inactive: app.inactiveBorder}} activeKey={this.state.activeKey} onChange={this.onChange.bind(this)} >
                     <Tabbar.Item
                      
                        title="健康诊断"
                        tabKey="m1"
                        icon={{src: browser, selected: browserActive}}
                      >
                    <HealthyView></HealthyView>
                     </Tabbar.Item>
                     <Tabbar.Item
                    renderAsOriginal
                        title="账户"
                        tabKey="m2"
                        icon={{src: home,selected:homeActive}}
                      >
                   <UserView></UserView>
                    </Tabbar.Item>
                    <Tabbar.Item
                      title="淘外引流"
                      tabKey="m3"
                      icon={{src: shareLight, selected: shareLightActive}}>
                    <Drainage></Drainage>
                    </Tabbar.Item>}
                    <Tabbar.Item
                      renderAsOriginal
                      title="计划"
                      tabKey="m4"
                      icon={{src: appCont, selected: appContActive}}
                      >
                     <CampaignsListView></CampaignsListView>
                    </Tabbar.Item>
                    <Tabbar.Item
                    
                      title="联系我们"
                      tabKey="m5"
                      icon={{src: my, selected: myActive}}
                      >
                      <LinkUs></LinkUs>
                    </Tabbar.Item>
                </Tabbar>
            </View>
        </View>
        );
    }
}
const styles = {
    icon1:{fontFamily: 'iconfont1', fontSize: '36rem', color:'blue', alignItems:'center'},
    tabContent: {flex: 1, alignItems: 'center'},
    tabText: {color: 'white', margin: 50, },
    container: {flex: 1 },
    text: {color: 'white', margin: 50 },
    customRender: {fontSize: '10rem', color: 'blue'},
    view: {flex: 1 },
    top: {height: '80rem', paddingLeft: 10, paddingRight: 10,marginBottom: 20, flexDirection: 'row'},
    header: {height: 100, marginTop: 100}
}

const app = {
    activeBorder: {borderTopWidth: "5rem", borderTopStyle: "solid", borderTopColor: "#337838"},
    inactiveBorder: {borderTopWidth: "5rem", borderTopStyle: "solid", borderTopColor: "#eeeeee"},
    listHeader:{height:'300rem', display:'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', },
    listHeaderText:{fontSize: '60rem', color:'#333333', },
    listHeaderSub:{fontSize: '30rem', color:'#888888', },
    listContainer:{flex: 1, backgroundColor:'#f8f8f8', },
    footer:{paddingTop: '50rem', paddingBottom: '50rem', backgroundColor: '#efefef', textAlign: 'center', },
    link:{fontSize: '32rem', },
    titleLink:{backgroundColor: '#ff4200', display: 'block', padding: '10rem', },
    img:{width: '100rem', height: '100rem', backgroundColor: '#ff4200', },
    cellItemIndex:{backgroundColor:'#ffffff', height: '130rem', display:'flex', paddingLeft:'20px', alignItems: 'center', flexDirection:'row', },
    cellItemList:{backgroundColor:'#ffffff', height:'110rem', borderBottom:'1px solid #e8e8e8', display:'flex', alignItems:' center', flexDirection:'row', },
    itemTextList:{flex:13, fontSize:'30rem', color:'#333333', },
    itemIcon:{width:'60rem', height:'60rem', flex: 2, justifyContent:'center', },
    cellTextView:{flex:13, display:'flex', },
    itemMainTitle:{fontSize:'34rem', color:'#333333', marginBottom:'10px', },
    itemSubTitle:{fontSize:'24rem', color:'#333333', },
    itemArrow:{flex: 1, width:'18px', height:'18px', }
}

mount(<WuXianCheShou/>, 'body');
