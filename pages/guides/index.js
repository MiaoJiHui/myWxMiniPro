// pages/guides/index.js
var app = getApp();
Page({
  data: {
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 500,
    guidesUrl: "https://api.thatsmags.com/archive/list.html?&cat_id=guides&city_id=",
  },
  onLoad: function(){
    wx.showToast({
      title: 'Loading',
      icon: 'loading',
      duration: 1500
    })
    var that = this;
    var city_id = app.globalData.cityId;
    var url = that.data.guidesUrl + city_id;
    wx.request({
      url: url,
      method: 'GET',
      header: { 'content-type': 'application/json'},
      success: function(res) {

        // console.log(res.data.body.data_slide);
        that.setData({
          // dataList: that.data.dataList.concat(res.data.body.data_list),
          dataSlide: res.data.body.data_slide,
          rootCat: res.data.body.root_cat
        });
        wx.hideToast();
      }
    })
  },
  bindSwiper: function(e) {
    // console.log(e)
    var link = e.currentTarget.id;
    // console.log(link)
    var id = parseInt(link.replace(/[^0-9]+\//ig, ""))
    // console.log(id);
     wx.navigateTo({
      url: '../detail/index?id=' + id
    })
  },
  bindItemTap: function(e) {
    // console.log(e)
    var id = e.currentTarget.id;
    // console.log("id:"+id);
    wx.navigateTo({
      url: '../guides/index_detail?id=' + id
    })
  }
})