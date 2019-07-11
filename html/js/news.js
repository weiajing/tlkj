    /*分页加载*/
    window.load_t = true;
    window.pageLoad = function(callback) {
        var loadBox = $('.load-move');
        var naveBox = $('.m-nave');
        
        $(window).on('scroll', function () {
            var scrollTop = $(this).scrollTop();
            var naveHeight = naveBox.height();
            var winHeight = $(window).height();

            if (!naveHeight) naveHeight = 0;
            if ((loadBox.offset().top + loadBox.innerHeight() / 2) <= (scrollTop + winHeight - naveHeight) && load_t && !loadBox.hasClass('not')) {
                load_t = false;
                callback();
            }
        });
        callback();
    };

var vm = new Vue({
    el: '#main',
    data: {
        token: localStorage['yesToken'],
        list:[],
        pageNo:1,
        loadType: false,
    },
    mounted:function(){
        var _this = this;
        $.checkUser();
        $.ADDLOAD();
        pageLoad(function(){
            _this.newslist();
        });
    },
    methods:{
        newslist:function(){
            var _this = this;
            $.ajax({
                url: ajaxAPI+'/api/v1/user/restrict/messageList.htm',
                type: 'get',
                data: {
                    token: _this.token,
                    pageNo:_this.pageNo,
                },
                success:function(res){
                    $.RMLOAD();
                    if(res.returnCode=='200'){
                        _this.list = _this.list.concat(res.data);
                        if(res.data.length){
                            _this.pageNo ++;
                            window.load_t = true;
                        }else{
                            _this.loadType = false;
                        }
                    }
                },
                error:function(res){
                    // console.log(res)
                },
                complete:function(res){
                    // console.log(res)
                }
            })
        },
        allRead:function(){
            var _this = this;
            $.ADDLOAD();
            $.post(ajaxAPI+'/api/v1/user/restrict/readMessage.htm', {token: localStorage['yesToken'], oidStr: '', typeStr: 2}, function(res) {
                $.RMLOAD();
                if(res.returnCode=='200'){
                    _this.list = [];
                    _this.pageNo = 1;
                    _this.newslist();
                };
            });
        }
    }
})

 