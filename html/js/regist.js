$(function(){
	var vm = new Vue({
		el:'#main',
		data:{
			URL: window._url,
			tel: '',
			password: '',
			rpassword: '',
			code: '',
			nickName: '',
			oidStr: ($.getUrlParam("oidStr")?$.getUrlParam("oidStr"):''),
            from:$.getUrlParam('from'),
			call: '',
			bl: true
		},
		mounted:function(){
			$.ADDLOAD();
			this.callAjax();
		},
		methods:{
			submit: function(){
				console.log(this.URL)
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
					$.oppo("请输入短信验证码");
					return false;
				};
				if (!this.nickName) {
					$.oppo("请输入用户名");
					return false;
				};
				if (!this.password) {
					$.oppo("请输入密码");
					return false;
				};
				if (!this.rpassword) {
					$.oppo("请输入确认密码");
					return false;
				};
				if (this.bl == false) {
					return false;
				};
				this.viewAjax();
			},
			viewAjax: function(){
				$.ADDLOAD();
				var t = this;
				this.bl = false;
				var data = {
					tel: this.tel,
					code: this.code,
					nickName: this.nickName,
					password: this.password,
					rpassword: this.rpassword,
					oidStr: this.oidStr
				};
				$.post(ajaxAPI+'/api/v1/user/registre.htm', data, function(res) {
					$.RMLOAD();
					t.bl = true;
					if (res.returnCode == 200) {
						$.putToken(res);
						$.oppo('注册成功', 1.3, function () {
                            if(t.from){
                                window.location.href = $.base64decode(t.from)
                            }else {
                                window.location.href = t.URL + "member.html";
                            }
                        })
					};
				});
			},
			sendcode:function(){
				if (!this.tel) {
					$.oppo("请输入手机号码");
					return false;
				};
				var num = /^\d*$/; //全数字
                if(!num.exec(this.tel) || this.tel.length != 11) {
                    $.oppo("手机号格式不对");
                    return false;
                };
				var el = $('.send-code');
                if(el.hasClass('on')){
                    return false;
                }

                $.ADDLOAD();
                $.post(ajaxAPI+'/api/authcode/getAuthCodeHtm.htm', {mobileTel: this.tel, path: '1001'}, function(res) {
					$.RMLOAD();
                	if (res.returnCode == 200) {
                		$.oppo("验证码发送成功",1.3,function(){

	                		el.addClass('on');

							$.CountDown(el);
                		})
                	};
                });
			},
			callAjax:function(){
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