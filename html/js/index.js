$(function(){
	var vm = new Vue({
		el:'#main',
		data:{
			banlist: [],
			city: sessionStorage.getItem("getCity")?(sessionStorage.getItem("getCity").split('市').length>0?sessionStorage.getItem("getCity").split('市')[0]:sessionStorage.getItem("getCity")):'',
			hotpro: [],
			recompro: []
		},
		mounted:function(){
			var _this = this;
		    $.ADDLOAD();
		    this.banner();
		    //获取用户所在城市信息
	        //实例化城市查询类
	        // var citysearch = new AMap.CitySearch();
	        // //自动获取用户IP，返回当前城市
	        // citysearch.getLocalCity(function(status, result) {
	        //     if (status === 'complete' && result.info === 'OK') {
	        //         if (result && result.city && result.bounds) {
	        //             var cityinfo = result.city;
	        //             _this.city = cityinfo.split('市').length>0?cityinfo.split('市')[0]:cityinfo;

	        //             _this.viewAjax();
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

								_this.viewAjax();
					}
					else {
						alert('failed'+this.getStatus());
					}        
				},{enableHighAccuracy: true});
			}else{
				_this.viewAjax();
			}
		},
		methods:{
			banner:function(){
				var _this = this;
				$.getJSON(ajaxAPI+'/api/v1/branch/getBanner.htm', function(res) {
					if (res.returnCode == 200) {
						_this.banlist = res.data;

						vm.$nextTick(function () {
							var swiper = new Swiper('.i-ban', {
						        pagination : '.pagination',
						        slidesPerView: 'auto',
						        loop : true,
						        paginationClickable : true,
						        autoplay : 5000
						    });
						});

					};
				});
			},
			viewAjax: function(){
				var _this = this;
				$.post(ajaxAPI+'/api/v1/branch/getHot.htm', {cityName: this.city+'市'}, function(res) {
					if (res.returnCode == 200) {
						_this.hotpro = res.data;

						vm.$nextTick(function () {
							var swiper = new Swiper('.i-wrap-fir .list', {
						        slidesPerView: 'auto'
						    });
						});
						
					};
				});
				$.post(ajaxAPI+'/api/v1/branch/getAll.htm', {cityName: this.city+'市'}, function(res) {
					$.RMLOAD();
					if (res.returnCode == 200) {
						_this.recompro = res.data;
					};
				});
			}
		}
	})
})