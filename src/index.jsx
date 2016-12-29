import { Tabbar, Button, Icon, ListView, Iconfont, Link} from 'nuke';
import {createElement, Component} from 'weex-rx';
import { View, Text, Image, TouchableHighlight} from 'nuke-components';
import { mount } from 'nuke-mounter';
import Green from './views/healthy';
import Gray from './views/userContent';
import {browser, browserActive, appCont, appContActive, home, homeActive, my, myActive, shareLight, shareLightActive} from './static/static';

let listData = [];
for (var i = 0; i < 300; i++) {
    listData.push({key: i,pic:'//img.alicdn.com/bao/uploaded/i1/TB1gdT4KVXXXXcpXFXXwu0bFXXX.png',text:'近三个月订单xcfvdsdf' + i});
}

let listData1 = [];
for (var i = 0; i < 300; i++) {
    listData1.push({key: i,pic:'//img.alicdn.com/bao/uploaded/i1/TB1gdT4KVXXXXcpXFXXwu0bFXXX.png',text:'已完成订单' + i});
}
var dataTest=[{name: 'xiaoli', age: 18}, {name: 'xiaobai', age: 19}]
const styles = {
    icon1:{fontFamily: 'iconfont1', fontSize: '36rem', color:'blue', alignItems:'center'},
    tabText: {color: 'white', margin: 50, },
    container: {flex: 1 },
    customRender: {fontSize: '10rem', color: 'blue'},
    view: {flex: 1 },
    top: {height: 200, paddingLeft: 10, paddingRight: 10,marginBottom: 20, flexDirection: 'row'}
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

let App = class NukeDemoIndex extends Component {
    constructor() {
        super();
        this.state =  {
            presses: 0,
            data: listData,
            data1: listData1,
            stop: false,
            activeKey: "m1",
            itemDatas: null,
            test: 1
        };
        Iconfont({name:"iconfont1",url:"http://at.alicdn.com/t/font_1474198576_7440977.ttf"});
        this.index = 0;
    }
    componentDidMount (){
		 this.setState({itemDatas:  dataTest})
	}
    changeTab(tab) {
        this.setState({activeKey:  tab})
    }
    
    _renderContent(color, pageText, num) {
        return (
          <View style={[styles.tabContent, {backgroundColor: color}]}>
            <Text style={styles.tabText}>{pageText}</Text>
            <Text style={styles.tabText}>{num} re-renders of the {pageText}</Text>
          </View>
        );
    }

    handleLoadMore() {
        var self = this;
        // 这里进行异步操作
        setTimeout(function() {
          self.index++;
          if (self.index == 5) {
            self.state.stop = true; // 加载5次后会停止加载，并去掉菊花
          }
          self.state.data.push({key: 'x',pic:'//img.alicdn.com/bao/uploaded/i1/TB1O9eAKVXXXXaPaXXXwu0bFXXX.png',text:'xx订单'}, {key: 'loadmore 2',pic:'//img.alicdn.com/bao/uploaded/i1/TB1O9eAKVXXXXaPaXXXwu0bFXXX.png',text:'xx订单'}, {key: 'loadmore 2',pic:'//img.alicdn.com/bao/uploaded/i1/TB1O9eAKVXXXXaPaXXXwu0bFXXX.png',text:'xx订单'},{key: 'loadmore 2',pic:'//img.alicdn.com/bao/uploaded/i1/TB1O9eAKVXXXXaPaXXXwu0bFXXX.png',text:'xx订单'}, {key: 'loadmore 2',pic:'//img.alicdn.com/bao/uploaded/i1/TB1O9eAKVXXXXaPaXXXwu0bFXXX.png',text:'xx订单'});
          self.setState(self.state);
        }, 1000);
    }
    linkTo(item,e) {
        
    }
    renderItem (item, index) {
        return (
	        	<TouchableHighlight style={app.cellItemList} onPress={this.linkTo.bind(this,item)}>
	                <Icon src={item.pic} style={app.itemIcon} />
	                <Text style={app.itemTextList}>{item.text}</Text>
	                <Icon style={app.itemArrow} src="//img.alicdn.com/tfs/TB1EU2rMVXXXXcpXXXXXXXXXXXX-64-64.png" />
	            </TouchableHighlight>
            );

    }
    
    renderItems (item, index) {
     	return (
        	 	<TouchableHighlight style={app.cellItemList} onPress={this.linkTo.bind(this,item)}>
	        		<Text style={app.itemTextList}>{item.name}</Text>
	        	</TouchableHighlight>
	         );
   }
    renderHeader(){
        return <View style={app.listHeader}><Text style={app.showTitleText}>list</Text></View>
    }
    renderFooter(){
        return <View style={app.loading}><Text style={app.loadingText}>加载中...</Text></View>
    }
    onChange(status) {
        console.log(status)
    }
	other() {
        this.setState({test: 999})
    }

    render() {
      let self = this;
          const renderTpl = <Button type="normal">m2</Button>
        return (
            <View style={styles.container}>
                <View style={{flexDirection: 'row'}, styles.top}>
					{
						self.state.itemDatas === null ? <Text>Loading...</Text> :  <ListView
				                      	renderRow={self.renderItems.bind(self)}
				                        dataSource={
				                        	self.state.itemDatas
				                        }
				                        style={app.listContainer}
				                        
				                      />
					}
                   
                </View>
                <View style={styles.view}>
                <Tabbar asContainer={false} iconBar={true} navTop={false} navStyle={{active: app.activeBorder, inactive: app.inactiveBorder}} activeKey={this.state.activeKey} onChange={this.onChange.bind(this)} customChange="changeTo" customFocus="getFocus">
                  <Tabbar.Item
                       renderAsOriginal
                        title="健康诊断"
                        tabKey="m1"
                        icon={{src: browser, selected: browserActive}}
                      >
                      <Green></Green>
                    </Tabbar.Item>
                    <Tabbar.Item
                   		renderAsOriginal
                        title="账户"
                        tabKey="m2"
                        icon={{src: home,selected:homeActive}}
                        
                      >
                      <Gray changeTab={this.changeTab.bind(this)}></Gray>
                    </Tabbar.Item>
                    <Tabbar.Item
                      title="淘外引流"
                      tabKey="m3"
                      icon={{src: shareLight, selected: shareLightActive}}
                    >
                       <ListView
                        renderHeader={this.renderHeader.bind(self)}
                        renderFooter={this.renderFooter.bind(self)}
                        renderRow={self.renderItem.bind(self)}
                        dataSource={self.state.data}
                        style={app.listContainer}
                        onEndReached={self.handleLoadMore.bind(self)}
                      />
                    </Tabbar.Item>
                    <Tabbar.Item
                      renderAsOriginal
                      title="计划"
                      tabKey="m4"
                       icon={{src: appCont, selected: appContActive}}
                      >
                      <ListView
                        renderHeader={this.renderHeader.bind(self)}
                        renderFooter={this.renderFooter.bind(self)}
                        renderRow={self.renderItem.bind(self)}
                        dataSource={
                        	self.state.data
                        }
                        style={app.listContainer}
                        onEndReached={self.handleLoadMore.bind(self)}
                      />
                    </Tabbar.Item>
                    <Tabbar.Item
                      renderAsOriginal
                      title="联系我们"
                      tabKey="m5"
                      icon={{src: my, selected: myActive}}
                      >
                      <ListView
                        renderHeader={this.renderHeader.bind(self)}
                        renderFooter={this.renderFooter.bind(self)}
                        renderRow={self.renderItem.bind(self)}
                        dataSource={self.state.data1}
                        style={app.listContainer}
                        onEndReached={self.handleLoadMore.bind(self)}
                      />
                    </Tabbar.Item>
                </Tabbar>
             </View>
            </View>
        );
    }
}
mount(<App/>, 'body');