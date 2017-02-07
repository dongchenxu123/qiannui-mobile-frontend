import {
    ListView,
    Button,
    TabSlider,
    Icon,
    Modal,
    TimePicker
} from 'nuke';
import {createElement, Component} from 'weex-rx';
import {
    View,
    Text,
    Image,
    TouchableHighlight,
    ScrollView
} from 'nuke-components';
import QN from 'QAP-SDK';
import {mount} from 'nuke-mounter';
import {getAuthSign, getSellerUser, UserInfo, ProfileReport, WuxianBalance} from '../api';
import {yesterday, threeMonthAgo, formatDate} from '../api/date';
import ListViewCommon from './listViewCommon';

const {Pane} = TabSlider;

class User extends Component {
    constructor() {
        super();
        this.state = {
            index: 1,
            active: 0,
            stop: false,
            page: 0,
            profileData: {},
            subway_token: '',
            yesterday: [],
            WuxianData: '',
            alldays: [],
            threedaysago: [],
            start_date: '',
            end_date: '',
            checked: false,
            selectedTab: 'tab1',
            dateAlldays: []

        };
    }

    sliderChange(index) {
        this.setState({active: index});
    }
    startDate = () => {
    	var yesdate = formatDate(yesterday);
        var threeMonth = formatDate(threeMonthAgo);
        TimePicker.show({
            title: '请选择日期',
            range: [
                yesdate,threeMonth
            ],
            default: '2016-10-18',
            type: 'date'
        }, (e) => {
           Modal.alert(222);
           Modal.alert(e);
            this.setState({start_date: e})
         
        }, (e) => {
             Modal.alert(e);
            console.log('canceled ', e)
        });
    }
    endDate = () => {
        var yesdate = formatDate(yesterday);
	    var threeMonth = formatDate(threeMonthAgo);
        TimePicker.show({
            title: '请选择日期',
            range: [
                threeMonth, yesdate
            ],
            default: '2016-10-18',
            type: 'date'
        }, (e) => {
            
            this.setState({end_date: e})
        }, (e) => {
            console.log('canceled ', e)
        }, () => {
            console.log('datepicker showed')
        }, () => {
            console.log('datepicker render fail')
        });
    }
    btnClick() {
        this.setState({active: 0});
    }
    componentDidMount() {

        console.log('店铺');
        getAuthSign().then((result) => {
            this.setState({subway_token: result});
            ProfileReport(this.state.subway_token).then((result) => {
                this.setState({profileData: result, yesterday: result.yesterday, alldays: result.alldays, threedaysago: result.threedaysago})

            }, (error) => {
                Modal.alert(JSON.stringify(error));
            });
            WuxianBalance().then((result) => {
                this.setState({WuxianData: result})

            }, (error) => {
                Modal.alert(JSON.stringify(error));

            });
        }, (error) => {
            Modal.toast(JSON.stringify(error));

        })
    }
    _renderContent(color, pageText, num) {
        return (
            <View style={{
                backgroundColor: color,
                width: 750,
                height: 1000
            }}>
                <Text>{pageText}</Text>
            </View>
        );
    }

