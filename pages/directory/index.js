//获取应用实例
var app = getApp();

Page({
  data: {
    dataList: [],
    dataSlide: [],
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 500,
    directoryUrl: 'https://api.thatsmags.com/venue/list.html?&limit=10&city_id=',
    searchUrl: 'https://api.thatsmags.com/archive/search.html?cat_id=venue&k=',
    page: 1,
    cityId: 1
  },
  onLoad: function(){
    wx.showToast({
      title: 'Loading',
      icon: 'loading',
      duration: 1500
    });
    var that = this;
    var city_id = app.globalData.cityId;
    // console.log(app);
    // console.log(city_id);
    var url = that.data.directoryUrl + city_id;
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
      }
    })

  },
 
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
    var url = that.data.directoryUrl + city_id + "&page=" + page;
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
      url: '../directory/directory_detail?id='+id
    })
  },
  bindSwiper: function(e){
    var link = e.currentTarget.id;
    // console.log(link)
    var directory_id = parseInt(link.replace(/[^0-9]+\//ig, ""));
    // console.log(directory_id)
    wx.navigateTo({
      url: '../directory/directory_detail?id='+directory_id
    })
  },
  inputBlur: function(e){
    wx.showToast({
      title: 'Loading',
      icon: 'loading',
      duration: 1000
    });
    wx.showNavigationBarLoading();
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
        wx.hideNavigationBarLoading();
        that.setData({
          dataList: res.data.body.data_list
        });
        wx.hideToast();
      }
    });
  },
  onReady: function(){
    wx.hideToast();
  }
})