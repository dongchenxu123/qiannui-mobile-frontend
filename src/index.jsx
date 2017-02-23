import { Tabbar, Button, View, Iconfont } from 'nuke';
import {createElement, Component} from 'weex-rx';
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
                    
                      title="意见反馈"
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
    container: {flex: 1 },
    view: {flex: 1 },
}

const app = {
    activeBorder: {borderTopWidth: "5rem", borderTopStyle: "solid", borderTopColor: "#3089dc"},
    inactiveBorder: {borderTopWidth: "5rem", borderTopStyle: "solid", borderTopColor: "#eeeeee"},
}

mount(<WuXianCheShou/>, 'body');
