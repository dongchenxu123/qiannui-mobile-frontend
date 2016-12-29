import { getAuthSign } from './authsign';
import { getSellerUser, getUserInfo, getProfileReport, getProfileBalance } from './profile'

const api = {
    getAuthSign: getAuthSign,  // 登录的subway_token 必须先调用它 才能使用其他接口
    getSellerUser : getSellerUser,  //卖家信息
    UserInfo : getUserInfo, //登录用户信息
    ProfileReport : getProfileReport,//店铺报表
    WuxianBalance: getProfileBalance,//直通车店铺余额
    
}

export default api 