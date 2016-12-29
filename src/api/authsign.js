'use strict';
import QN from 'QAP-SDK';
import APIError from './checkerror';


var app = app || {} ;

export function getAuthSign(){
    return QN.top.invoke({
            query: {
                 method:'taobao.simba.login.authsign.get'
            }
        }).then((result)=>{
            app.subway_token =  result.simba_login_authsign_get_response.subway_token;
            return  app.subway_token;
        })
        .catch(error => {
            Modal.toast(APIError(error));
        });  
}



