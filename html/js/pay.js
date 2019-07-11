$(function(){
	var vm = new Vue({
		el:'#main',
		data:{
			token: localStorage['yesToken'],
			no: $.getUrlParam('no'),
			info: '',
			isWeixin: $.is_weixin(),
			codeimg: ''
		},
		mounted:function(){
			$.checkUser();
			if (!this.no) {
				$.oppo("订单数据有误",1.3,function(){
					window.location.href = 'index.html';
				})
				return false;
			};
			$.ADDLOAD();
			this.viewAjax();
		},
		methods:{
			viewAjax:function(){
				var sdata = {
					token: this.token,
					no: this.no
				};
				var _this = this;
				$.getJSON(ajaxAPI+'/api/v1/order/restrict/getOrderByNo.htm', sdata, function(res) {
					if (res.returnCode == 200) {
						_this.info = res.data;

						_this.getCode();
					};
				});
			},
			pay:function(){
				var _this = this;
				$.ADDLOAD();
				$.post(ajaxAPI+'/api/v1/order/restrict/pay.htm', {token: this.token, no: this.no}, function(res) {
					$.RMLOAD();
					if (res.returnCode == 200) {
						// window.location.href = 'order.html?stat=1';
						window.location.href = res.data;
					};
				});
			},
			getCode:function(){
				var title = '';
				$.post(ajaxAPI+'/api/v1/order/restrict/pay.htm', {token: this.token, no: this.no}, function(res) {
					$.RMLOAD();
					if (res.returnCode == 200) {
						var qrcode = new QRCode(document.getElementById("code"), {
			                width : 125,//设置宽高
			                height : 125
			            });
			            qrcode.makeCode(res.data);
					};
				});
				// for (var i = 0; i < this.info.list.length; i++) {
				// 	title += this.info.list[i].gname + ','
				// };
				// title = title.substring(0,title.length-1);
				// var sdata = {
				// 	out_trade_no: this.no,
				// 	total_fee: this.info.sum,
				// 	subject: title,
				// 	token: this.token
				// };
				// var _this = this;
				// $.getJSON(ajaxAPI+'/web/pay/wechat/restrict/pay.htm', sdata, function(res) {
				// 	$.RMLOAD();
				// 	if (res.returnCode == 200) {
				// 		_this.codeimg = res.data;
				// 	};
				// });
			}
		}
	})
})