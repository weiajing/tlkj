$(function(){
	var vm = new Vue({
		el:'#main',
		data:{
			token: localStorage['yesToken'],
			idCard:'',
			frontFace:'',
			reverseSide:'',
			handheld:'',
			oidStr:'',
			submitFlag:true,
		},
		mounted: function(){
			$.checkUser();
		},
		methods:{
			uploadHeadimg:function(e,str){
				if (e.target.files.length === 0) return;
				var _this = this;
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
                    		plus.oppo('上传成功')
                    		_this[str] = res.data.url;
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
			submit: function(){
				var _this = this;
				if(!_this.submitFlag) return false;
				if(!_this.frontFace){
					plus.oppo('请上传身份证正面扫描！')
					return false;
				}
				if(!_this.reverseSide){
					plus.oppo('请上传身份证背面扫描！')
					return false;
				}
				if(!_this.handheld){
					plus.oppo('请上传手持身份证正面照！')
					return false;
				}
				if(!_this.idCard){
					plus.oppo('请填写身份证号！')
					return false;
				}
				_this.submitFlag = false;
				$.ajax({
					url:ajaxAPI+'/api/v1/user/restrict/subReal.htm',
					data:{
						token: _this.token,
						frontFace:_this.frontFace,
						reverseSide:_this.reverseSide,
						handheld:_this.handheld,
						oidStr:_this.oidStr,
						idCard:_this.idCard
					},
					type:'GET'
				}).done(function(res){
					if (res.returnCode == 200) {
						plus.oppo('实名认证已提交！',1,function(){
							window.location.href="account.html";
						})
					}else{
						_this.submitFlag = true;
					}
				})
			}
		}
	})
})