import { getAuthSign } from './authsign';
import { getSellerUser, getUserInfo, getProfileReport, getProfileBalance } from './profile'
import { getCampaign, 
        getCompaignReport,
        setBuget,setStatus,
        getSchedule,
        setSchedule,
        getArea,
        setArea,
        getPlatfrom,
        setPlatfrom
        } from './compaign';
import { getAdgroupsByCid,getOnsaleItem } from './adgroup'


const api = {
    getAuthSign: getAuthSign,  // 登录的subway_token 必须先调用它 才能使用其他接口
    getSellerUser : getSellerUser,  //卖家信息
    UserInfo : getUserInfo, //登录用户信息
    ProfileReport : getProfileReport,//店铺报表
    WuxianBalance: getProfileBalance,//直通车店铺余额
    getCampaign: getCampaign,//获取推广计划列表
    getCampaignRpt: getCompaignReport ,// 推广计划数据报表
    setBuget:setBuget,//设置计划日限额
    setStatus:setStatus,//设置计划推广状态
    getSchedule : getSchedule ,//获取计划分时折扣数据
    setSchedule :setSchedule ,//设置计划分时折扣数据
    getArea:getArea ,//获取计划投放区域
    setArea:setArea,// 设置投放区域
    getPlatfrom:getPlatfrom,//获取计划投放平台
    setPlatfrom:setPlatfrom, //设置计划投放平台
    getAdgroups:getAdgroupsByCid,//计划下推广组列表
    getOnsaleItem:getOnsaleItem,//在售宝贝

}

export default api 