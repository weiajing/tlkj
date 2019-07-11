$(function(){
	var vm = new Vue({
		el:'#main',
		data:{
			token: ($.getUrlParam('token')?$.getUrlParam('token'):localStorage['yesToken']),
			info: ''
		},
		mounted: function(){
			$.checkUser();
			$.ADDLOAD();
			this.viewAjax();
		},
		methods:{
			viewAjax: function(){
				if ($.getUrlParam('token')) {
					localStorage['yesToken'] = $.getUrlParam('token');
				};
				var _this = this;
				$.getJSON(ajaxAPI+'/api/v1/user/restrict/myInfo.htm', {token: this.token}, function(res) {
					$.RMLOAD();
					if (res.returnCode = 200) {
						_this.info = res.data;
					};
				});
			}
		}
	})
})