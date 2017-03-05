// pages/guides/index_detail.js
var app = getApp();

Page({
 data: {
    dataList: [],
    dataSlide: [],
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 500,
    guidesUrl: "https://demo.com/archive/list?cat_id=",
    page: 1
  },
  onLoad: function(options){
    var that = this;
    if(options.id){
       wx.setNavigationBarTitle({
          title: options.id
        })
    }
    var city_id = app.globalData.cityId;

    var url = that.data.guidesUrl + options.id + "&city_id=" + city_id;
    wx.request({
      url: url,
      method: 'GET',
      header: { 'content-type': 'application/json'},
      success: function(res) {
        wx.hideNavigationBarLoading();
        // console.log(res.data.body.data_slide);
        that.setData({

          cityId: city_id,
          dataList: res.data.body.data_list,
          dataSlide: res.data.body.data_slide
        });
      }
    });
  },
  
  // 下一页
  onReachBottom: function () {
    wx.showToast({
      title: 'Loading',
      icon: 'loading',
      duration: 1500
    })
    var that = this;
    that.data.page++;
    var city_id = app.globalData.cityId;
    var page = that.data.page;
    var url = that.data.guidesUrl + city_id + "&page=" + page;
    // console.log(url)
    wx.request({
      url: url,
      method: 'GET',
      header: { 'content-type': 'application/json'},
      success: function(res) {
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
      url: '../detail/index?id='+id
    })
  },
  bindSwiper: function(e){
    var link = e.currentTarget.id;
    // console.log(link)
    var events_id = parseInt(link.replace(/[^0-9]+\//ig, ""));
    wx.navigateTo({
      url: '../detail/index?id='+events_id
    })
  },
})