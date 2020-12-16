import { request } from "../../request/index.js";

Page({
  data: {
    //轮播图数组
    swiperList: [],
    cateList: [],
    floorList: []
  },
  onLoad: function(options){
    //发送异步请求 
    // wx-wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result) => {
    //     this.setData({
    //       swiperList: result.data.message
    //     })
    //     console.log(result.data.message);
    //   },
    // })
    this.getSwiperList();
    this.getCateList();
    this.getFloorList();
  },
  onReady: function(options){

  },
  onShow: function(){

  },
  onHide: function(){

  },
  onUnload: function(){

  },
  onPullDownRefresh: function(){

  },
  onReachBottom: function(){

  },
  onShareAppMessage: function(){

  },
  onPageScroll: function(){

  },
  onTabItemTao: function(item){

  },
  //获取轮播图数据
  getSwiperList(){
    request({url:"/home/swiperdata"}).then(result => {
      const res = result.data.message;
      //网址处理
      res.forEach((v,i)=>{res[i].navigator_url=v.navigator_url.replace('main', 'index');});

      this.setData({
        swiperList: res
      })
    })
  },
  //获取分类数据
  getCateList(){
    request({url:"/home/catitems"}).then(result => {
      const res = result.data.message;

      this.setData({
        cateList: res
      })
    })
  },
  //获取楼层数据
  getFloorList(){
    request({url:"/home/floordata"}).then(result => {
      const res = result.data.message

      for (let k = 0; k < res.length; k++) {
        res[k].product_list.forEach((v, i) => {
          res[k].product_list[i].navigator_url = v.navigator_url.replace('?', '/index?');
        });
      }
      this.setData({
        floorList: res
      })
    })
  }
});