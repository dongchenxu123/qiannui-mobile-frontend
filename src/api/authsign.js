'use strict';
import QN from 'QAP-SDK';
import APIError from './checkerror';

export function getAuthSign(){
    return QN.top.invoke({
            query: {
                 method:'taobao.simba.login.authsign.get'
            }
        }).then((result)=>{
            return   result.simba_login_authsign_get_response.subway_token;
        })
        .catch(error => {
            Modal.toast(APIError(error));
        });  
}



