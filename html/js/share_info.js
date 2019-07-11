var vm
$(function(){
	vm = new Vue({
		el:'#main',
		data:{
			oid: $.getUrlParam('oid'),
			pid: $.getUrlParam('pid'),
			type: $.getUrlParam('type'),
			getbl: true,
			canvasShow: false,
			raffleing: false,
			result: '',
			stat: 0,
			bonus: '',
			result: '',
			imgshow: false,
			imgshowindex: 2,
			img1: '',
			img2: ''
		},
		mounted:function(){
			this.views();
		},
		methods:{
			views: function(){
				var _this = this;

				$.getJSON(ajaxAPI+'/api/v1/order/getSharingResult.htm', {oidStr: this.oid}, function(res) {
					if (res.returnCode == 200) {
						_this.stat = res.data.stat;
						_this.bonus = res.data.bonus;
						_this.result = res.data;

						if (res.data.stat == 3){
							_this.imgshow = true;
							_this.img1 = res.data.picurl1;
							_this.img2 = res.data.picurl2;
						};
					};
				});
			},
			getscratch:function(type){
				var _this = this;
				this.canvasShow = true;
				this.raffleing = true;
				this.getbl = true;
				// $.ADDLOAD();
				setTimeout(function(){
					canvasBegin(type);
				},100);
			},
			getResults:function(){
				var _this = this;
				$.getJSON(ajaxAPI+'/api/v1/order/getSharingResults.htm', {oidStr: _this.oid}, function(res) {
					if (res.returnCode == 200) {
						if (res.data.stat == 0) {
							setTimeout(function(){
								_this.getResults();
							},2000);
						}else if (res.data.stat == 1) {

							$.oppo(res.msg,1.5,function(){
								window.location.reload();
							});

						}else if (res.data.stat == 3){

							_this.result = res.data;
							_this.stat = 3;
							_this.bonus = res.data.bonus;

							_this.imgshow = true;
							_this.img1 = res.data.picurl1;
							_this.img2 = res.data.picurl2;

						}else if (res.data.stat == 4){
							_this.result = res.data;
							_this.stat = 4;
							_this.bonus = '';
						}
					};
				});
			}
		}
	})
})