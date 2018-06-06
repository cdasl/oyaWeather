var util = require('../../utils/util.js')

Page({

  data: {
    weather: {}, 
    bgColor: ""
  },
  onShow: function () {
    wx.showLoading({
      title: '请稍等',
    })

    var that = this;
    that.setData({
      bgColor: "../../images/bg.jpg"
    })
    util.loadWeatherData(function (data) {

      console.log(data);
      that.setData({
        weather: data
      });
      // that.data.weather = data;
    wx.hideLoading()
    });
    

  },

  selectCity: function (e) {
    wx.navigateTo({
      url: '../citySelect/cs'
    })
  }
  

})