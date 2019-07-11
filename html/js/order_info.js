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
			pid: '',
			info: '',
			canvasShow: false,
			raffleing: false,
			getnumAlert: false,
			linkid: '',
			result: '',
			netStatus: 1,
			getbl: true,
			imgshow: false,
			imgshowindex: 2,
			img1: '',
			img2: ''
		},
		mounted:function(){
			$.checkUser();
			$.ADDLOAD();
			var _this = this;

			//获取用户所在城市信息
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

			$('.order-info').css('min-height', $(window).height());
		},
		methods:{
			viewAjax:function(){
				var _this = this;
				$.getJSON(ajaxAPI+'/api/v1/order/restrict/orderDetail.htm', {token: this.token, oidStr: this.oidStr}, function(res) {
					$.RMLOAD();
					if (res.returnCode == 200) {
						_this.info = res.data;
						_this.pid = res.data.gid;
						
						if (res.data.stat == 3){
							_this.imgshow = true;
							_this.img1 = res.data.picurl1;
							_this.img2 = res.data.picurl2;
						};
						if (res.data.giveAway == 1) {
	                        var time = res.data.time;
							var myTime = setInterval(function(){
								time --;
	                            if (time <= 0) {
	                                $(".times-down").text("已领取完。")
	                            }else{
	                                $(".times-down").text("领取时间还剩"+parseInt(time/60/60)+"时"+parseInt(time/60%60)+"分"+parseInt(time%60)+"秒。");
	                            }
	                        } , 1000);
						};
					};
				});

				var timestamp = '';
				var noncestr = '';
				var signa = '';
				var ticket = '';
				$.getJSON(ajaxAPI+'/api/v1/user/restrict/getAccessToken.htm', {token: _this.token, url: window.location.href}, function(res) {
					if (res.returnCode == 200) {
						ticket = res.data.ticket;
						noncestr = res.data.noncestr;
						timestamp = res.data.timestamp;
						signa = res.data.signature;
						console.log(signa)
						wx.config({
						    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
						    appId: 'wx25553aa919475038', // 必填，公众号的唯一标识
						    timestamp: timestamp, // 必填，生成签名的时间戳
						    nonceStr: noncestr, // 必填，生成签名的随机串
						    signature: signa,// 必填，签名，见附录1
						    jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo','onMenuShareQZone'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
						});
						wx.ready(function(){

						});
						wx.error(function(res){

						});
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
				var _this = this;
				this.canvasShow = true;
				this.raffleing = true;
				this.getbl = true;
				// $.ADDLOAD();
				setTimeout(function(){
					canvasBegin(type);
				},100);
			},
			getResults:function(){
				var _this = this;
				$.getJSON(ajaxAPI+'/api/v1/order/restrict/getResults.htm', {token: _this.token, oidStr: _this.oidStr}, function(res) {
					if (res.returnCode == 200) {
						if (res.data.stat == 0) {
							setTimeout(function(){
								_this.getResults();
							},2000);
						}else if (res.data.stat == 1) {

							$.oppo(res.msg,1.5,function(){
								window.location.reload();
							});

						}else if (res.data.stat == 3){

							_this.raffleing = false;
							_this.result = res.data;
							_this.info.stat = 3;
							_this.info.bonus = res.data.bonus;
							_this.imgshow = true;
							_this.img1 = res.data.picurl1;
							_this.img2 = res.data.picurl2;

						}else if (res.data.stat == 4){

							_this.raffleing = false;
							_this.result = res.data;
							_this.info.stat = 4;
							_this.info.bonus = '';
							
						}
					};
				});
			},
			shareView1:function(){
				$.ADDLOAD();
				var sharetitle = '分享给您刮奖';
				var desc = '来来来，帮我刮下刮刮卡';
				var _this = this;
				$.post(ajaxAPI+'/api/v1/order/restrict/sharing.htm', {token: this.token, oidStr: this.oidStr}, function(res) {
					$.RMLOAD();
					if (res.returnCode == 200) {
						_this.linkid = _this.oidStr;
						var sharelink = _this.URL+'share_info.html?oid='+_this.linkid+'&pid='+_this.pid+'&type=1';
						_this.sharealert = true;

						wx.onMenuShareTimeline({
						    title: sharetitle, // 分享标题
						    link: sharelink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
						    imgUrl: _this.URL+'img/ico_31.png', // 分享图标
						    success: function () {
							    // 用户确认分享后执行的回调函数
							},
							cancel: function () {
						    // 用户取消分享后执行的回调函数
						    	
						    }
						});
						wx.onMenuShareAppMessage({
							title: sharetitle, // 分享标题
							desc: desc, // 分享描述
							link: sharelink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
							imgUrl: _this.URL+'img/ico_31.png', // 分享图标
							type: '', // 分享类型,music、video或link，不填默认为link
							dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
							success: function () {
								// 用户确认分享后执行的回调函数
							},
							cancel: function () {
								// 用户取消分享后执行的回调函数
							}
						});
						wx.onMenuShareQQ({
							title: sharetitle, // 分享标题
							desc: desc, // 分享描述
							link: sharelink, // 分享链接
							imgUrl: _this.URL+'img/ico_31.png', // 分享图标
							success: function () {
								// 用户确认分享后执行的回调函数
							},
							cancel: function () {
								// 用户取消分享后执行的回调函数
							}
						});
						wx.onMenuShareQZone({
							title: sharetitle, // 分享标题
							desc: desc, // 分享描述
							link: sharelink, // 分享链接
							imgUrl: _this.URL+'img/ico_31.png', // 分享图标
							success: function () {
							// 用户确认分享后执行的回调函数
							},
							cancel: function () {
							// 用户取消分享后执行的回调函数
							}
						});
					};
				});
			},
			shareView2:function(){
				var sharetitle = '我中奖啦！分享给你看看';
				var desc = '这个刮奖挺好玩的，你可以来看看';
				var _this = this;
				_this.linkid = _this.oidStr;
				var sharelink = _this.URL+'share_info.html?oid='+_this.linkid+'&pid='+_this.pid+'&type=2';
				_this.sharealert = true;

				wx.onMenuShareTimeline({
				    title: sharetitle, // 分享标题
				    link: sharelink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
				    imgUrl: _this.URL+'img/ico_31.png', // 分享图标
				    success: function () {
					    // 用户确认分享后执行的回调函数
					},
					cancel: function () {
				    // 用户取消分享后执行的回调函数
				    	
				    }
				});
				wx.onMenuShareAppMessage({
					title: sharetitle, // 分享标题
					desc: desc, // 分享描述
					link: sharelink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
					imgUrl: _this.URL+'img/ico_31.png', // 分享图标
					type: '', // 分享类型,music、video或link，不填默认为link
					dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
					success: function () {
						// 用户确认分享后执行的回调函数
					},
					cancel: function () {
						// 用户取消分享后执行的回调函数
					}
				});
				wx.onMenuShareQQ({
					title: sharetitle, // 分享标题
					desc: desc, // 分享描述
					link: sharelink, // 分享链接
					imgUrl: _this.URL+'img/ico_31.png', // 分享图标
					success: function () {
						// 用户确认分享后执行的回调函数
					},
					cancel: function () {
						// 用户取消分享后执行的回调函数
					}
				});
				wx.onMenuShareQZone({
					title: sharetitle, // 分享标题
					desc: desc, // 分享描述
					link: sharelink, // 分享链接
					imgUrl: _this.URL+'img/ico_31.png', // 分享图标
					success: function () {
					// 用户确认分享后执行的回调函数
					},
					cancel: function () {
					// 用户取消分享后执行的回调函数
					}
				});
			},
			shareAjax:function(type){
				
			}
		}
	})
})