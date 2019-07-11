$(function(){
	var vm = new Vue({
		el:'#main',
		data:{
			submitFlag:true,
			tel:'',
			code:'',
			newPwd: '',
			rnewPwd: ''
		},
		mounted: function(){
			
		},
		methods:{
			sendcode:function(){
				var _this = this;
				if (!_this.tel) {
					$.oppo("请输入手机号码");
					return false;
				};
				var num = /^\d*$/; //全数字
                if(!num.exec(_this.tel) || _this.tel.length != 11) {
                    $.oppo("手机号格式不对");
                    return false;
                };
				var el = $('.send-code');
                if(el.hasClass('on')){
                    return false;
                }

                $.ADDLOAD();
                $.post(ajaxAPI+'/api/authcode/getAuthCodeHtm.htm', {mobileTel: this.tel, path: '1003'}, function(res) {
					$.RMLOAD();
                	if (res.returnCode == 200) {
                		$.oppo("验证码发送成功",1.3,function(){

			                el.addClass('on');

							$.CountDown(el);
                		})
                	};
                });
			},
			submit: function(){
				var _this = this;
				if(!_this.submitFlag) return false;
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
				if (!this.newPwd) {
					$.oppo("请输入新密码");
					return false;
				};
				if (!this.rnewPwd) {
					$.oppo("请输入确认新密码");
					return false;
				};
				if (this.newPwd != this.rnewPwd) {
					$.oppo("两次密码输入不一样");
					return false;
				};
				_this.submitFlag = false;
				$.ajax({
					url:ajaxAPI+'/api/v1/user/forgetPassword.htm',
					data:{
						tel:_this.tel,
						code:_this.code,
						newPwd:_this.newPwd,
						rnewPwd:_this.rnewPwd
					},
					type:'POST'
				}).done(function(res){
					if (res.returnCode == 200) {
						plus.oppo('密码修改成功！',1,function(){
							window.location.href="login.html";
						})
					}else{
						_this.submitFlag = true;
					}
				})
			}
		}
	})
})