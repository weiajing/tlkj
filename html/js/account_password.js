
$(function(){
	var vm = new Vue({
		el:'#main',
		data:{
			token: localStorage['yesToken'],
			oldPassword: '',
			newPassword: '',
			rnewPassword: '',
			bl : true
		},
		mounted: function(){
			$.checkUser();
		},
		methods:{
			submit: function(){
				if (!this.oldPassword) {
					$.oppo("请输入原密码");
					return false;
				};
				if (!this.newPassword) {
					$.oppo("请输入新密码");
					return false;
				};
				if (!this.rnewPassword) {
					$.oppo("请输入确认密码");
					return false;
				};
				if (this.bl == false) {
					return false;
				};
				this.viewAjax();
			},
			viewAjax: function(){
				var _this = this;
				this.bl = false;
				var sdata = {
					token: _this.token,
					oldPassword: _this.oldPassword,
					newPassword: _this.newPassword,
					rnewPassword: _this.rnewPassword
				};
				$.post(ajaxAPI+'/api/v1/user/restrict/updatePassword.htm', sdata, function(res) {
					$.RMLOAD();
					_this.bl = true;
					if (res.returnCode == 200) {
						$.oppo('密码修改成功', 1.3, function () {
							$.clearUser();
                			$.toSignin();
						});
					};
				});
			}
		}
	})
})