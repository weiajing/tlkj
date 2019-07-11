$(function(){
	var vm = new Vue({
		el:'#main',
		data:{
			token: localStorage['yesToken'],
			state:plus.getUrlParam('state'),
			realName:'',
			idCard:'',
			call: ''
		},
		mounted: function(){
			plus.ADDLOAD();
			$.checkUser();
			this.getInfo();
			this.callAjax();
		},
		methods:{
			getInfo:function(){
				var _this = this;
				$.ajax({
					url:ajaxAPI+'/api/v1/user/restrict/getMyCheckUserReal.htm',
					data:{
						token:_this.token
					},
					type:'GET'
				}).done(function(res){
					if(res.returnCode == 200){
						plus.RMLOAD();
						_this.realName = res.data.realName;
						_this.state = res.data.stat;
						_this.idCard = res.data.idCard;
					}
				})
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