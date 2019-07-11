
$(function(){
	var vm = new Vue({
		el:'#main',
		data:{
			token: localStorage['yesToken'],
			info: '',
			call: ''
		},
		mounted: function(){
			$.checkUser();
			$.ADDLOAD();
			this.viewAjax();
			this.callAjax();
		},
		methods:{
			viewAjax: function(){
				var _this = this;
				$.getJSON(ajaxAPI+'/api/v1/user/restrict/myInfo.htm', {token: this.token}, function(res) {
					$.RMLOAD();
					if (res.returnCode = 200) {
						_this.info = res.data;
					};
				});
			},
			uploadHeadimg:function(e){
				if (e.target.files.length === 0) return;
				var _this = this;
				console.log(e.target.files[0])
			    lrz(e.target.files[0])
			    .then(function (rst) {
			    	console.log(rst.formData);
			    	$.ajax({
                        url: ajaxAPI + '/web/files/upload.htm',
                        type: 'POST',
                        data: rst.formData,
                        processData: false,
                        cache: false,
                        contentType: false
                    })
                    .done(function (res) {
                    	if (res.returnCode == 200) {
                    		var sdata = {
                    			token: _this.token,
                    			headImgUrl: res.data.url
                    		}
                    		$.post(ajaxAPI+'/api/v1/user/restrict/updateUserInfo.htm', sdata, function(rest) {
                    			if (rest.returnCode == 200) {
                    				_this.info.headImgUrl = rest.data.headImgUrl;
                    			};
                    		});
                    	};
                    });
			    })
			    .catch(function (err) {
                    // 处理失败会执行
                    console.log(err);
                })
                .always(function () {
                    // 不管是成功失败，都会执行
                });
			},
			callAjax:function(){
				var _this = this;
				$.getJSON(ajaxAPI+'/api/v1/user/customerService.htm', function(res) {
					$.RMLOAD();
					if (res.returnCode == 200) {
						_this.call = res.data;
					};
				});
			},
			logout:function(){
				$.ADDLOAD();
				$.post(ajaxAPI+'/api/v1/user/restrict/logout.htm', {token: this.token}, function(res) {
					$.RMLOAD();
					if (res.returnCode == 200) {
						$.clearUser();
            			$.toSignin();
					};
				});
			}
		},
		filters:{
			state:function(val){
				var str = '';
				//0审核中1已认证2未通过3没有提交实名认证信息
				switch(val){
					case 0 : str = '审核中';break;
					case 1 : str = '已认证';break;
					case 2 : str = '未通过';break;
					case 3 : str = '未认证';break;
				}
				return str;
			},
			telType:function(val){
				var str = '';
				//0审核中1已认证2未通过3没有提交实名认证信息
				switch(val){
					case 0 : str = '未绑定';break;
					case 1 : str = '已绑定';break;
				}
				return str;
			}
		}
	})
})