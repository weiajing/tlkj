$(function(){
	var main = {
		data:{
			URL: window._url,
			from:$.getUrlParam('from'),
			bl: true,
			oidStr: ($.getUrlParam("oidStr")?$.getUrlParam("oidStr"):'')
		},
		submit: function(){
			if (!$('.tel').val()) {
				$.oppo("请输入手机号码");
				return false;
			};
			var num = /^\d*$/; //全数字
            if(!num.exec($('.tel').val()) || $('.tel').val().length != 11) {
                $.oppo("手机号格式不对");
                return false;
            };
			if (!$('.code').val()) {
				$.oppo("请输入短信验证码");
				return false;
			};
			if (!$('.nickName').val()) {
				$.oppo("请输入用户名");
				return false;
			};
			if (!$('.password').val()) {
				$.oppo("请输入密码");
				return false;
			};
			if (!$('.rpassword').val()) {
				$.oppo("请输入确认密码");
				return false;
			};
			if (main.data.bl == false) {
				return false;
			};
			this.viewAjax();
		},
		viewAjax: function(){
			$.ADDLOAD();
			main.data.bl = false;
			var data = {
				tel: $('.tel').val(),
				code: $('.code').val(),
				nickName: $('.nickName').val(),
				password: $('.password').val(),
				rpassword: $('.rpassword').val(),
				oidStr: main.data.oidStr,
				headimgurl : $('#headimgurl').val(),
				openid : $('#openid').val()
			};
			$.post(ajaxAPI+'/api/v1/user/registre.htm', data, function(res) {
				$.RMLOAD();
				main.data.bl = true;
				if (res.returnCode == 200) {
					$.putToken(res);
					$.oppo('注册成功', 1.3, function () {
                        if(main.data.from){
                            window.location.href = $.base64decode(main.data.from)
                        }else {
                            window.location.href = main.data.URL + "member.html";
                        }
                    })
				};
			});
		},
		sendcode:function(){
			if (!$('.tel').val()) {
				$.oppo("请输入手机号码");
				return false;
			};
			var num = /^\d*$/; //全数字
            if(!num.exec($('.tel').val()) || $('.tel').val().length != 11) {
                $.oppo("手机号格式不对");
                return false;
            };
			var el = $('.send-code');
            if(el.hasClass('on')){
                return false;
            }

            $.ADDLOAD();
            $.post(ajaxAPI+'/api/authcode/getAuthCodeHtm.htm', {mobileTel: $('.tel').val(), path: '1001'}, function(res) {
				$.RMLOAD();
            	if (res.returnCode == 200) {
            		$.oppo("验证码发送成功",1.3,function(){

                		el.addClass('on');

						$.CountDown(el);
            		})
            	};
            });
		},
		callAjax:function(){
			$.getJSON(ajaxAPI+'/api/v1/user/customerService.htm', function(res) {
				$.RMLOAD();
				if (res.returnCode == 200) {
					$(".bot-cont .font2 .red").html(res.data).attr("href", 'tel:'+res.data);
				};
			});
		}
	}
	main.callAjax();
	$(".send-code").on("click",function(){
		main.sendcode();
	});
	$(".sub-btn").on("click",function(){
		main.submit();
	});
	
})