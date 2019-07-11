$(function(){
	var vm = new Vue({
		el:'#main',
		data:{
			token: localStorage['yesToken'],
			submitFlag:true,
			tel:'',
			code:'',
			tag: $.getUrlParam('tag')
		},
		mounted: function(){
			$.checkUser();

			if (!this.tag) {
				$.oppo("操作流程有问题，请完成第一步",1.3,function(){
	                window.location.href = 'account_telephone.html';
        		})
			};
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
				_this.submitFlag = false;
				$.ajax({
					url:ajaxAPI+'/api/v1/user/restrict/updateTel.htm',
					data:{
						token: _this.token,
						tel:_this.tel,
						code:_this.code,
						tag: _this.tag
					},
					type:'GET'
				}).done(function(res){
					if (res.returnCode == 200) {
						if (res.data == false) {
							plus.oppo('操作有问题，请先完成第一步',1,function(){
								// window.location.href="account_telephone.html";
							})
						}else{
							plus.oppo('修改手机号成功！',1,function(){
								window.location.href="account.html";
							})
						}
					}else{
						_this.submitFlag = true;
					}
				})
			}
		}
	})
})