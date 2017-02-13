// pages/directory/directory_detail.js

var WxParse = require('../../wxParse/wxParse.js');
var bmap = require('../../utils/bmap-wx.min.js'); 
var utils = require('../../utils/util.js');
var wxMarkerData = []; 

var app = getApp();

Page({
  data:{
    pictures: [],
    directoryArray: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 500,
    map: {
      markers: [],
      hasMarkers: false
    },
    // markers: [{
    //   // iconPath: '../../images/directory1.png',
    //   id: 0,
    //   latitude: '31.230416',
    //   longitude: '121.473701',
    //   width: 50,
    //   height: 50
    // }],
    hasMarkers: false,
    controls: [{
      id: 1,
      // iconPath: '../../images/directory1.png',
      position: {
        left: 0,
        top: 300 - 50,
        width: 50,
        height: 50
      },
      clickable: true
    }],
    latitude: '31.230416', 
    longitude: '121.473701', 
    url: 'https://api.thatsmags.com/venue/json-detail.html?id='
  },
  onLoad:function(options){
    // wx.showNavigationBarLoading();
    wx.showToast({
      title: 'Loading',
      icon: 'loading'
    })
    var that = this;
    var id = options.id;
    var url = that.data.url;
    var city_id = app.globalData.cityId;
    // console.log(id);
    // console.log(url+id);

    wx.request({
      url: url+id + "&city_id=" + city_id,
      method: 'GET',
      header: { 'content-type': 'application/json'},
      success: function(res){
        // wx.hideNavigationBarLoading();
        
        var rich_text = utils.dealChar.call(res.data.body.data.content);
        var latitude = res.data.body.data.maplat;
        var longitude = res.data.body.data.maplng;

        WxParse.wxParse('directory', 'html', rich_text, that, 0);
       
        // console.log(latitude+"----"+longitude);
        console.log(res.data.body)
        that.setData({
          pictures: res.data.body.pictures,
          directoryArray: res.data.body.data,
          latitude: latitude,
          longitude: longitude
        });
        that.setData({
          'map.markers': [{
            id: 0,
            iconPath: '/images/location.png',
            latitude: latitude,
            longitude: longitude,
            width: 25,
            height: 34
          }],
          'map.hasMarkers': true
        });
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
  bind2map2: function(e){
    
    var map_info = e.currentTarget.id;
    var map_info_array = map_info.split(',');
    var latitude = parseFloat(map_info_array[0]);
    var longitude = parseFloat(map_info_array[1]);
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function(res) {
        // var latitude = res.latitude
        // var longitude = res.longitude
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          scale: 28 //改动似乎无效
        })
      }
    })
  },
  bind2map: function(){
    var that = this;
    var latitude = parseFloat(that.data.latitude);
    var longitude = parseFloat(that.data.longitude);
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function(res) {
        // var latitude = res.latitude
        // var longitude = res.longitude
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          scale: 28 //改动似乎无效
        })
      }
    })
  },
  previewPic: function(e){
    var current = e.currentTarget.id;
    var pic_array = new Array(current);
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: pic_array // 需要预览的图片http链接列表
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