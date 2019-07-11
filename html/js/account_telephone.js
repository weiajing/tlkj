$(function(){
	var vm = new Vue({
		el:'#main',
		data:{
			token: localStorage['yesToken'],
			submitFlag:true,
			tel:'',
			code:''
		},
		mounted: function(){
			$.checkUser();
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
                $.post(ajaxAPI+'/api/authcode/getAuthCodeHtm.htm', {mobileTel: this.tel, path: '1005'}, function(res) {
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
				$.ADDLOAD();
				_this.submitFlag = false;
				$.ajax({
					url:ajaxAPI+'/api/v1/user/restrict/checkTel.htm',
					data:{
						token: _this.token,
						tel:_this.tel,
						code:_this.code
					},
					type:'GET'
				}).done(function(res){
					$.RMLOAD();
					if (res.returnCode == 200) {
						plus.oppo('提交成功，请完成下一步绑定！',1.8,function(){
							window.location.href="account_telephone2.html?tag="+res.data;
						})
					}else{
						_this.submitFlag = true;
					}
				})
			}
		}
	})
})