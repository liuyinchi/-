// pages/goods_detail/index.js
import { request } from "../../request/index.js";

// 点击轮播图 预览大图
// 1.给轮播图绑定事件
// 2.调用小程序的api   previewImage

//点击 加入购物车
// 1先绑定点击事件
// 2获取缓存中的购物车数据  数组格式
// 3先判断  当前的商品是否已经存在于购物车里面
// 4已经存在 修改商品数据  执行购物车数量++  重新把购物车数组填充回缓存中
// 5不存在于购物车的数组中  直接给购物车数组添加一个新元素 带上购买数量属性
// 6弹出提示
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{},
    isCollect:false
  },
  GoodsInfo:{},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {goods_id} = options;
    console.log(goods_id);
    this.getGoodsDetail(goods_id);
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
  getGoodsDetail(goods_id){
    request({url:"/goods/detail",data:{goods_id}}).then(result => {
      const goodsObj = result.data.message;
      this.GoodsInfo = goodsObj;
      //判断缓存中的商品
      let collect=wx.getStorageSync("collect")||[];
      //判断当前商品是否被收藏
      let isCollect=collect.some(v=>v.goods_id === this.GoodsInfo.goods_id);
      this.setData({
        goodsObj:{
          goods_name: goodsObj.goods_name,
          goods_price: goodsObj.goods_price,
          //iphone部分手机  不识别webp图片格式
          //最好找后台 让他进行修改
          //临时自己改 确保后台存在 1.webp => 1.jpg
          goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g,'.jpg'),
          pics: goodsObj.pics
        },
        isCollect
      })
    });
  },
  handlePrewviewImage(e){
    //1 先构造要预览的图片数组
    const urls = this.GoodsInfo.pics.map(v=>v.pics_mid);
    //2 接受传递过来的图片url
    //const current=e.currentTarget.dataset.url;
    //2 接受传递过来的图片索引
    const index = e.currentTarget.dataset.index;
    wx.previewImage({
      //current
      current: urls[index], // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  handleCartAdd(){
    //获取缓存中的购物车数组
    let cart=wx.getStorageSync("cart")||[];
    //判断 商品对象给是否存在于购物车数组中
    let index=cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    if(index===-1){
      //不存在，第一次添加
      this.GoodsInfo.num=1;
      this.GoodsInfo.checked=true;
      cart.push(this.GoodsInfo);
    }else{
      //已经存在购物车数据 执行num++
      cart[index].num++;
    }
    // 把购物车重新添加回缓存中
    wx.setStorageSync("cart",cart);
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      //防止用户手抖
      mask: true
    })
  },
  handleCollect(){
    let isCollect=false;
    //获取缓存的商品收藏数组
    let collect=wx.getStorageSync("collect")||[];
    //判断商品是否被收藏过
    let index=collect.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);

    if(index!==-1){
      collect.splice(index,1);
      isCollect=false;
      wx.showToast({
        title: '取消成功',
        icon:'success',
        mask: true
      })
    }else{
      collect.push(this.GoodsInfo);
      isCollect=true;
      wx.showToast({
        title: '收藏成功',
        icon:'success',
        mask: true
      })
    }

    //把数组存到缓存中
    wx.setStorageSync('collect',collect);

    //修改data中得属性 isCollect
    this.setData({isCollect});
  }
})