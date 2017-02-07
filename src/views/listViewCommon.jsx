import { Icon, ListView } from 'nuke';
import {createElement, Component} from 'weex-rx';
import { View, Text, TouchableHighlight , RefreshControl} from 'nuke-components';
class ListViewCommon extends Component {
    constructor() {
        super();
        this.state = {
           	stop: false,
            isRefreshing: false,
            showLoading:true,
            refreshText: '↓ 下拉刷新',
        };
        this.index = 0;

    }
    handleRefresh = (e) => {
        this.setState({
          isRefreshing: true,
          refreshText: '加载中',
        });
        setTimeout(() => {
          this.setState({
            isRefreshing: false,
            data: this.props.amount,
            refreshText: '↓ 下拉刷新',
          });

        }, 3000);
      };

    handleLoadMore() {

    }
  
   renderItem (item, index){
        return (
        	<View>
                <TouchableHighlight style={app.cellItemList} >
                    <Text style={app.itemTextList}>展现量</Text>
                    <Text style={app.itemArrow}>{item.pv}</Text>
                </TouchableHighlight>
                <TouchableHighlight style={app.cellItemList}>
                    <Text style={app.itemTextList}>点击量</Text>
                    <Text style={app.itemArrow}>{item.click}</Text>
                </TouchableHighlight>
                <TouchableHighlight style={app.cellItemList}>
                    <Text style={app.itemTextList}>点击率</Text>
                    <Text style={app.itemArrow}>{item.ctr} %</Text>
                </TouchableHighlight>
                <TouchableHighlight style={app.cellItemList} >
                    <Text style={app.itemTextList}>转化率</Text>
                    <Text style={app.itemArrow}>{item.click_ROi} %</Text>
                </TouchableHighlight>
                <TouchableHighlight style={app.cellItemList}>
                    <Text style={app.itemTextList}>平均点击花费</Text>
                    <Text style={app.itemArrow}>￥ {item.cpc}</Text>
                </TouchableHighlight>
                <TouchableHighlight style={app.cellItemList}>
                    <Text style={app.itemTextList}>花费</Text>
                    <Text style={app.itemArrow}>￥ {item.cost}</Text>
                </TouchableHighlight>
                <TouchableHighlight style={app.cellItemList}>
                    <Text style={app.itemTextList}>总成交金额</Text>
                    <Text style={app.itemArrow}>￥ {item.pay}</Text>
                </TouchableHighlight>
                <TouchableHighlight style={app.cellItemList} >
                    <Text style={app.itemTextList}>投入产出比</Text>
                    <Text style={app.itemArrow}>{item.ROI} %</Text>
                </TouchableHighlight>
                <TouchableHighlight style={app.cellItemList} >
                    <Text style={app.itemTextList}>总成交笔数</Text>
                    <Text style={app.itemArrow}>{item.paycount}</Text>
                </TouchableHighlight>
                <TouchableHighlight style={app.cellItemList}>
                    <Text style={app.itemTextList}>总收藏数</Text>
                    <Text style={app.itemArrow}>{item.favcount}</Text>
                </TouchableHighlight>
            </View>
            );

    }
    renderHeader=()=>{
        return <RefreshControl style={app.refresh} refreshing={this.state.isRefreshing} onRefresh={this.handleRefresh}><Text style={app.loadingText}>{this.state.refreshText}</Text></RefreshControl>;
    }
    renderFooter=()=>{
        return this.state.showLoading ?
        <View style={[app.loading]}><Text style={app.loadingText}>加载完成</Text></View>
        :null
    }

    render(){
        var self=this;
        return (
        	<View>
        		{
        			this.props.amount.length === 0 ? <Text>Loading...</Text> : <ListView
		           	renderHeader={this.renderHeader}
            		renderFooter={this.renderFooter}
            		renderRow={this.renderItem.bind(this)} 
		            dataSource={this.props.amount}
					style={app.listContainer}
		            
		          />
        		}
        		
        	</View>
        )
    }
}
const app = {
	listContainer: {
		flex: 1,
		height: '750rem'
		
	 },
    cellItemList:{
        backgroundColor:"#ffffff",
        height:"100rem",
        borderBottomWidth:"2rem",
        borderBottomStyle:"solid",
        borderBottomColor:"#e8e8e8",
        paddingRight:"30rem",
        paddingLeft:"30rem",
        alignItems:"center",
        flexDirection:"row",
        display:'flex'  
     },
   itemTextList:{
        fontSize:"30rem",
        color:"#5F646E",
        flex:15
    },
    refresh:{
        height:"80rem",
        width:"750rem",
        display:"flex",
        flex:"1",
        flexDirection:"row",
        backgroundColor:"#cccccc",
        justifyContent:"center",
        alignItems:"center"
    },
    loading:{
        height:"80rem",
        display:"flex",
        width:"750rem",
        flexDirection:"row",
        backgroundColor:"#cccccc",
        alignItems:"center",
        justifyContent:"center"
    },
    loadingText:{
        color:"#666666"
    },
    itemArrow:{
    	flex: 4,
    	fontSize:"30rem",
        color:"#5F646E" ,
        textAlign: 'right',
        marginRight:'3rem'
    }
}

export default ListViewCommon