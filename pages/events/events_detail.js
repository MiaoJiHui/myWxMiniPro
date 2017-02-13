// pages/events/directory_detail.js

var WxParse = require('../../wxParse/wxParse.js');
var bmap = require('../../utils/bmap-wx.min.js'); 
var wxMarkerData = [];
var app = getApp();

Page({
  data:{
    pictures: [],
    eventsArray: [],
    venueList: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 500,
    // map: {
    //   markers: [],
    //   hasMarkers: true
    // },
    markers: [{
      iconPath: '../../images/location.png',
      id: 0,
      latitude: '31.212391',
      longitude: '121.562981',
      width: 25,
      height: 34
    }],
    // controls: [{
    //   id: 1,
    //   iconPath: '../../images/events1.png',
    //   position: {
    //     left: 0,
    //     top: 300 - 50,
    //     width: 50,
    //     height: 50
    //   },
    //   clickable: true
    // }],
    latitude: '31.230416', 
    longitude: '121.473701', 
    url: 'https://api.thatsmags.com/events/json-detail.html?id='
  },
  onLoad:function(options){
    // wx.showNavigationBarLoading();
    wx.showToast({
      title: 'Loading',
      icon: 'loading',
      duration: 1500
    });
    var that = this;
    var id = options.id;
    var city_id = app.globalData.cityId;
    var url = that.data.url + id + "&city_id=" + city_id;
    // console.log(id);
    // console.log(url);


    wx.request({
      url: url,
      method: 'GET',
      header: { 'content-type': 'application/json'},
      success: function(res){
        // wx.hideNavigationBarLoading();

        // console.info(res);
        var rich_text = res.data.body.data.content.replace(/\&#39;/ig,"'"); // 忽略大小写，且全局匹配
        var latitude = parseFloat(res.data.body.venue_list[0].maplat);
        var longitude = parseFloat(res.data.body.venue_list[0].maplng);

        // console.log(rich_text);

        

        // console.info(that.data.markers);
        // console.log(latitude+"----"+longitude);
        // console.log(res.data.body.venue_list);
        // console.log(that)
        // console.log("before wxParse");
        
        // WxParse.wxParse('events', 'html', rich_text, that, 0);
        that.setData({
          pictures: res.data.body.pictures,
          eventsArray: res.data.body.data,
          latitude: latitude,
          longitude: longitude,
          venueList: res.data.body.venue_list[0]
        });
        // wx.openLocation({
        //   latitude: latitude, // 纬度，范围为-90~90，负数表示南纬
        //   longitude: longitude, // 经度，范围为-180~180，负数表示西经
        //   scale: 28, // 缩放比例          
        // })
        wx.hideToast();
      }
    });

  },
  bindphoneCall: function(e){
    // console.log(e.currentTarget.id)
    var phone = e.currentTarget.id;
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  bind2venue: function(e){
    var share_link = e.currentTarget.id;
    var id = parseInt(share_link.replace(/[^0-9]+\//,""));
    // console.log(id);
    wx.navigateTo({
      url: "../directory/directory_detail?id="+id
    })
  },
  bind2map: function(){
    var that = this;
    var latitude = parseFloat(that.data.latitude);
    var longitude = parseFloat(that.data.longitude);
    // 通过api跳转到微信原生地图控件
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function(res) {
        // var latitude = res.latitude
        // var longitude = res.longitude
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          scale: 28
        })
      }
    })
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