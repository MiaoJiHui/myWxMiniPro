// pages/events/index.js

var app = getApp();

Page({
  data: {
    dataList: [],
    dataSlide: [],
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 500,
    eventsUrl: "https://demo.com/events/list.html?limit=10&city_id=",
    searchUrl: "https://demo.com/events/list.html?cat_id=events&k=",
    page: 1,
    cityId: 1
  },
  onLoad: function(){
    // wx.showNavigationBarLoading();
    wx.showToast({
      title: 'Loading',
      icon: 'loading',
      duration: 1500
    })
    var that = this;
    var city_id = app.globalData.cityId;
    var url = that.data.eventsUrl + city_id;
    wx.request({
      url: url,
      method: 'GET',
      header: {'content-type': 'application/json'},
      success: function(res){
        that.setData({
          cityId: city_id,
          dataList: res.data.body.data_list,
          dataSlide: res.data.body.data_slide
        });
        wx.hideToast();
      }
    })
  },
  onShow: function(){
    var that = this;
    var pre_city_id = that.data.cityId;
    var current_city_id = app.globalData.cityId;
    var url = that.data.eventsUrl + current_city_id;
    if(current_city_id !== pre_city_id){
      wx.request({
        url: url,
        method: 'GET',
        header: {'content-type': 'application/json'},
        success: function(res){
          wx.hideNavigationBarLoading();
          that.setData({
            cityId: current_city_id,
            dataList: res.data.body.data_list,
            dataSlide: res.data.body.data_slide
          });
        }
      })
    }
   
  },
  // 下一页
  onReachBottom: function () {
    // wx.showNavigationBarLoading();
    wx.showToast({
      title: 'Loading',
      icon: 'loading',
      duration: 1500
    })
    // var current_data = this.getData()
    var that = this;
    that.data.page++;
    var city_id = app.globalData.cityId;
    var page = that.data.page;
    var url = that.data.eventsUrl + city_id + "&page=" + page;
    // console.log(url)
    wx.request({
      url: url,
      method: 'GET',
      header: { 'content-type': 'application/json'},
      success: function(res) {
        // wx.hideNavigationBarLoading();
        that.setData({
          dataList: that.data.dataList.concat(res.data.body.data_list),
          dataSlide: res.data.body.data_slide
        });
        wx.hideToast();
      }
    })
    
  },
  bindItemTap: function(e) {
    // console.log(e)
    var id = e.currentTarget.id;
    // console.log(id);
    wx.navigateTo({
      url: '../events/events_detail?id='+id
    })
  },
  bindSwiper: function(e){
    var link = e.currentTarget.id;
    // console.log(link)
    var events_id = parseInt(link.replace(/[^0-9]+\//ig, ""));
    wx.navigateTo({
      url: '../events/events_detail?id='+events_id
    })
  },
  inputBlur: function(e){
    wx.showToast({
      title: 'Loading',
      icon: 'loading',
      duration: 1500
    });
    var input_value = e.detail.value;
    var that = this;
    var city_id = app.globalData.cityId;
    var url = that.data.searchUrl + input_value + "&city_id=" + city_id;
    // console.log(url);
    wx.request({
      url: url,
      method: 'GET',
      header: {'content-type': 'application/json'},
      success: function(res){
        that.setData({
          dataList: res.data.body.data_list
        });
        wx.hideToast();
      }
    });
  },
})