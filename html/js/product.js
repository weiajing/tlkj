$(function(){
	var vm = new Vue({
		el:'#main',
		data:{
			sub1: 0,
			sub2: 0,
			nonepro: false,
			city: sessionStorage.getItem("getCity")?(sessionStorage.getItem("getCity").split('市').length>0?sessionStorage.getItem("getCity").split('市')[0]:sessionStorage.getItem("getCity")):'',
			bidStr: '',
			sort: '',
			cidStr: '',
			typelist: '',
			pageNo: 1,
			limit: 18,
			prolist: '',
			recomlist: '',
			readmore: false,
			ajaxmore: false
		},
		mounted:function(){
			var _this = this;
			var swiper = new Swiper('.i-wrap-fir .list', {
		        slidesPerView: 'auto'
		    });
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

	        //             		_this.gettype();
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

		                    		_this.gettype();
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

                		_this.gettype();
                	};
                });
			}

	        $(window).scroll(function() {
	        	if ($(document).height() - $(this).scrollTop() - $(this).height() < 80 && _this.readmore == true && _this.ajaxmore == true) {
	        		_this.pageNo = _this.pageNo + 1;
	        		_this.ajaxmore = false;
	        		_this.ajaxMore();
	        	};
	        });
		},
		methods:{
			subfir:function(){
				if (!this.sub1) {
					this.sub1 = 1;
					this.sub2 = 0;
				}else{
					this.sub1 = 0;
				};
			},
			subsec:function(){
				if (!this.sub2) {
					this.sub2 = 1;
					this.sub1 = 0;
				}else{
					this.sub2 = 0;
				};
			},
			gettype:function(){
				var _this = this;
				$.getJSON(ajaxAPI+'/api/v1/branch/getCategory.htm', function(res) {
					if (res.returnCode == 200) {
						_this.typelist = res.data;
						_this.viewAjax();
						_this.recomAjax();
                	};
				});
			},
			recomAjax:function(){
				var _this = this;
				$.getJSON(ajaxAPI+'/api/v1/branch/getRecommend.htm', {bidStr: this.bidStr}, function(res) {
					if (res.returnCode == 200) {
						_this.recomlist = res.data;
					};
				});
			},
			viewAjax:function(){
				var data = {
					bidStr: this.bidStr,
					sort: this.sort,
					cidStr: this.cidStr,
					pageNo: this.pageNo,
					limit: this.limit,
					dir: 'desc'
				}
				var _this = this;
				$.getJSON(ajaxAPI+'/api/v1/branch/getGoodsByParam.htm', data, function(res) {
					$.RMLOAD();
					if (res.returnCode == 200) {
						_this.prolist = res.data.list;
						if (res.data.count > 18*_this.pageNo && res.data.list.length == 18) {
							_this.readmore = true;
							_this.ajaxmore = true;
						}else{
							_this.readmore = false;
						}

						if (res.data.count == 0) {
							_this.nonepro = true;
						}else{
							_this.nonepro = false;
						}
                	};
				});
			},
			ajaxMore:function(){
				var data = {
					bidStr: this.bidStr,
					sort: this.sort,
					cidStr: this.cidStr,
					pageNo: this.pageNo,
					limit: this.limit,
					dir: 'desc'
				}
				var _this = this;
				$.getJSON(ajaxAPI+'/api/v1/branch/getGoodsByParam.htm', data, function(res) {
					$.RMLOAD();
					if (res.returnCode == 200) {
						_this.prolist = _this.prolist.concat(res.data.list);
						if (res.data.count > 18*_this.pageNo && res.data.list.length == 18) {
							_this.readmore = true;
							_this.ajaxmore = true;
						}else{
							_this.readmore = false;
						}
                	};
				});
			}
		}
	})
})