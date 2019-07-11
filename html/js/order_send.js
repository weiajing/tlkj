$(function(){	
	var vm = new Vue({
		el:'#main',
		data:{
			sharealert: false,
			token: localStorage['yesToken'],
			branchGoodsIdStr: $.getUrlParam('id'),
			type: 1,
			pageNo: 1,
			limit: 5,
			list: [],
			readmore: false,
			ajaxmore: false
		},
		mounted:function(){
			$.checkUser();
			$.ADDLOAD();
			var _this = this;
			_this.viewAjax();

			$(window).scroll(function() {
	        	if ($(document).height() - $(this).scrollTop() - $(this).height() < 80 && _this.readmore == true && _this.ajaxmore == true) {
	        		_this.pageNo = _this.pageNo + 1;
	        		_this.ajaxmore = false;
	        		_this.ajaxMore();
	        	};
	        });
		},
		methods:{
			viewAjax:function(){
				var sdata = {
					token: this.token,
					pageNo: this.pageNo,
					typeStr: this.type,
					limit: this.limit
				}
				var _this = this;
				$.getJSON(ajaxAPI+'/api/v1/giveAway/restrict/giveAwayRecord.htm', sdata, function(res) {
					$.RMLOAD();
					if (res.returnCode == 200) {
						_this.list = res.data.list;

						if (res.data.count > 5 && res.data.list.length == 5) {
							_this.readmore = true;
							_this.ajaxmore = true;
						}else{
							_this.readmore = false;
						}
					};
				});
			},
			ajaxMore:function(){
				var sdata = {
					token: this.token,
					pageNo: this.pageNo,
					typeStr: this.type,
					limit: this.limit
				}
				var _this = this;
				$.getJSON(ajaxAPI+'/api/v1/giveAway/restrict/giveAwayRecord.htm', sdata, function(res) {
					$.RMLOAD();
					if (res.returnCode == 200) {
						_this.list = _this.list.concat(res.data.list);

						if (res.data.count > 5 && res.data.list.length == 5) {
							_this.readmore = true;
							_this.ajaxmore = true;
						}else{
							_this.readmore = false;
						}
					};
				});
			}
		}
	});
});