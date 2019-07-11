
$(function(){
	var vm = new Vue({
		el:'#main',
		data:{
			token: localStorage['yesToken'],
			nickName: '',
			bl : true
		},
		mounted: function(){
			$.checkUser();
		},
		methods:{
			submit: function(){
				if (!this.nickName) {
					$.oppo("请输入新昵称");
					return false;
				};
				this.viewAjax();
			},
			viewAjax: function(){
				var _this = this;
				this.bl = false;
				var sdata = {
					token: _this.token,
					nickName: _this.nickName
				}
				$.post(ajaxAPI+'/api/v1/user/restrict/updateUserInfo.htm', sdata, function(rest) {
        			if (rest.returnCode == 200) {
        				window.location.href = 'account.html';
        			};
        		});
			}
		}
	})
})