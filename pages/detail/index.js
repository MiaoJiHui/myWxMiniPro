// pages/detail/index.js

var WxParse = require('../../wxParse/wxParse.js');
var utils = require('../../utils/util.js');
var app = getApp();

Page({
  data:{
    articleDetailUrl: 'https://api.thatsmags.com/archive/json-detail.html?id='
  },
  onLoad:function(options){
    // console.log(options);
  
    var id = options.id;
    var that = this;
    var url = that.data.articleDetailUrl + id;
    // console.log(url)
    wx.request({
      url: url,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "json"
      },
      success: function(res){
        console.log(res.data.body.data.content);
        var rich_text = utils.dealChar.call(res.data.body.data.content);

        var headline = utils.dealChar.call(res.data.body.data.fulltitle);
        var tags = res.data.body.data.keywords;
        console.log("rich_text============="+rich_text)

        var tag_array = tags.split(",");
        // console.log(tag_array)
        WxParse.wxParse('article', 'html', rich_text, that, 0);
        that.setData({
          articleObj: res.data.body.data,
          headline: headline,
          tagArray: tag_array
        })

      },
      fail: function(error) {
        console.log(error)
      },
      complete: function() {
        // complete
      }
    })
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})