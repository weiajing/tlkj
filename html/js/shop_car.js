$(function(){
	var vm = new Vue({
		el:'#main',
		data:{
			editradius: 0,
			token: localStorage['yesToken'],
			city: sessionStorage.getItem("getCity")?(sessionStorage.getItem("getCity").split('市').length>0?sessionStorage.getItem("getCity").split('市')[0]:sessionStorage.getItem("getCity")):'',
			list: '',
			bidStr: '',
			totalprice: 0,
			checkall: false
		},
		mounted:function(){
			$.checkUser();
			$.ADDLOAD();
			this.viewAjax();

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
		},
		methods:{
			viewAjax:function(){
				var _this = this;
				$.getJSON(ajaxAPI+'/api/v1/userCart/restrict/getMyAllCart.htm', {token: this.token}, function(res) {
					$.RMLOAD();
					if (res.returnCode == 200) {
						_this.list = res.data;
						for (var i = 0; i < _this.list.length; i++) {
							_this.list[i].checked = false;
						};
					};
				});
			},
			add:function(index,max){
				var _this = this;
				if (_this.list[index].number < max) {
					_this.list[index].number++
				}else{
					_this.list[index].number = max
				}
			},
			cut:function(index,max){
				var _this = this;
				if (_this.list[index].number > 1) {
					_this.list[index].number--
				}else{
					_this.list[index].number = 1
				}
			},
			keyup:function(e,index,max){
				var _this = this;
				var val = $(e.currentTarget).val();
				if (val >= 1) {
					if (val > max) {
						$(e.currentTarget).val(max);
					};
				}else{
					$(e.currentTarget).val(1);
				}
				_this.list[index].number = $(e.currentTarget).val();
			},
			changeNum:function(){
				if (this.list.length <= 0) {
					return false;
				};
				var numArray = '';
				var _this = this;
				for (var i = 0; i < _this.list.length; i++) {
					numArray += (_this.list[i].oid + '-' + _this.list[i].number) + ',';
				};
				numArray = numArray.substring(0, numArray.length - 1);
				console.log(numArray)
				$.post(ajaxAPI+'/api/v1/userCart/restrict/updateCart.htm', {token: _this.token, param: numArray}, function(res) {
					if (res.returnCode == 200) {
						$.oppo("已修改",1.2,function(){
							_this.viewAjax();
						})
					};
				});
			},
			total:function(e,num){
				var _this = this;
				if (num == null || num == 'undefined') {
					if ($(e.currentTarget).is(':checked')) {
						_this.checkall = true;
					}else{
						_this.checkall = false;
					}
					if (_this.checkall) {
						for (var i = 0; i < _this.list.length; i++) {
							_this.list[i].checked = true;
						};
					}else{
						for (var i = 0; i < _this.list.length; i++) {
							_this.list[i].checked = false;
						};
					};
				}else{
					if ($(e.currentTarget).is(':checked')) {
						_this.list[num].checked = true;
					}else{
						_this.list[num].checked = false;
					}
				}
				_this.totalprice = 0;
				for (var i = 0; i < _this.list.length; i++) {
					if(_this.list[i].checked == true){
						_this.totalprice += parseFloat(_this.list[i].price*_this.list[i].number);
					};
				};
				_this.totalprice = _this.totalprice.toFixed(2);
			},
			deletepro:function(id){
				var _this = this;
				$.alert({
					title: '提示',
	                content: '确定删除此产品？',
	                cf: 1,
	                submit: function(){
						$.post(ajaxAPI+'/api/v1/userCart/restrict/delCart.htm', {token: _this.token, oidStr: id}, function(res) {
							if (res.returnCode == 200) {
								$.oppo("删除成功！",1.3,function(){
									_this.viewAjax();
								})
							};
						});
	                }
				});
			},
			deleteAll:function(){
				var _this = this;
				var oid = [];
				$.alert({
					title: '提示',
	                content: '确定删除已选中产品？',
	                cf: 1,
	                submit: function(){
	                	for (var i = 0; i < _this.list.length; i++) {
							if(_this.list[i].checked == true){
								oid.push(_this.list[i].oid);
							};
						};
						$.post(ajaxAPI+'/api/v1/userCart/restrict/delCart.htm', {token: _this.token, oidStr: oid}, function(res) {
							if (res.returnCode == 200) {
								$.oppo("删除成功！",1.3,function(){
									_this.viewAjax();
								})
							};
						});
	                }
				});
			},
			submit:function(){
				var _this = this;
				var cartIdStrs = '';
				for (var i = 0; i < _this.list.length; i++) {
					if(_this.list[i].checked == true){
						cartIdStrs += _this.list[i].oid + ','
					}
				};
				cartIdStrs = cartIdStrs.substring(0, cartIdStrs.length - 1);
				var sdata = {
					token: _this.token,
					branchIdStr: _this.bidStr,
					cartIdStrs: cartIdStrs
				}
				console.log(sdata)
				$.post(ajaxAPI+'/api/v1/order/restrict/addOrderByCart.htm', sdata, function(res) {
					if (res.returnCode == 200) {
						window.location.href = "pay.html?no="+res.data.no;
					};
				});
			}
		}
	})
})