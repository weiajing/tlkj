
$(function(){
	var vm = new Vue({
		el:'#main',
		data:{
			call: ''
		},
		mounted: function(){
			$.ADDLOAD();
			this.callAjax();
		},
		methods:{
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