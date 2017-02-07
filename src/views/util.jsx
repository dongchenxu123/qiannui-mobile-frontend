import QN from 'QAP-SDK';

export function showLoading(text){
    QN.showLoading({
    query: {
        text: text ? text:'加载中 ~~'
    },
    success(result) {
       
    },
    error(error) {
        
    }
}).then(result => {
  
}, error => {
  
});
}

export function hideLoading(){
    QN.hideLoading({
    success(result) {
      
    },
    error(error) {
       
    }
}).then(result => {
   
}, error => {
    
});
}

export function number_format(s, prefix) {
    if (prefix === undefined) {
        prefix = '';
    }
    if (s === null || s === undefined) {
        return '-';
    }
    s = s.toString();
    var re = /(\d)(\d{3},)/;
    if (s.indexOf('.') === -1) {
        if (/[^0-9\.\-]/.test(s)) {
            return "0";
        }
        s = s.replace(/^(-)?(\d*)$/, "$1$2.");
        s = (s + "00").replace(/(-)?(\d*\.\d\d)\d*/, "$1$2");
        s = s.replace(".", ",");
        while (re.test(s)) {
            s = s.replace(re, "$1,$2");
        }
        s = s.replace(/,(\d\d)$/, ".$1");
        s = prefix + s.replace(/^\./, "0.");
        return s.replace('.00', '');
    }
    if (/[^0-9\.\-]/.test(s)) {
        return "0";
    }
    s = s.replace(/^(-)?(\d*)$/, "$1$2.");
    s = (s + "00").replace(/(-)?(\d*\.\d\d)\d*/, "$1$2");
    s = s.replace(".", ",");
    re = /(\d)(\d{3},)/;
    while (re.test(s)) {
        s = s.replace(re, "$1,$2");
    }
    s = s.replace(/,(\d\d)$/, ".$1");
    return prefix + s.replace(/^\./, "0.");
}