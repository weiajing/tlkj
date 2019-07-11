var vm = new Vue({
	el: "#help",
	data: {
		typeStr:plus.getUrlParam('type'),
		numhelp:[],
	},
	mounted:function(){
		var _this = this;
		_this.help();
	},
	methods:{
		help:function(){
			var _this = this;

			$.ajax({
				url: ajaxAPI+'/api/v1/other/getCustomContent.htm',
				type: 'get',
				data: {
					typeStr:_this.typeStr
				},
				success:function(res){
					if(res.returnCode=='200'){
						_this.numhelp = res.data;
					}
				},
				error:function(res){
                    // console.log(res)
                },
				complete:function(res){
                    console.log(res)
                }
			})	
		}
	}
})