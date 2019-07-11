// var ajaxAPI = location.origin;
// var ajaxAPI = 'http://121.40.200.150:9093';
var ajaxAPI = 'http://192.168.1.145:8088/guaguacai';
// var ajaxAPI = 'http://39.104.74.223:80';
window._url = location.origin+'/tlkj/html/'
$(function(){
    var URL = location.origin+'/tlkj/html/';
	function addincinclude() {
		var footer_data = {
            footer: [
                {
                    class: 'index',
                    name: '购彩大厅',
                    url: URL + 'index.html',
                    index: 1
                },
                {
                    class: 'order',
                    name: '刮彩中心',
                    url: URL + 'order.html?stat=1',
                    index: 2
                },
                {
                    class: 'shopcar',
                    name: '购物车',
                    url: URL + 'shop_car.html',
                    index: 3
                },
                {
                    class: 'my',
                    name: '个人中心',
                    url: URL + 'member.html',
                    index: 4
                }
            ]
        };
        var html = '<div class="footer">'
        html += '<ul>'
        html += '<li v-for="(item,index) in footer" :class="[item.class,now==item.class?\'hover\':\'\']">'
        html += '<a :href="item.url">'
        html += '<span :class="[\'ico\',\'ico\'+item.index]"></span>'
        html += '<p>{{item.name}}</p>'
        html += '</a>'
        html += '</li>'
        html += '</ul>'
        html += '</div>'

        Vue.component('bar', {
            template: html,
            props: ['now','index'],
            data: function () {
                return footer_data;
                console.log($(".footer li"))
            }
        })
    };

    addincinclude();
})