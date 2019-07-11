var vm
$(function(){
	vm = new Vue({
		el:'#main',
		data:{
			URL: window._url,
			sharealert: false,
			token: localStorage['yesToken'],
			city: sessionStorage.getItem("getCity")?(sessionStorage.getItem("getCity").split('市').length>0?sessionStorage.getItem("getCity").split('市')[0]:sessionStorage.getItem("getCity")):'',
			oidStr: $.getUrlParam('id'),
			bidStr: '',
			info: '',
			canvasShow: false,
			getnumAlert: false,
			linkid: ''
		},
		mounted:function(){
			$.checkUser();
			$.ADDLOAD();
			var _this = this;
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
                	};
                });
			}

			this.viewAjax();
		},
		methods:{
			viewAjax:function(){
				var _this = this;
				$.getJSON(ajaxAPI+'/api/v1/giveAway/restrict/giveAwayDetail.htm', {token: this.token, oidStr: this.oidStr}, function(res) {
					$.RMLOAD();
					if (res.returnCode == 200) {
						_this.info = res.data;

						if (res.data.stat == 1) {
	                        var time = res.data.time;
							var myTime = setInterval(function(){
								time --;
	                            if (time <= 0) {
	                                $(".times-down").text("已领取完。")
	                            }else{
	                                $(".times-down").text("领取时间还剩"+parseInt(time/60/60)+"时"+parseInt(time/60%60)+"分"+parseInt(time%60)+"秒。");
	                            };
	                        } , 1000);
						};
					};
				});
			},
			buyAgain:function(){
				var sdata = {
					token: this.token,
					branchIdStr: this.bidStr,
					branchGoodsIdStr: this.info.branchGoodsId,
					numberStr: 1
				};
				$.post(ajaxAPI+'/api/v1/order/restrict/addMyOrderByBuy.htm', sdata, function(res) {
					if (res.returnCode == 200) {
						window.location.href = "pay.html?no="+res.data.no;
					};
				});
			},
			getscratch:function(type){
				this.canvasShow = true;
				$.ADDLOAD();
				var sdata = {
					token: this.token,
					oidStr: this.info.oid,
					typeStr: type
				}
				$.post(ajaxAPI+'/api/v1/order/restrict/raffle.htm', sdata, function(res) {
					$.RMLOAD();
					if (res.returnCode == 200) {
						
						canvasBegin();
					};
				});
			},
			shareView:function(){
				var _this = this;
				$.ADDLOAD();
				$.post(ajaxAPI+'/api/v1/order/restrict/sharing.htm', {token: this.token, oidStr: this.oidStr}, function(res) {
					$.RMLOAD();
					if (res.returnCode == 200) {
						_this.linkid = _this.oidStr;
						_this.sharealert = true;
					};
				});
			}
		}
	})
})