$(function(){
	var vm = new Vue({
		el:'#main',
		data:{
			stat: $.getUrlParam('stat')?$.getUrlParam('stat'):'0',
			token: localStorage['yesToken'],
			pageNo: 1,
			limit: 10,
			orderlist: '',
			readmore: false,
			ajaxmore: false
		},
		mounted:function(){
			$.checkUser();
			$.ADDLOAD();
			this.viewAjax();

			var _this = this;
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
					stat: this.stat,
					pageNo: this.pageNo,
					limit: this.limit
				}
				var _this = this;
				$.getJSON(ajaxAPI+'/api/v1/order/restrict/getMyOrder.htm', sdata, function(res) {
					$.RMLOAD();
					if (res.returnCode == 200) {
						_this.orderlist = res.data.list;

						var thisnum = 0;
						for (var i = 0; i < res.data.list.length; i++) {
							thisnum += res.data.list[i].list.length;
						};
						if (res.data.count > 10*_this.pageNo && thisnum == 10) {
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
					stat: this.stat,
					pageNo: this.pageNo,
					limit: this.limit
				}
				var _this = this;
				$.getJSON(ajaxAPI+'/api/v1/order/restrict/getMyOrder.htm', sdata, function(res) {
					$.RMLOAD();
					if (res.returnCode == 200) {
						// _this.orderlist = _this.orderlist.concat(res.data.list);
						var thisnum = 0;
						for (var i = 0; i < res.data.list.length; i++) {
							thisnum += res.data.list[i].list.length;
						};
						if (res.data.count > 10*_this.pageNo && thisnum == 10) {
							_this.readmore = true;
							_this.ajaxmore = true;
						}else{
							_this.readmore = false;
						}
						for (var i = 0; i < _this.orderlist.length; i++) {
							if (_this.orderlist[i].no == res.data.list[0].no) {
								console.log(_this.orderlist[i])
								console.log(res.data.list[0])
								for (var a = 0; a < res.data.list[0].list.length; a++) {
									_this.orderlist[i].list.push(res.data.list[0].list[a]);
								};
								res.data.list.splice(0,1);
							};
						};
						_this.orderlist = _this.orderlist.concat(res.data.list);
						// console.log(_this.orderlist)
					};
				});
			}
		}
	})
})