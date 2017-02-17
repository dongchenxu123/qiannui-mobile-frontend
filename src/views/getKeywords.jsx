'use strict';
import { Radio, Col, Grid} from 'nuke';
import {mount} from 'nuke-mounter';
import {createElement, Component} from 'weex-rx';
import {View, Text,Input,Image, Modal, Dialog, TouchableHighlight, Navigator, Button, ScrollView, ListView, Dimensions, Checkbox} from 'nuke';
import { getAuthSign, getallKeywords, deleteKeywords ,setKeywordPricevon} from '../api'
import QN from 'QAP-SDK';
import _ from 'lodash';
import { showLoading,hideLoading,number_format } from './util';
let {height} = Dimensions.get('window');

class GetKeywordsView extends Component {
  constructor() {
    super()
    this.state={
      subway_token: '',
      value:2,
      dataobj: {},
      keywordList:[],
    }
    showLoading();
    this.keywordPrice = 0;
  } 
  componentDidMount () {
    var URL= document.URL;
        let obj= QN.uri.parseQueryString(URL.split('?')[1]);
        this.setState({
            dataobj: obj
        })
        var adgroup_id= this.state.dataobj.adgroup_id;
        var campaign_id= this.state.dataobj.campaign_id;

     getAuthSign().then((result) => {
          this.setState({
                    subway_token: result
               })
          getallKeywords(this.state.subway_token, adgroup_id, campaign_id).then((result) => {
                    if(result.length > 0){
                        this.setState({keywordList:result});
                    }
                    hideLoading();
           }, (error) => {
                hideLoading();
                    Modal.toast(JSON.stringify(error));
                });  
           }, (error) => {
             hideLoading();
                Modal.toast(JSON.stringify(error));
            });      
  }
  addkeywords (adgroup_id) {
      QN.navigator.push({
      url: 'qap://views/addkeywords.js',
      query: { adgroup_id:adgroup_id },
      settings: {
          animate: true,
          request: true,
      }
    });
  }
  itemCheck (item, value) {
      
        var index = _.findIndex( this.state.keywordList, function(o) { return o.word == item.word; });
        this.state.keywordList[index].checked = (value == true ? 1 : 0);
        let newkeyword = this.state.keywordList;
        this.setState({keywordList:newkeyword});  
  }
  delkeywords () {
      var select_num =0;
      this.state.keywordList.map((v,i)=>{
              if(v.checked != undefined && v.checked == 1){
                  select_num = 1;
                  return;
              }
          });
      if(select_num == 0){
          Modal.alert("请选择需要删除的关键词",[ 
            {
                onPress:(e)=>{console.log(e)},
                text:"好的"
            }
        ])
        return;
       }


       Modal.confirm('确定删除所选关键词吗？',[ 
        {
            onPress:()=>{
                var keyword_ids=[];
                var len = this.state.keywordList.length;
                Modal.toast('正在删除~')
                this.state.keywordList.map((v,i)=>{
                    if(v.checked != undefined && v.checked == 1){
                        keyword_ids.push(v.keyword_id);
                    }
                });
                
                deleteKeywords(this.state.dataobj.campaign_id, keyword_ids).then((result) => {
                    
                      if(result.length > 0){
                            Modal.toast('删除关键词成功');
                            var lastKeyword = [];
                            result.map((v,i)=>{
                                lastKeyword = _.remove(this.state.keywordList, function(n) {
                                      return n.keyword_id == v.keyword_id;
                                    });  
                            })
                            var  datas = this.state.keywordList;    
                            this.setState({keywordList:datas});                             
                        }
                    }, (error) => {
                        Modal.toast(JSON.stringify(error));
                    });
            },
            text:"确定"
        },
        {
            onPress:()=>{

            },
            text:"取消"
        }
    ]);
        
  }
  changePrice () {
    var select_num =0;
      this.state.keywordList.map((v,i)=>{
              if(v.checked != undefined && v.checked == 1){
                  select_num = 1;
                  return;
              }
          });
      if(select_num > 0){
         this.refs.modal.show();
       }else{
        Modal.alert("请选择需要调价的关键词",[ 
            {
                onPress:(e)=>{console.log(e)},
                text:"知道了"
            }
        ])
       }   
  }
  hideModal(){
        this.refs.modal.hide();
  }
  checkPrice(){
    if(this.state.value == 2){
       var price  =  this.state.dataobj.default_price /100;
    }else{
       var price = this.keywordPrice;
    }
     
      var re =/^\d+(\.\d+)?$/;  

      if(price * 100  < 5   || price * 100  > 9999)
         {
              Modal.toast('填写范围在0.05元到100元之间的数字');
              return;
          }

       if(!re.test(price)) {
           Modal.toast('关键词价格必须是正数');
          return;
      }   

      return price;
  }
  submitPrice(){
      var price = this.checkPrice();
      var isDefaultPrice = 0;
      this.setState({value:2});
      if(price){
      
        if(this.state.value == 1){
            isDefaultPrice = 1;
        }
      
        var keywords=[];
         
          this.state.keywordList.map((v,i)=>{
              if(v.checked != undefined && v.checked == 1){
                  keywords.push({
                    keywordId:v.keyword_id,
                    matchScope:1,
                    maxPrice:price * 100,
                    isDefaultPrice:isDefaultPrice
                  });
              }
          });
          if(keywords.length > 0){
              setKeywordPricevon(keywords).then((result)=>{
                Modal.toast('修改出价成功');
                this.state.keywordList.map((v,i)=>{
                  if(v.checked != undefined && v.checked == 1){
                     this.state.keywordList[i].max_price = price * 100;
                      this.state.keywordList[i].checked = 0;
                  }
                });
               let newkeyword = this.state.keywordList;
                this.setState({keywordList:newkeyword});
               this.refs.modal.hide();
              
            },(error)=>{
              Modal.alert(error)
            });
           }
        }else{
           Modal.alert('请填写关键处出价');
        }
  }
  groupChange(value){
       this.setState({
          value:value
          });
  }
  render () {
    var adgroup_id= this.state.dataobj.adgroup_id;
    var title= this.state.dataobj.name;
    var imgage= this.state.dataobj.imgage;
    var online_status= this.state.dataobj.online_status;

    return (
      <View>
           <View style={styles.cellItemList}>
            <Image source={{uri: imgage}} style={{width:'180rem',height:'180rem'}}/>
                <View style={styles.itemTextList}>
                  <Text style={{fontSize: '32rem', paddingBottom: '15rem', textOverflow:'ellipsis',lines:2,width:'480rem'}}>{title}</Text>
                  <View style={{ flexDirection:"row",display: 'flex'}}>
                  <Text style={{fontSize:'30rem'}}>
                          状态:
                    </Text>
                    {
                       online_status == 'online' ?
                        <Text style={{fontSize:'30rem',color:'#1DC11D',paddingLeft:'10rem'}}>
                             推广中
                        </Text>
                        :
                        <Text style={{fontSize:'30rem',color:'#f50',paddingLeft:'10rem'}}>
                            暂停中
                        </Text>
                    }
                    <Text style={{paddingLeft: '40rem',paddingBottom: '20rem', fontSize:'30rem'}}>已添加关键词: {this.state.keywordList.length} 个</Text>
                    </View>
                  <View style={{flexDirection:'row', marginTop: '10rem', marginLeft: '10rem'}}>
                  <Button size='small'  onPress={this.addkeywords.bind(this, adgroup_id)} type="secondary">
                  添加
                  </Button>
                  <Button size='small' type="secondary" onPress={this.changePrice.bind(this)}>
                  调价
                  </Button>
                    <Button size='small' type="secondary" onPress={this.delkeywords.bind(this)}>删除</Button>
              </View>
              </View>
           </View>

           <ScrollView style={styles.scroller} onEndReachedThreshold={300}>
                <View style={[styles.subCell,{backgroundColor:'#EBEBEB'}]}>      
                  <View style={styles.col1}><Text></Text></View>
                  <View style={styles.col2}><Text style={styles.col4}>关键词</Text></View>
                  <View style={styles.col1}><Text style={styles.col4}>出价</Text></View>
                  <View style={styles.col1}><Text style={styles.col4}>展现</Text></View>
                  <View style={styles.col1}><Text style={styles.col4}>点击</Text></View>
                  <View style={styles.col1}><Text style={styles.col4}>成交</Text></View>
                  <View style={[styles.col2,{paddingRight:0}]}><Text style={styles.col4}>质量分</Text></View>
                </View> 
              { this.state.keywordList.length == 0 ? <Text style={{fontSize:'30rem',padding:'200rem'}}>您还没有添加关键词</Text> : this.state.keywordList.map((item, index) =>{
                return (
                    <View style={styles.subCell}>
                       <View style={styles.col1}><Checkbox onChange={this.itemCheck.bind(this, item)} checked={(item.checked && item.checked) == 1 ? true : false}/></View>
                        <View style={styles.col2}><Text style={styles.col3}>{item.word}</Text></View>
                        <View style={styles.col1}><Text style={styles.col3}>{(item.max_price/100).toFixed(2)}</Text></View>
                        <View style={styles.col1}><Text style={styles.col3}>{number_format(item.impressions)}</Text></View>
                        <View style={styles.col1}><Text style={styles.col3}>{number_format(item.click)}</Text></View>
                        <View style={styles.col1}><Text style={styles.col3}>{number_format(item.paycount)}</Text></View>
                        <View style={[styles.col2,{paddingRight:0}]}><Text style={styles.col3}>{item.qscore}</Text></View>
                     
                    </View>  
                  )
                })    
              }
           </ScrollView>
            <Dialog ref="modal" contentStyle={styles.modalStyle} onShow={this.onShow} onHide={this.onHide}>
               <View>
                   <Text style={{padding:'20rem',fontSize:'32rem'}}>修改关键词出价</Text>
               </View>
                <View style={styles.body}>
                   <Radio.Group onChange = {this.groupChange.bind(this)} value={this.state.value}>
                    <View style={styles.item}>
                      <Radio size="small" value={1}></Radio>
                      <Text style={styles.title}>
                        自定义出价
                      </Text>
                      <Input  keyboardType="number-pad"  onBlur={(value)=>{this.keywordPrice =  value.target.attr.value;}}/>
                      <Text style={{fontSize:'30rem'}}> 元  </Text>
                    </View>
                    <View style={styles.item}>
                      <Radio size="small" value={2} ></Radio>
                      <Text style={[styles.title,{marginRight:"260rem",fontSize:'30rem'}]}>
                        默认出价  {this.state.dataobj.default_price/100}   元
                      </Text>
                        
                    </View>
                  </Radio.Group>
                    
                </View>
              
                <View style={styles.footer}>
                    <Button type='secondary' size="medium"  onPress={this.submitPrice.bind(this)}> 确定</Button>
                </View>
                <TouchableHighlight style={styles.close} onPress={this.hideModal.bind(this)}>
                        <Text style={styles.closeText}>X</Text>
                    </TouchableHighlight>
            </Dialog>
      </View>
    )
  }
}

