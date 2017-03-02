'use strict';

export const httphost = 'https://qianniu.xibao100.com';

var date = new Date();
    date.setDate(date.getDate() - 1);
export const  yesterday = date;

    date = new Date();
    date.setDate(date.getDate());
export const today =  date;


    date = new Date();
    date.setDate(date.getDate()-3);
export const threedaysAgo = date;


    date = new Date();
    date.setDate(date.getDate()-7);
export const lastWeek = date;


    date = new Date();
    date.setMonth(date.getMonth()-1);
export var lastMonth = date;


    date = new Date();
    date.setMonth(date.getMonth()-3);
export const threeMonthAgo = date;

    date = new Date();
    date.setDate(date.getDate()+3);
export const nextThreedays = date;


export function formatDate(date, format) {
    var dd = date.getDate();
    var mm = date.getMonth()+1; //January is 0!
    var yyyy = date.getFullYear();
    if(dd<10){
        dd='0'+dd;
    }
    if(mm<10){
        mm='0'+mm;
    }
    if (format === "dd/mm") {
        return dd+'/'+mm;
    }
    else if (format ==="yyyymmdd"){
        return yyyy+''+mm+''+dd;
    }else if(format ==="yyyy/mm/dd"){
        return yyyy+'/'+mm+'/'+dd;
    }
    return yyyy+'-'+mm+'-'+dd;
}
