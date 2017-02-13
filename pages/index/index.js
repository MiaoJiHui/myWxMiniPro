//index.js

// 引用百度地图微信小程序JSAPI模块 
var bmap = require('../../utils/bmap-wx.min.js');
var util = require('../../utils/util.js');
var Promise = require('../../utils/es6-promise.min.js');

//获取应用实例
var app = getApp();

// 引入promise
var getWxRequest = util.wxPromisify(wx.request);

Page({
  data: {
    galleryArray: [],
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 500,
    circular: false,
    homeArticlesArray: [],
    page: 1,
    array: ['SHANGHAI', 'BEIJING', 'GUANGZHOU', 'SHENZHEN'],
    objectArray: [
      {
        id: 1,
        name: 'SHANGHAI'
      },
      {
        id: 2,
        name: 'BEIJING'
      },
      {
        id: 3,
        name: 'GUANGZHOU'
      },
      {
        id: 4,
        name: 'SHENZHEN'
      }
    ],
    index: 0,
    cityId: 1,
    homeUrl: 'https://api.thatsmags.com/archive/list?limit=10',
    articleSearchUrl: 'https://api.thatsmags.com/archive/search.html?cat_id=1&k=',
    homeGallery: 'https://api.thatsmags.com/public/apphome?slide_num=3'

  },
  // 初始加载
  onLoad: function () {
    wx.showToast({
      title: 'Loading',
      icon: 'loading',
      duration: 2000
    });
    var that = this;

    // 新建Promise对象处理异步顺序执行
    new Promise(function(resolve, reject){
      // 新建百度地图对象 
      var BMap = new bmap.BMapWX({ 
          ak: 'zcSiGlQWS1srhntxfszzVeyWPccBntPm' 
      }); 
      var fail = function(data) { 
          console.log(data) 
      };
      var success = function(data) { 
        var weatherData = data.currentWeather[0]; 
        var currentCity = weatherData.currentCity;

        var index;
        switch(currentCity){
          case "上海市": index = 0; break;
          case "北京市": index = 1; break;
          case "广州市": index = 2; break;
          case "深圳市": index = 3; break; 
          default: index = 0;break;
        }
        if(typeof(index)!== undefined){
          console.log(index);
          var city_id = util.dealCityId(parseInt(index+1));
          that.setData({ index: index});
          that.setData({ cityId: city_id});
          app.globalData.cityId = city_id;
          resolve(util.dealCityId(parseInt(index+1))); //传值
        }
      }
      // 发起weather请求 
      BMap.weather({ 
          fail: fail, 
          success: success 
      });
    }).then(function (result){
      // console.log(result)
      var page = that.data.page;
      // console.log(page)
      var city_id = result;
      // console.log(city_id);
      var home_slide = that.data.homeGallery + "&city_id=" + city_id;
      var home_list_url = that.data.homeUrl + "&city_id=" + city_id;
      // console.log(home_list_url);
      // console.log(home_slide);
      var city_id = result;
      wx.request({
        url: home_slide,
        method: 'POST',
        header: { 'content-type': 'application/json'},
        success: function(res) {
          if(res){
            // console.log(res)
            var galleryArray = res.data.body.app_home_slide;
            that.setData({
              galleryArray: galleryArray
            })
          }
        }
      });

      // 请求首页list接口数据
      wx.request({
        url: home_list_url,
        method: 'GET',
        header: { 'content-type': 'application/json'},
        success: function(res) {
          if(res){
            that.setData({
              homeArticlesArray: res.data.body.data_list
            })
            wx.hideToast();
          }
        }
      })
    });

   
  },
  refreshIndexPage: function(page_index) {

    var url = this.data.homeUrl;
    var that = this;
    
    wx.showNavigationBarLoading();
    wx.request({
      url: 'https://api.thatsmags.com/archive/list?limit=10&page=1&city_id='+page_index,
      method: 'GET',
      header: { 'content-type': 'application/json'},
      success: function(res){
        if(res){
          wx.hideNavigationBarLoading();
          that.setData({
            homeArticlesArray: res.data.body.data_list
          })
        }
      }
    });
  },
  // 切换城市
  bindPickerChange: function(e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    });
    var that = this;
    var list_url = that.data.homeUrl;
    var gallery_url = that.data.homeGallery;

    var city_id = util.dealCityId(parseInt(e.detail.value) + 1);
    // console.log("-----------city_id:"+city_id);
    app.globalData.cityId = city_id;

    wx.request({
      url: list_url + "&city_id=" + city_id,
      method: 'GET',
      header: { 'content-type': 'application/json'},
      success: function(res){
        if(res){
          wx.hideNavigationBarLoading();
          that.setData({
            homeArticlesArray: res.data.body.data_list
          })
        }
      }
    });
    wx.request({
      url: gallery_url + "&city_id=" + city_id,
      method: 'POST',
      header: { 'content-type': 'application/json'},
      success: function(res){
        if(res){
          wx.hideNavigationBarLoading();
          that.setData({
            galleryArray: res.data.body.app_home_slide
          })
        }
      }
    });
    
  },
  // 点击轮播跳转
  bindSwiper: function(e){
    var link = e.currentTarget.id;
    var id = parseInt(link.replace(/[^0-9]+\//,""));
    var url = '../index/index';
    if(link.indexOf("post") > 0){
      url = '../detail/index?id='+id
    }
    if(link.indexOf("directory") > 0){
      url = '../directory/directory_detail?id='+id
    }
    if(link.indexOf("events") > 0){
      url = '../events/events_detail?id='+id
    }
    wx.navigateTo({
      url: url
    })
   
  },
  // 点击articlelist跳转事件
  bindItemTap: function(e) {
    // console.log(e.currentTarget.id);
    var link = e.currentTarget.id;
    // console.log("link:"+link)
    wx.navigateTo({
      url: '../detail/index?id='+link
    })
  },
  // 搜索框失去焦点
  inputBlur: function(e){
    wx.showNavigationBarLoading();
    var input_value = e.detail.value;
    // console.log(input_value)
    var that = this;
    var url = that.data.articleSearchUrl + input_value;
    // console.log(url);
    wx.request({
      url: url,
      method: 'GET',
      header: {'content-type': 'application/json'},
      success: function(res){
        wx.hideNavigationBarLoading();
        that.setData({
          homeArticlesArray: res.data.body.data_list
        })
      }
    });
  },
  // 下拉刷新
  onPullDownRefresh: function(){
    var that = this;
    wx.showNavigationBarLoading();
     wx.request({
      url: 'https://api.thatsmags.com/archive/list?limit=10&page=1',
      method: 'GET',
      header: { 'content-type': 'application/json'},
      success: function(res) {
        if(res){

          wx.hideNavigationBarLoading();
          wx.stopPullDownRefresh();
          that.setData({
            homeArticlesArray: res.data.body.data_list
          })
        }
      }
    });
  },

  // 下一页
  onReachBottom: function () {
    wx.showNavigationBarLoading();
    // var current_data = this.getData()
    var that = this;
    that.data.page++;
    var homeUrl = that.data.homeUrl;
    var city_id = that.data.cityId;
    // var url = 'https://api.thatsmags.com/archive/list?os=android&lat=31.20819&lng=121.625916&device_id=861054037928152&limit=10&version=1.0.4&city_id=1&page=' + that.data.page;

    wx.request({
      url: homeUrl + "&city_id=" + city_id + "&page=" + that.data.page,
      method: 'GET',
      header: { 'content-type': 'application/json'},
      success: function(res) {1
        if(res){
          // console.log(res)
          wx.hideNavigationBarLoading();     
          that.setData({
            homeArticlesArray: that.data.homeArticlesArray.concat(res.data.body.data_list)
          })
        }
      }
    }) 
  },
  onReady: function(){
  },
  // 分享
  onShareAppMessage: function () {
    return {
      title: "That's Mini",
      path: '/page/index/index'
    }
  }

});