const styles={
  scroller:{
        width: 750,
        height: height-300,
        flex: 1
     },
  listContainer: {
    heigth: height-300
  },
  cellItemList:{
        backgroundColor:"#ffffff",
        padding: '20rem',
        borderBottomWidth:"2rem",
        borderBottomStyle:"solid",
        borderBottomColor:"#e8e8e8",
        alignItems:"center",
        flexDirection:"row",
        display: 'flex'
   },
   arrows: {
    flex: 3,
   
    fontSize:'24rem'
  },
  arrow: {
    flex: 3,
   
    fontSize:'30rem'
  },

  wrapper: {
    height: height,
    paddingLeft: '24rem',
    paddingRight: '24rem',
    paddingTop: '24rem'
  },
  click: {
    height: '100rem',
    lineHeight: '100rem',
    textAlign: 'center',
    borderWidth: '1rem',
    borderStyle: 'solid',
    borderColor: '#ccc'
  },
  modalStyle: {
    width: '640rem',
    height: '400rem'
  },
  body: {
    padding:'20rem'
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
  
    alignItems:"center",
    flexDirection:"row",
    display: 'flex',
    margin:0
  },
  close: {
    borderWidth: '1rem',
    borderStyle: 'solid',
    borderColor: '#ccc',
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40rem',
    height: '40rem',
    borderRadius: '20rem',
    backgroundColor: '#ffffff'
  },
  closeText: {
    fontSize: '28rem',
    color: '#000000'
  },
  title:{
        color:'#383B3E',
        height:'44px',
        lineHeight: '44px',
        fontSize:'30rem'
    },
  item:{
      display:'flex',
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'space-between',
      borderTopWidth:'1px',
      borderTopColor:'#EDEDEF',
      borderTopStyle:'solid',
      paddingTop:'5px',
      paddingBottom:'5px',
      paddingLeft:'20px',
      paddingRight:'20px'
  },
    delayValue:{
        color:'#383B3E'
    },
  subCell:{
    padding:'20rem 0 20rem 10rem',
    borderBottomStyle:'solid',
    borderBottomWidth:'1rem',
    borderBottomColor:'#e8e8e8',  
    flexDirection:"row",
    display:'flex',
  },
   col1:{
        fontSize:'30rem',
        color:'#5F646E',
        paddingRight:'5rem',
        flex:45
    },
  col2:{
        fontSize:'30rem',
        color:'#5F646E',
        paddingRight:'5rem',
        flex:62
  },
  col3:{
    fontSize:'26rem',
  },
   col4:{
    fontSize:'30rem'
  }
}

mount(<GetKeywordsView />, 'body');


