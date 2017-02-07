'use strict';
import { Radio} from 'nuke';
import {mount} from 'nuke-mounter';
import {createElement, Component} from 'weex-rx';
import {View, Text,Input,TextInput,Image, Modal, Dialog, TouchableHighlight, Navigator, Button, ScrollView, ListView, Dimensions, Checkbox} from 'nuke';
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
  showkeywordslist (adgroup_id) {
      QN.navigator.push({
      url: 'qap://views/keywordslist.js',
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
       Modal.confirm('确定删除所选关键词吗？',[ 
        {
            onPress:()=>{
                var keyword_ids=[];
                var len = this.state.keywordList.length;

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
      this.refs.modal.show();
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
 
    /*    if(keywords.length > 0){
             Modal.toast('修改出价成功');
            setKeywordPricevon(keywords).then((result)=>{
 Modal.toast('修改出价成功2');
              this.state.keywordList.map((v,i)=>{
                if(v.checked != undefined && v.checked == 1){
                   this.state.keywordList[i].max_price = price;
                    this.state.keywordList[i].checked = 0;
                }
              });
              let newkeyword = this.state.keywordList;
              this.setState({keywordList:newkeyword});
             

              setTimeout(function(){
               //this.refs.modal.hide();
              } ,2000);
              
            },(error)=>{
              Modal.alert(error)
            });
          }
        }else{
           this.refs.modal.hide();
          Modal.toast('请选择需要调价的关键词');
        } */
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
    var itemStatus= online_status == 'online' ? '推广中' : '暂停中';
   // var self = this;
    return (
      <View>
           <View style={styles.cellItemList}>
            <Image source={{uri: imgage}} style={{width:'180rem',height:'180rem'}}/>
                <View style={styles.itemTextList}>
                  <Text style={{fontSize: '30rem', paddingBottom: '15rem', width: '600rem'}}>{title}</Text>
                  <View style={{ flexDirection:"row",display: 'flex'}}>
                    <Text style={{color: '#3089dc'}}>
                      状态: {itemStatus}
                    </Text>
                    <Text style={{paddingLeft: '40rem',paddingBottom: '20rem', color: 'red'}}>已添加关键词: {this.state.keywordList.length} 个</Text>
                    </View>
                  <View style={{flexDirection:'row', marginTop: '10rem', marginLeft: '10rem'}}>
                  <Button size='small'  onPress={this.showkeywordslist.bind(this, adgroup_id)} type="secondary">
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
              <View style={styles.cellItemList}>
                <Text style={styles.arrow}></Text>
                <Text style={styles.arrow}>关键词</Text>
                <Text style={styles.arrow}>出价</Text>
                <Text style={styles.arrow}>展现</Text>
                <Text style={styles.arrow}>点击</Text>
                <Text style={styles.arrow}>成交</Text>
                <Text style={styles.arrow}>质量分</Text>
              </View>
              { this.state.keywordList.length == 0 ? <Text>您还没有添加关键词</Text> : this.state.keywordList.map((item, index) =>{
                return (
                    <View style={styles.cellItemList}>
                    <Checkbox onChange={this.itemCheck.bind(this, item)} checked={(item.checked && item.checked) == 1 ? true : false}/>
                  <Text style={styles.arrows}>{item.word}</Text>
                  <Text style={styles.arrows}>{(item.max_price/100).toFixed(2)}</Text>
                  <Text style={styles.arrows}>{number_format(item.impressions)}</Text>
                  <Text style={styles.arrows}>{number_format(item.click)}</Text>
                  <Text style={styles.arrows}>{number_format(item.paycount)}</Text>
                  <Text style={styles.arrows}>{item.qscore}</Text>
                </View>
                  )
                })    
              }
           </ScrollView>
            <Dialog ref="modal" contentStyle={styles.modalStyle} onShow={this.onShow} onHide={this.onHide}>
               <View>
                   <Text style={{padding:'20rem'}}>修改关键词出价</Text>
               </View>
                <View style={styles.body}>
                   <Radio.Group onChange = {this.groupChange.bind(this)} value={this.state.value}>
                    <View style={styles.item}>
                      <Radio size="small" value={1}></Radio>
                      <Text style={styles.title}>
                        自定义出价
                      </Text>

                      <Input keyboardType="number-pad" onFocus={() => this.setState({value:1})} onBlur={(value)=>{this.keywordPrice =  value.target.attr.value;}}/>   
                    </View>
                    <View style={styles.item}>
                      <Radio size="small" value={2} ></Radio>
                      <Text style={[styles.title,{marginRight:"260rem"}]}>
                        默认出价  {this.state.dataobj.default_price/100}  
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
    top: '-15rem',
    right: '-15rem',
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
        lineHeight: '44px'
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
    }
}

mount(<GetKeywordsView />, 'body');


