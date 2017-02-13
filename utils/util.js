var Promise = require('../utils/es6-promise.min.js')  // 引入Promise的实现库

function wxPromisify(fn) {  
  return function (obj = {}) {    
    return new Promise((resolve, reject) => {      
      obj.success = function (res) {        
        resolve(res);      
      }      

      obj.fail = function (res) {        
        reject(res);     
      }      

      fn(obj);
    })  
  }
}

function formatTime(date) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();

  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
}

function formatNumber(n) {
  n = n.toString();
  return n[1] ? n : '0' + n;
}

// cityId没有2，上海北京深圳广州：1345
function dealCityId(id){
  var city = 1; // 默认上海
  switch(id){
    case 1 : city = 1; break;
    case 2 : city = 3; break;
    case 3 : city = 4; break;
    case 4 : city = 5; break;
    default: city = 1; break;
  }
  return city;
}

// 处理&amp;等这些html可识别的符号标记
function dealChar(){
  // var reg = /(\w*)&amp;(.*)&quot(.*)&#39;|’(.*)/g;
  // return this.replace(reg, "$1&$2\"$3'$4")
  return this.replace(/&amp;/ig, '&')
             .replace(/&#39;|’|‘/ig, "'")
             .replace(/，/ig, ",,,")
             .replace(/“|”|&quot;/ig, '"');
}

module.exports = {
  formatTime: formatTime,
  dealCityId: dealCityId,
  wxPromisify: wxPromisify,
  dealChar: dealChar
}
