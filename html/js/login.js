$(function(){
	var vm = new Vue({
		el:'#main',
		data:{
			URL: window._url,
			tel: '',
			password: '',
			oidStr: ($.getUrlParam("oid")?$.getUrlParam("oid"):''),
            from:$.getUrlParam('from'),
			bl: true
		},
		mounted:function(){
			
		},
		methods:{
			submit: function(){
				if (!this.tel) {
					$.oppo("请输入手机号码");
					return false;
				};
				if (!this.password) {
					$.oppo("请输入密码");
					return false;
				};
				if (this.bl == false) {
					return false;
				};
				this.viewAjax();
			},
			viewAjax: function(){
				$.ADDLOAD();
				var t = this;
				this.bl = false;
				var data = {
					tel: this.tel,
					password: this.password,
					oidStr: this.oidStr
				};
				$.post(ajaxAPI+'/api/v1/user/login.htm', data, function(res) {
					$.RMLOAD();
					t.bl = true;
					if (res.returnCode == 200) {
						$.putToken(res);
						$.oppo('登录成功', 1.3, function () {
                            if(t.from){
                                window.location.href = $.base64decode(t.from)
                            }else {
                                window.location.href = t.URL + "member.html";
                            }
                        })
					};
				});
			},
			wxlogin:function(){
				$.ADDLOAD();
	            $.getJSON(ajaxAPI+'/api/v1/user/getWXUtl.htm', function(res) {
	                $.RMLOAD();
	                if (res.returnCode == 200) {
	                    window.location.href = res.data;
	                };
	            });
			}
		}
	})
})