    onPress(index) {
        this.setState({active: index});
    }
    submitDate() {
        var start_date = this.state.start_date == ''
            ? formatDate(yesterday)
            : this.state.start_date;
        var end_date = this.state.end_date == ''
            ? formatDate(yesterday)
            : this.state.end_date;
        ProfileReport(this.state.subway_token, start_date, end_date).then((result) => {
            this.setState({dateAlldays: result.alldays, checked: true})
        }, (error) => {
            Modal.alert(JSON.stringify(error));

        });
    }
    siwtchTitleCustom(index, current) {
        let active = {
            color: '#3089DC'
        };
        var commonSty = {
            color: '#000',
            textAlign: 'center'
        };

        switch (index) {
            case 0:
                var style = {
                    width: 180
                };
                style = Object.assign(style, commonSty);
                if (index == current)
                    style = Object.assign({}, style, active)
                return (
                    <TouchableHighlight onPress={this.onPress.bind(this, index)}>
                        <Text style={style}>昨天</Text>
                    </TouchableHighlight>
                )

            case 1:
                var style = {
                    width: 180
                };
                style = Object.assign(style, commonSty);
                if (index == current)
                    style = Object.assign({}, style, active)
                return (
                    <TouchableHighlight onPress={this.onPress.bind(this, index)}>
                        <Text style={style}>过去3天</Text>
                    </TouchableHighlight>
                )

            case 2:
                var style = {
                    width: 180
                };
                style = Object.assign(style, commonSty);
                if (index == current)
                    style = Object.assign({}, style, active)
                return (
                    <TouchableHighlight onPress={this.onPress.bind(this, index)}>
                        <Text style={style}>过去7天</Text>
                    </TouchableHighlight>
                )
            case 3:
                var style = {
                    width: 180
                };
                style = Object.assign(style, commonSty);
                if (index == current)
                    style = Object.assign({}, style, active)
                return (
                    <TouchableHighlight onPress={this.onPress.bind(this, index)}>
                        <Button style={style}>日期选择</Button>
                    </TouchableHighlight>
                )

        }
    }
    render() {
        var self = this;
        return (
            <View>
                <View style={styles.amoutList}>
                    <View style={styles.amoutitemArrow}>
                        <Text style={styles.title}>直通车余额</Text>
                        <Text style={styles.title}>
                            ￥{this.state.WuxianData === ''
                                ? 0
                                : this.state.WuxianData}
                        </Text>
                    </View>
                    <View style={styles.amoutTextList}>
                        <Text style={styles.title}>花费</Text>
                        <Text style={styles.title}>
                            ￥{this.state.yesterday.length === 0
                                ? 0
                                : this.state.yesterday[0].cost
}
                        </Text>
                    </View>
                    <View style={styles.amoutTextList}>
                        <Text style={styles.title}>点击量</Text>
                        <Text style={styles.title}>
                            {this.state.yesterday.length === 0
                                ? 0
                                : this.state.yesterday[0].click
}
                        </Text>
                    </View>
                    <View style={styles.amoutitemArrows}>
                        <Text style={styles.title}>平均点击花费</Text>
                        <Text style={styles.title}>
                            ￥{this.state.yesterday.length === 0
                                ? 0
                                : this.state.yesterday[0].cpc
}
                        </Text>
                    </View>
                </View>
                <TabSlider navTop={true} width={750} style={styles.barStyle} active={this.state.active} customBar={true} index={this.state.index} onChange={this.sliderChange.bind(this)}>
                    <Pane style={{
                        width: 750
                    }} renderTitleCustom={this.siwtchTitleCustom.bind(self, 0, this.state.active)}>
                        <ListViewCommon amount={this.state.yesterday}/>
                    </Pane>
                    <Pane style={{
                        width: 750
                    }} renderTitleCustom={this.siwtchTitleCustom.bind(self, 1, this.state.active)}>
                        <ListViewCommon amount={this.state.threedaysago}/>
                    </Pane>
                    <Pane style={{
                        width: 750
                    }} renderTitleCustom={this.siwtchTitleCustom.bind(self, 2, this.state.active)}>
                        <ListViewCommon amount={this.state.alldays}/>
                    </Pane>
                    <Pane style={{
                        width: 750
                    }} renderTitleCustom={this.siwtchTitleCustom.bind(self, 3, this.state.active)}>
                        <View style={styles.dateList}>
                            <Button style={styles.amoutitemArrow} onPress={this.startDate}>
                                {this.state.start_date === ''
                                    ? '开始时间'
                                    : this.state.start_date
}
                            </Button>
                            <Button style={styles.amoutitemArrow} onPress={this.endDate}>{this.state.end_date === ''
                                    ? '结束时间'
                                    : this.state.end_date
}</Button>
                            <Button style={styles.amoutTextList} onPress={this.submitDate.bind(this)} checked={this.state.checked}>确定</Button>
                        </View>
                        {this.state.checked === false
                            ? <Text style={styles.textCenter}>请您选择日期</Text>
                            : <ListViewCommon amount={this.state.dateAlldays} style={styles.listContainer}/>
}
                    </Pane>
                </TabSlider>

            </View>
        )
    }
}
const styles = {
    textCenter: {
        textAlign: 'center',
        marginTop: '100rem',
        color: 'red'
    },
    slider: {
        width: '750rem',
        position: 'relative',
        overflow: 'hidden',
        height: '452rem',
        backgroundColor: '#cccccc'
    },
    itemWrap: {
        width: '750rem',
        height: '352rem'
    },
    image: {
        width: '750rem',
        height: '352rem'
    },
    button: {
        marginTop: '20rem',
        width: '340rem',
        height: '80rem'
    },
    paginationStyle: {
        position: 'absolute',
        width: '750rem',
        height: '40rem',
        bottom: '20rem',
        left: 0,
        itemColor: 'rgba(255, 255, 255, 0.5)',
        itemSelectedColor: 'rgb(255, 80, 0)'
    },
    tab: {
        position: 'relative',
        width: 750,
        height: 3000
    },
    tabBottom: {
        height: 166,
        width: 750,
        backgroundColor: '#333333',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'middle'
    },
    barStyle: {
        backgroundColor: '#ffffff',
        height: 120,
        width: 750,
        overflow: 'hidden',
        justifyContent: 'flex-start'
    },
    fixSetting: {
        position: 'absolute',
        right: 20,
        top: 20
    },
    dateList: {
        height: '100rem',
        alignItems: "center",
        flexDirection: "row",
        display: 'flex'
    },
    amoutList: {
        backgroundColor: "#ffffff",
        height: "200rem",
        borderBottomWidth: "2rem",
        borderBottomStyle: "solid",
        borderBottomColor: "#e8e8e8",
        paddingTop: "40rem",
        alignItems: "center",
        flexDirection: "row",
        display: 'flex'
    },
    amoutTextList: {
        fontSize: "24rem",
        color: "#5F646E",
        flex: 3

    },
    amoutitemArrow: {
        flex: 4,
        fontSize: "24rem",
        color: "#5F646E"
    },
	amoutitemArrows:{
    	flex: 5,
    	fontSize:"24rem",
      color:"#5F646E" 
	},
    title: {
        textAlign: 'center',
        paddingBottom: '40rem'
    }
};
export default User
