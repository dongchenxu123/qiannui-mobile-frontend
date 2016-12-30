'use strict';

var date = new Date();
export var  yesterday = [date.getFullYear(), date.getMonth() +1,date.getDate() -1].join('-');
 date = new Date();
export var today = [date.getFullYear(), date.getMonth() +1,date.getDate()].join('-');
date = new Date();
export var threedaysAgo = [date.getFullYear(), date.getMonth() +1,date.getDate() -3].join('-');
date = new Date();
export var lastWeek = [date.getFullYear(), date.getMonth() +1,date.getDate() -7].join('-');
date = new Date();
export var lastMonth = [date.getFullYear(), date.getMonth(),date.getDate()].join('-');
