import { getAuthSign,getLocalstoreUser,localstoreUser } from './authsign';
import { getSellerUser, 
        getUserInfo, 
        getProfileReport,
        getProfileBalance,
        createNewDspUser 
    } from './profile';

import { getCampaign, 
        getCompaignReport,
        setBuget,
        setStatus,
        getSchedule,
        setSchedule,
        getArea,
        setArea,
        getPlatfrom,
        setPlatfrom,
        } from './compaign';

import { getAdgroupsByCid,
        deleteAdgroup,
        updateAdgroup,
        getUnSaleItem,
        addAdgroup,
        getAdgroupsAll
    } from './adgroups';

import {getOnsaleItem} from './onsale-item';

import {getallKeywords,
        getRecommendKeywords,
        deleteKeywords,
        addNewKeyword,
        getItemNumByKeyword,
        getStoreKeyword,
        setKeywordPricevon
    } from './keywords';

import {checkIssetDspUser,
        getDspOnsaleItems,
        getDspUserInfo,
        getDspUserMarket,
        setCpc,
        setBudget,
        setItemsOffline,
        setItemsOnline,
        setDspPassword,
        getRechargeTempalte,
        getTodayReport,
        getHistoryReport
    } from './dsp';


const api = {
    getAuthSign: getAuthSign,  // 登录的subway_token 必须先调用它 才能使用其他接口
    getSellerUser : getSellerUser,  //卖家信息
    UserInfo : getUserInfo, //登录用户信息
    ProfileReport : getProfileReport,//店铺报表
    WuxianBalance: getProfileBalance,//直通车店铺余额
    getCampaign: getCampaign,//获取推广计划列表
    setBuget:setBuget,//设置计划日限额
    setStatus:setStatus,//设置计划推广状态
    getSchedule : getSchedule ,//获取计划分时折扣数据
    setSchedule :setSchedule ,//设置计划分时折扣数据
    getArea:getArea ,//获取计划投放区域
    setArea:setArea,// 设置投放区域
    getPlatfrom:getPlatfrom,//获取计划投放平台
    setPlatfrom:setPlatfrom, //设置计划投放平台
    getAdgroupsByCid:getAdgroupsByCid,//计划下推广组列表
    getOnsaleItem:getOnsaleItem,//在售宝贝
    deleteAdgroup:deleteAdgroup,//删除一个推广组
    updateAdgroup:updateAdgroup,//更新一个推广组状态
    getUnSaleItem:getUnSaleItem,//一个计划内未推广的宝贝
    addAdgroup:addAdgroup,//在计划中推广一个宝贝
    getallKeywords:getallKeywords,//获取一个推广组的关键词
    getRecommendKeywords:getRecommendKeywords,//获取推荐关键词
    getStoreKeyword:getStoreKeyword,//获取公司自己关键词库
    deleteKeywords:deleteKeywords,//删除关键词，支持批量删除
    addNewKeyword:addNewKeyword,//添加关键词
    getItemNumByKeyword:getItemNumByKeyword,//获取使用该关键词的宝贝数量
    localstoreUser:localstoreUser,//设置登陆用户存储信息
    getLocalstoreUser:getLocalstoreUser,//获取登陆用户存储信息
    createNewDspUser:createNewDspUser,//创建dsp用户
    checkIssetDspUser:checkIssetDspUser,//检测是否存在dsp用户id
    getDspUserMarket:getDspUserMarket,//获取dsp用户日限额 、余额、dsp在线推广的宝贝
    getDspOnsaleItems:getDspOnsaleItems,//整理完成的 淘外引流列表数据,
    getDspUserInfo:getDspUserInfo,//获取dsp用户信息
    setCpc:setCpc,//设置淘外引流cpc
    setBudget:setBudget,//设置淘外日限额
    setItemsOffline:setItemsOffline,//设置淘外宝贝推广下线
    setItemsOnline:setItemsOnline,//设置淘外宝贝推广
    getAdgroupsAll:getAdgroupsAll,//获取计划下所有的推广组
    setKeywordPricevon:setKeywordPricevon, // 设置关键词出价
    getRechargeTempalte:getRechargeTempalte,//充值模板
    setDspPassword:setDspPassword,//设置dsp登陆密码
    getTodayReport:getTodayReport,//dsp报表 今天
    getHistoryReport:getHistoryReport //dsp 报表历史

}

export default api 