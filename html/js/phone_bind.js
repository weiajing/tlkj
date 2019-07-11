$(function(){
	var vm = new Vue({
		el:'#main',
		data:{
			token: localStorage['yesToken'],
			tel: '',
			code: '',
			call: ''
		},
		mounted:function(){
			$.checkUser();
			$.ADDLOAD();
			this.viewAjax();
		},
		methods:{
			submit: function(){
				if (!this.tel) {
					$.oppo("请输入手机号码");
					return false;
				};
				var num = /^\d*$/; //全数字
                if(!num.exec(this.tel) || this.tel.length != 11) {
                    $.oppo("手机号格式不对");
                    return false;
                };
				if (!this.code) {
					$.oppo("请输入验证码");
					return false;
				};
				var sdata = {
					token: this.token,
					tel: this.tel,
					code: this.code
				};
				$.post(ajaxAPI+'/api/v1/user/restrict/bindingTel.htm', sdata, function(res) {
					if (res.returnCode == 200) {
						$.oppo('手机绑定成功', 1.3, function () {
							window.location.href = "account.html";
						});
					};
				});
			},
			viewAjax:function(){
				var _this = this;
				$.getJSON(ajaxAPI+'/api/v1/user/customerService.htm', function(res) {
					$.RMLOAD();
					if (res.returnCode == 200) {
						_this.call = res.data;
					};
				});
			}
		}
	})
})