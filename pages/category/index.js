import { request } from "../../request/index.js";
// pages/category/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //左侧的菜单数据
    leftMenuList: [],
    //右侧的菜单数据
    rightMenuList: [],
    //被点击的菜单
    currentIndex: 0,
    scrollTop: 0
  },
  cates: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //判断本地存储有没有旧的数据 没有旧数据直接发送请求 有旧数据判断是否过期
    //{time: Date.now(),data: [..]}
    const Cates=wx.getStorageSync('cates');
    if(!Cates){
      this.getCates();
    }else{
      //有旧的数据
      if(Date.now()-Cates.time>1000*10*600){
        this.getCates();
      }else{
        //使用旧数据
        console.log('可以使用旧的数据');
        this.Cates=Cates.data;

        let leftMenuList = this.Cates.map(v=>v.cat_name);
        let rightMenuList = this.Cates[0].children;
        this.setData({leftMenuList,rightMenuList});
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //获取分类数据
  getCates(){
    request({url:"/categories"}).then(result => {
      this.Cates = result.data.message;

      //把接口数据存入本地存储中
      wx.setStorageSync('cates', {time: Date.now(),data:this.Cates})
      
      let leftMenuList = this.Cates.map(v=>v.cat_name);
      let rightMenuList = this.Cates[0].children;
      this.setData({leftMenuList,rightMenuList});
    })
  },
  handleItemTap(e){
    //获取索引
    const {index} = e.currentTarget.dataset;
    let rightMenuList = this.Cates[index].children;

    this.setData({
      currentIndex : index,
      rightMenuList,
      
      //重新设置 右侧内容的scroll-view标签距离顶部的距离
      scrollTop: 0
    })
  }
})