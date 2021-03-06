//  var ojb = require('cityObject.js')
import {ojb} from 'cityObject'

//获取当前位置坐标
function getLocation(callback) {
  if(getApp().globalData.city==null){
  wx.getLocation({

    success: function (res) {
      console.log(res)
      callback(true, res.latitude, res.longitude);

    },
    fail: function () {

      callback(false);

    }

  })}

  else{
    console.log(getApp().globalData.city)
    // switch(getApp().globalData.city){
    //   case '天津':{
    //     callback(true, res.latitude, res.longitude);
    //   }

    //   case '北京':{

    //   }

    //   default:{

    //   }
    // }

    let longitude=null,latitude=null
    for(var i =0;i<ojb.length;i++ ){
      if (ojb[i].name + "市"  === getApp().globalData.city|| ojb[i].name === getApp().globalData.city){
          longitude=ojb[i].log
          latitude=ojb[i].lat
          console.log(ojb[i])
         
          callback(true, latitude, longitude);
          return
      }
    }
    callback(false);

    
   

  }

}

//Reverse Geocoding 根据经纬度获取城市名称
function getCityName(latitude, longitude, callback) {


//http://api.map.baidu.com/geocoder/v2/?callback=renderReverse&location=39.983424,116.322987&output=json&pois=1&ak=SxP2nSAYeRqFuN8N2APU9Ps54CKN5sb0

  // var apiURL = "http://api.map.baidu.com/geocoder?output=json&location=" + latitude + "," + longitude + "&key=SxP2nSAYeRqFuN8N2APU9Ps54CKN5sb0";
  var apiURL = "https://api.map.baidu.com/geocoder/v2/?callback=renderReverse&location=" + latitude + "," + longitude + "&output=json&pois=1&ak=EAK7dZeSc02DwTQdhj4jlNUSZPTrl7yM"

  wx.request({
    url: apiURL,
    success: function (res) {
      var str = res.data
      var reg = /{.*\}/
      var result
      if ((result = reg.exec(str)) != null) {
        result = JSON.parse(result)

      }
      callback(result["result"]["addressComponent"]["city"]);

    }
  });

}

//获取指定位置的天气信息
function getWeatherByLocation(latitude, longitude, callback) {

  var apiKey = "5929ecae08828fc3ee3f728d4bc5a9c9";
  // var apiURL = "https://api.darksky.net/forecast/" + apiKey + "/" + latitude + "," + longitude + "?lang=zh&units=ca";
  var apiURL = "https://www.52hanbao.top/1234"  ;
  wx.request({
    url: apiURL,
    data:{
      'latitude': latitude,
      'longitude':longitude
    },
    success: function (res) {

      var weatherData = parseWeatherData(res.data);
      getCityName(latitude, longitude, function (city) {
        weatherData.city = city;
        callback(weatherData);
        getApp().globalData.city = city;

      });

    }
  });

}

//解析天气数据
function parseWeatherData(data) {

  var weather = {};
  weather["current"] = data.currently;
  weather["daily"] = data.daily;
  weather["hourly"] = data.hourly;

  return weather;

}

//将时间戳格式化为日期
function formatDate(timestamp) {

  var date = new Date(timestamp * 1000);
  return date.getMonth() + 1 + "月" + date.getDate() + "日 " + formatWeekday(timestamp);

}

//将时间戳格式化为时间
function formatTime(timestamp) {

  var minute
  var date = new Date(timestamp * 1000);
  minute = date.getMinutes()
  if(date.getMinutes() < 10){
    minute = "0"+date.getMinutes().toString()
  }
  return date.getHours() + ":" + minute;

}
function formatTime_forhour(timestamp){
  var minute
  var date = new Date(timestamp * 1000);
  minute = date.getMinutes()
  if(date.getMinutes() < 10){
    minute = "0"+date.getMinutes().toString()
  }
  return date.getHours() +'时';

}

//中文形式的每周日期
function formatWeekday(timestamp) {

  var date = new Date(timestamp * 1000);
  var weekday = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  var index = date.getDay();

  return weekday[index];


}

//加载天气数据
function requestWeatherData(cb) {

  getLocation(function (success, latitude, longitude) {

    //如果 GPS 信息获取不成功， 设置一个默认坐标
    if (success == false) {
      wx.showToast({
        title: '获取地址失败',
      })  
      latitude = 39.90403;
      longitude = 116.407526;

    }

    //请求天气数据 API
    getWeatherByLocation(latitude, longitude, function (weatherData) {

      cb(weatherData);

    });

  });

}

function loadWeatherData(callback) {

  requestWeatherData(function (data) {

    //对原始数据做一些修整， 然后输出给前端
    var weatherData = {};
    weatherData = data;
    weatherData.current.formattedDate = formatDate(data.current.time);
    weatherData.current.formattedTime = formatTime(data.current.time);
    weatherData.current.temperature = parseInt(weatherData.current.temperature);
    
    var wantedDaily = [];
    for (var i = 1; i < weatherData.daily.data.length; i++) {

      var wantedDailyItem = weatherData.daily.data[i];
      var time = weatherData.daily.data[i].time;
      wantedDailyItem["weekday"] = formatWeekday(time);
      wantedDailyItem["temperatureMin"] = parseInt(weatherData.daily.data[i]["temperatureMin"])
      wantedDailyItem["temperatureMax"] = parseInt(weatherData.daily.data[i]["temperatureMax"])
      wantedDaily.push(wantedDailyItem);

    }

    for (var i = 1; i < weatherData.hourly.data.length; i++) {
      weatherData.hourly.data[i].formattedTime=formatTime_forhour(data.hourly.data[i].time);

    }

    weatherData.daily.data = wantedDaily;
    callback(weatherData);

  });

}
function DrawCanvas(){
  for(var i=0;i<7;i++){
    // var context = wx.createCanvasContext(i)
    // context.setStrokeStyle("#00ff00")
    // context.setLineWidth(5)
    // context.moveTo(50, 70);

    // context.lineTo(150, 150);
    
    // context.draw()
    var context = wx.createContext();
    // 设置描边颜色
    context.setStrokeStyle("#7cb5ec");
    // 设置线宽
    context.setLineWidth(4);

    context.moveTo(50, weather.daily.data[i].temperatureMin);
    context.lineTo(450, weather.daily.data[i].temperatureMax);
    // 对当前路径进行描边
    context.stroke();
    wx.drawCanvas({
      canvasId: i,
      actions: context.getActions()
        });
  }
}

module.exports = {

  loadWeatherData: loadWeatherData

}