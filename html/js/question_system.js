$(function(){
	var vm = new Vue({
		el:'#main',
		data:{
			token: localStorage['yesToken'],
			content: '',
			title:'',
			oderNo:'',
			submitFlag:true,
			imglist:[]
		},
		mounted: function(){
			$.checkUser();
		},
		methods:{
			uploadHeadimg:function(e){
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
                    		_this.imglist.push(res.data.url)
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
			del_img:function(key){
				var _this = this;
				_this.imglist.splice(key,1);
			},
			submit: function(type){
				var _this = this;
				if(!_this.submitFlag) return false;
				if(!_this.title || _this.title == ''){
					plus.oppo('请输入标题！')
					return false;
				}
				if(!_this.content || _this.content == ''){
					plus.oppo('请输入问题描述！')
					return false;
				}
				if(type==1){
					if(!_this.oderNo || _this.oderNo == ''){
						plus.oppo('请输入订单号！')
						return false;
					}
				}
				_this.submitFlag = false;
				var pic = _this.imglist.join(',');
				$.ajax({
					url:ajaxAPI+'/api/v1/user/restrict/subFeedback.htm',
					type:'POST',
					data:{
						token: _this.token,
						oderNo:_this.oderNo,
						typeStr:type,
						title:_this.title,
						content:_this.content,
						pic:pic
					}
				}).done(function(res){
					if (res.returnCode == 200) {
						plus.oppo('问题提交成功！',1,function(){
							window.location.href="question.html";
						})
					}else{
						_this.submitFlag = true;
					}
				})
			}
		}
	})
})