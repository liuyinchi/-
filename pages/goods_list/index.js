// pages/goods_list/index.js
//用户上滑数据 滚动条触底 开始加载下一页数据
//判断是否有下一页数据 
//1.获取总页数  只有总条数
//2.获取到当前的页码  Math.ceil(总条数/总页数)
//3.判断是否存在下一页数据
//4.有下一页数据 加载下一页数据  1.页码++  2.重新发送请求 3.数据请求回来要对data数组进行拼接

import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 2,
        value: "价格",
        isActive: false
      }
    ],
    goodsList:[]
  },
  //接口要的参数
  QueryParams:{
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 10
  },
  totalPages: 1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid=options.cid||'';
    this.QueryParams.query=options.query||'';
    this.getGoodsList();
  },
  //获取商品列表
  getGoodsList(){
    request({url:"/goods/search",data:this.QueryParams}).then(result => {
      const res = result.data.message;
      const total = result.data.message.total;
      this.totalPages = Math.ceil(total/this.QueryParams.pagesize);
      console.log(this.totalPages);
      this.setData({
        //拼接数组
        goodsList:[...this.data.goodsList,...res.goods]
      }) 

      //关闭下拉刷新
      wx.stopPullDownRefresh();
    })
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
   * 下拉刷新页面
    1.触发下拉刷新  需要在页面的json文件中开启配置项
      找到触发下拉刷新的事件
    2.重置数据数组
    3.重置页码  设置为1
    4.重新发送请求
    5.数据请求成功后关闭下拉刷新
   */
  onPullDownRefresh: function () {
    this.setData({goodsList:[]});
    this.QueryParams.pagenum = 1;
    this.getGoodsList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.QueryParams.pagenum>=this.totalPages){
      wx.showToast({
        title: '没有下一页数据了'
      })
    }else{
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  handleTabsItemChange(e){
    //获取被点击的标题索引
    const {index} = e.detail;
    let {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    //赋值到data中
    this.setData({
      tabs
    })
  }
})