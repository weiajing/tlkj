$(function(){
	var vm = new Vue({
		el:'#main',
		data:{
			URL: window._url,
			sharealert: false,
			token: localStorage['yesToken'],
			branchGoodsIdStr: $.getUrlParam('id'),
			info: '',
			numberStr: 1,
			flgStr: 0,
			tel: '',
			timeStr: '',
			linkid: '',
			bl: true
		},
		mounted:function(){
			$.checkUser();
			$.ADDLOAD();
			var _this = this;
			this.init();
		},
		methods:{
			init:function(){
				var sdata = {
					token: this.token,
					branchGoodsIdStr: this.branchGoodsIdStr
				};

				var _this = this;
				$.getJSON(ajaxAPI+'/api/v1/giveAway/restrict/toGiveAwayPage.htm', sdata, function(res) {
					$.RMLOAD();
					if (res.returnCode == 200) {
						_this.info = res.data;
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
			allnum:function(){
				this.numberStr = this.info.number;
				this.flgStr = 1;
			},
			keyup:function(){
				if (this.numberStr >= this.info.number) {
					this.numberStr = this.info.number;
					this.flgStr = 1;
				}else{
					this.flgStr = 0;
				}
			},
			submit:function(){
				if (!this.tel) {
					$.oppo("请输入赠送对象手机号");
					return false;
				};
				var num = /^\d*$/; //全数字
                if(!num.exec(this.tel) || this.tel.length != 11) {
                    $.oppo("手机号格式不对");
                    return false;
                };
				if (!this.numberStr) {
					$.oppo("请输入赠送数量");
					return false;
				};
				if (!this.timeStr) {
					$.oppo("请输入有效时间");
					return false;
				};
				if (this.bl == false) {
					return false;
				};
				this.ViewAjax();
			},
			ViewAjax:function(){
				$.ADDLOAD();
				var t = this;
				this.bl = false;
				var sdata = {
					token: this.token,
					branchGoodsIdStr: this.branchGoodsIdStr,
					numberStr: this.numberStr,
					flgStr: this.flgStr,
					tel: this.tel,
					timeStr: this.timeStr
				};
				var sharetitle = '您好，赠送给您刮刮卡，有可能会中奖哦';
				var desc = '这里是刮刮乐，有丰富的大奖等你拿';
				$.post(ajaxAPI+'/api/v1/giveAway/restrict/addSingleGiveAway.htm', sdata, function(res) {
					$.RMLOAD();
					t.bl = true;
					if (res.returnCode == 200) {
						t.sharealert = true;
						t.linkid = res.data;

						var sharelink = t.URL+'login.html?oid='+t.linkid;

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
			}
		}
	})
})