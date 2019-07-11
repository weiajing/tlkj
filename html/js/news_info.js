var vm = new Vue({
	el: "#main",
	data: {
		typeStr: plus.getUrlParam('type'),
		oidStr: plus.getUrlParam('oid'),
		info: ''
	},
	mounted:function(){
		var _this = this;
		$.checkUser();
		_this.help();
		$.ADDLOAD();
	},
	methods:{
		help:function(){
			var _this = this;
			$.post(ajaxAPI+'/api/v1/user/restrict/readMessage.htm', {token: localStorage['yesToken'], oidStr: _this.oidStr, typeStr: 1}, function(res) {
				if(res.returnCode=='200'){
					$.ajax({
						url: ajaxAPI+'/api/v1/user/restrict/messageDetail.htm',
						type: 'get',
						data: {
							token: localStorage['yesToken'],
							oidStr: _this.oidStr
						},
						success:function(res){
							$.RMLOAD();
							if(res.returnCode=='200'){
								_this.info = res.data;
							}
						},
						error:function(res){
		                    // console.log(res)
		                },
						complete:function(res){
		                    console.log(res)
		                }
					})
				};
			});
			
		}
	}
})