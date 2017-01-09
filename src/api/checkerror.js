'use strict';

export function checkAPIError(resp){
        var error = null;
        if ( resp.error_response !== undefined &&  resp.error_response.code !== undefined) {
            var msg = resp.error_response;
            error = msg.sub_msg !== undefined ? msg.sub_msg : (msg.msg !== undefined? msg.msg: (msg.sub_code!== undefined?msg.sub_code:'未知错误'));
        }
        return  error;
    }

