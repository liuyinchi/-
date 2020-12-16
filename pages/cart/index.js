// pages/cart/index.js
import { getSetting,chooseAddress,openSetting,showModal,showToast } from "../../utils/asyncWx.js";
//import regeneratorRuntime from '../../lib/runtime/runtime';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart:[],
    allChecked: false,
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

  //获取缓存中的购物车数据
  //把购物车数据 填充到data中

  //全选的实现  数据的展示
  // 根据购物车中的商品数据  所有的商品被选中  checked=true  全选就被选中

  //总价格 总数量
  //都需要商品被选中
  //1.判断商品被选中  选中就计算
  //2.获取购物车数组
  //3.遍历
  //4.判断商品是否被选中
  onShow: function () {
    //获取缓存中的收货地址信息
    const address=wx.getStorageSync('address');
    //获取缓存中的购物车数据
    const cart=wx.getStorageSync('cart')||[];
    //every 数组方法 会遍历  会接收一个回调函数 那么 每一个回调函数都返回true 那么every返回true
    //只要  有一个回调函数返回false 那么不再循环执行  直接返回false
    //空数组调用 every ，返回值就是true
    //const allChecked=cart.length?cart.every(v=>v.checked):false;
    //给data赋值
    this.setData({address});
    this.setCart(cart);
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
  //获取用户的收获地址
  //绑定点击事件
  //调用小程序内置api 获取用户的收获地址

  //2获取用户对小程序所授权获取地址的权限状态  scope
  //  1假设用户点击收货地址的提示框  确定  authSetting scope.address
  //  scope 值 true 直接调用获取收获地址

  //  假设用户从来没有调用过  收货地址的api
  //  scope值  undefined
  
  //  假设用户点击收获地址的提示框 取消
  //  scope值  false
  //  引导用户  自己打开授权页面  当用户重新给与 获取地址权限的时候  openSetting
  //  获取收货地址
  //  获取到的收获地址缓存到本地

  //页面加载完毕
  //获取本地存储中的地址数据
  //把数据 设置给data中的一个变量
  async handleChooseAddress(){
  //  wx.getSetting({
  //    withSubscriptions: true,
  //    success: (result) => {
  //      console.log(result);
  //      // 获取权限状态  主要发现一些属性名怪异的时候  打偶要使用[]形式
  //      const scopeAddress = result.authSetting["scope.address"];
  //      if(scopeAddress===true||scopeAddress===undefined){
  //       wx.chooseAddress({
  //         success: (result1) => {
  //           console.log(result1);
  //         },
  //       });
  //      }else{
  //       // 3 用户以前拒绝过授予权限  先诱导用户打开授权页面
  //       wx.openSetting({
  //         success: (result2) => {
  //           //可以直接调用收货收货地址
  //           wx.chooseAddress({
  //             success: (result3) => {
  //               console.log(result3);
  //             },
  //           });
  //         }
  //       })
  //      }
  //    }
  //  })
   
    try {
       //获取权限状态
      const res1= await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      //判断权限状态
      if(scopeAddress === false){
        await openSetting();
      }

      //调用收货地址的api
      let address = await chooseAddress();
      address.all = address.provinceName+address.cityName+address.countyName+address.detailInfo;
      //存到缓存中
      wx.setStorageSync('address', address);
    } catch (error) {
      console.log(error);
    }
  },
  //商品的选中
  handleItemChange(e){
    //1 获取被修改的商品的id
    const goods_id=e.currentTarget.dataset.id;
    // 2 获取购物车数组
    let {cart} = this.data;
    //3 找到被修改的商品对象
    let index=cart.findIndex(v=>v.goods_id===goods_id);
    //4 选中状态取反
    cart[index].checked=!cart[index].checked;
    //5 6 把购物车数据重新设置回data中和缓存中
    this.setCart(cart);
  },
  //设置购物车状态 同时重新计算 底部工具栏的数据 全选 总价格 购买的数量
  setCart(cart){
    let allChecked=true;
    let totalPrice=0;
    let totalNum=0;
    cart.forEach(v=>{
      if(v.checked){
        totalPrice+=v.num*v.goods_price;
        totalNum+=v.num;
      }else{
        allChecked=false;
      }
    })
    //判断数组是否为空
    allChecked=cart.length!=0?allChecked:false;
    this.setData({
      cart,totalPrice,totalNum,allChecked
    });
    wx.setStorageSync("cart",cart);
  },
  //商品的全选功能
  handleItemAllcheck(){
    //获取data中的数据
    let {cart,allChecked} = this.data;
    //修改值
    allChecked=!allChecked;
    //循环修改cart数组中的商品选中状态
    cart.forEach(v=>v.checked=allChecked);
    //把修改后的值  填充回data或者缓存中
    this.setCart(cart);
  },

  //商品数量的编辑
  //1."+""-"按钮 绑定同一个点击事件 区分的关键  自定义属性
  // "+" "+1"
  // "-" "-1"
  //传递被点击的商品id  goods_id
  //获取data中的购物车数组  来获取需要被修改的商品对象
  //当购物车的数量=1 同时 用户点击“-”
  //弹窗提示 (showModal) 询问用户  是否要删除
  // 1.确定  直接执行删除
  // 2.取消  什么都不做
  //直接修改商品对象的数量  num
  //把cart数组 重新设置回 缓存中  和data中  this.setCart
  //商品数量的编辑功能
  async handleItemNumEdit(e){
    
    //1 获取传递过来的参数
    const {operation,id} = e.currentTarget.dataset;

    console.log(e.currentTarget.dataset);
    //2.获取购物车数组
    let {cart}=this.data;
    //3.找到需要修改的商品的索引
    const index=cart.findIndex(v=>v.goods_id===id);

    if(cart[index].num===1&&operation===-1){
      //弹框提示
      const res=await showModal({content:"您是否要删除？"});

      if (res.confirm) {
        console.log(cart);
        cart.splice(index,1);
        console.log(cart);
        this.setCart(cart);
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }else{
      //4.进行修改数量
      cart[index].num+=operation;
      //5.设置回缓存和data中
      this.setCart(cart);
    }
  },
  //点击结算
  async handlePay(){
    //1.判断收货地址
    const {address,totalNum}=this.data;
    if(!address.userName){
      await showToast({title:"您还没有收货地址"});
      return;
    }
    //2. 判断用户有没选购商品
    if(totalNum===0){
      await showToast({title:"您还没有选购商品"});
      return;
    }
    //3.跳转到支付页面
    wx.navigateTo({
      url:'/pages/pay/index'
    });
  }
  
})