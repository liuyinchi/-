// pages/pay/index.js
import { getSetting,chooseAddress,openSetting,showModal,showToast,requestPayment } from "../../utils/asyncWx.js";
import { request } from "../../request/index.js"; 

//import regeneratorRuntime from '../../lib/runtime/runtime';

//微信支付
//1.企业账号
//2.企业账号的小程序中 必须 给开发者添加上白名单
// 一个appid 可以同时绑定多个开发者
// 这些开发者就可以共用这个appid  和 它的开发权限

//支付按钮
// 先判断缓存中又没有token
// 没有跳转到授权页面 进行获取token
// 有token
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart:[],
    totalPrice: 0,
    totalNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    //获取缓存中的收货地址信息
    const address=wx.getStorageSync('address');
    //获取缓存中的购物车数据
    let cart=wx.getStorageSync('cart')||[];
    //every 数组方法 会遍历  会接收一个回调函数 那么 每一个回调函数都返回true 那么every返回true
    //只要  有一个回调函数返回false 那么不再循环执行  直接返回false
    //空数组调用 every ，返回值就是true
    //const allChecked=cart.length?cart.every(v=>v.checked):false;
    //给data赋值

    //过滤后的购物车数组
    cart=cart.filter(v=>v.checked);
    let totalPrice=0;
    let totalNum=0;
    cart.forEach(v=>{
      totalPrice+=v.num*v.goods_price;
      totalNum+=v.num;
    })

    this.setData({
      cart,totalPrice,totalNum,address
    });
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
  
  //支付
  async handleOrderPay(){
    try {
      //1.判断缓存中有没有token
      const token=wx.getStorageSync("token");
      //2.判断
      if(!token){
        wx.navigateTo({
          url: '/pages/auth/index'
        })
        return;
      }

      //创建订单
      //准备 请求头参数
      //const header = {Authorization: token};
      //请求体参数 价格
      const order_price=this.data.totalPrice;
      //地址
      const consignee_addr = this.data.address.all;
      const cart = this.data.cart;
      let goods=[];
      cart.forEach(v=>goods.push({
        goods_id: v.goods_id,
        goods_number: v.num,
        goods_price: v.goods_price
      }))

      const orderParams ={order_price,consignee_addr,goods};

      console.log(orderParams);
      //4 准备发送请求
      const {order_number}=await request({url:"/my/orders/create",methed:"POST",data: orderParams});
      
      //准备  发起预支付接口
      const {pay}=await request({url:"/my/orders/req_unifiedorder",methed:"POST",data:{order_number}});

      //调起支付
      const res = await requestPayment(pay);

      //查询后台订单状态
      const result = await request({url:"/my/orders/chkOrder",methed:"POST",data:{order_number}});

      await showToast({title: "支付成功！"});

      //删除缓存中已经选中的商品
      let newCart=wx.getStorageSync(cart);
      newCart=newCart.filter(v=>!v.checked);
      wx.setStorageSync("cart", newCart);

      wx.navigateTo({url: '/pages/order/index'});
    } catch (error) {
      await showToast({title: "支付失败！"});
      console.log(error);
    }
    
  }
})