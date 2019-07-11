$(function(){
	var vm = new Vue({
		el:'#main',
		data:{
			buyhand: 0,
			carhand: 0,
			city: sessionStorage.getItem("getCity")?(sessionStorage.getItem("getCity").split('市').length>0?sessionStorage.getItem("getCity").split('市')[0]:sessionStorage.getItem("getCity")):'',
			bidStr: '',
			gidStr: $.getUrlParam('id'),
			info: '',
			numberStr: 1,
			branchGoodsIdStr: '',
			token: localStorage['yesToken'],
			confirmbl : true
		},
		mounted:function(){
			var _this = this;
			
		    if (!this.gidStr) {
		    	$.oppo("产品ID不正确",1.3,function(){
		    		window.location.href = window.URL + 'index.html'
		    	})
		    };
		    $.ADDLOAD();
		    //获取用户所在城市信息
	        //实例化城市查询类
	        // var citysearch = new AMap.CitySearch();
	        // //自动获取用户IP，返回当前城市
	        // citysearch.getLocalCity(function(status, result) {
	        //     if (status === 'complete' && result.info === 'OK') {
	        //         if (result && result.city && result.bounds) {
	        //             var cityinfo = result.city;
	        //             _this.city = cityinfo.split('市').length>0?cityinfo.split('市')[0]:cityinfo;

	        //             $.post(ajaxAPI+'/api/v1/branch/cityNameConversionsBranchId.htm', {cityName: _this.city+'市'}, function(res) {
	        //             	if (res.returnCode == 200) {
	        //             		_this.bidStr = res.data;

	        //             		_this.viewAjax();
	        //             	};
	        //             });
	        //         }
	        //     }
	        // });
	
			if (!sessionStorage.getItem("getCity")) {
				// 百度地图API功能
				var map = new BMap.Map("allmap");

				var geolocation = new BMap.Geolocation();
				geolocation.getCurrentPosition(function(r){
					if(this.getStatus() == BMAP_STATUS_SUCCESS){
						
							var cityinfo = r.address.city;

							_this.city = cityinfo.split('市').length>0?cityinfo.split('市')[0]:cityinfo;
							
							sessionStorage.setItem("getCity", _this.city);
							
							$.post(ajaxAPI+'/api/v1/branch/cityNameConversionsBranchId.htm', {cityName: _this.city+'市'}, function(res) {
		                    	if (res.returnCode == 200) {
		                    		_this.bidStr = res.data;

		                    		_this.viewAjax();
		                    	};
		                    });
					}
					else {
						alert('failed'+this.getStatus());
					}        
				},{enableHighAccuracy: true})
			}else{
				$.post(ajaxAPI+'/api/v1/branch/cityNameConversionsBranchId.htm', {cityName: _this.city+'市'}, function(res) {
                	if (res.returnCode == 200) {
                		_this.bidStr = res.data;

                		_this.viewAjax();
                	};
                });
			}
		},
		methods:{
			viewAjax:function(){
				var _this = this;
				$.getJSON(ajaxAPI+'/api/v1/branch/getGoodsDetail.htm', {bidStr: this.bidStr, gidStr: this.gidStr, token: this.token}, function(res) {
					$.RMLOAD();
					if (res.returnCode == 200) {
						_this.info = res.data;
						if (res.data.stock == 0) {
							_this.numberStr = 0;
						};
						_this.branchGoodsIdStr = res.data.oid;

						vm.$nextTick(function () {
							var swiper = new Swiper('.ban-wrap', {
						        pagination : '.pagination',
						        slidesPerView: 1,
						        loop : true,
						        paginationClickable : true,
						        autoplay : 3000
						    });
						});
					};
				});
			},
			add:function(){
				var _this = this;
				_this.numberStr++;
				if (_this.numberStr > _this.info.stock) {
					_this.numberStr = _this.info.stock;
				};
			},
			cut:function(){
				var _this = this;
				_this.numberStr--;
				if (this.numberStr < 1 && _this.info.stock > 0) {
					_this.numberStr = 1;
				};
				if (this.numberStr < 1 && _this.info.stock == 0) {
					_this.numberStr = 0;
				};
			},
			keyup:function(){
				var _this = this;
				if (this.numberStr > 0) {
					if (_this.numberStr > _this.info.stock) {
						_this.numberStr = _this.info.stock;
					};
				}else{
					_this.numberStr = 1;
				}
			},
			confirm:function(){

				$.checkUser();
				var data = {
					token: this.token,
					branchIdStr: this.bidStr,
					branchGoodsIdStr: this.branchGoodsIdStr,
					numberStr: this.numberStr
				}
				if (this.confirmbl == false) {
					return false;
				};
				var _this = this;
				if (_this.numberStr > _this.info.stock && this.numberStr > 0) {
					$.oppo("产品库存不足");
					return false;
				};
				if (this.numberStr == 0) {
					$.oppo("数量为零不能购买哦");
					return false;
				};
				this.confirmbl = false;
				if (this.buyhand == 1) {
					$.getJSON(ajaxAPI+'/api/v1/order/restrict/addMyOrderByBuy.htm', data, function(res) {
						_this.confirmbl = true;
						if (res.returnCode == 200) {
							window.location.href = "pay.html?no="+res.data.no;
						};
					});
				}else if (this.carhand == 1) {
					$.getJSON(ajaxAPI+'/api/v1/userCart/restrict/addCart.htm', data, function(res) {
						_this.confirmbl = true;
						if (res.returnCode == 200) {
							$.oppo("成功加入购物车！",1.3);
							_this.info.number = parseInt(_this.info.number + parseFloat(_this.numberStr));
							_this.buyhand = 0;
							_this.carhand = 0;
						};
					});
				}
			}
		}
	})
})