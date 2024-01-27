const app = getApp()

Page({
	data: {
		nav: {  //滚动导航
			list: [
				{ name: '热门', id: 0},
				{ name: '上衣女', id: 1},
				{ name: '上衣男', id: 2},
				{ name: 'T恤', id: 3},
				{ name: '短裙', id: 4},
				{ name: '长裙', id: 5},
				{ name: '连衣裙', id: 6},
				{ name: '夏季凉鞋', id: 7},
				{ name: '冬季短靴', id: 8},
				{ name: '包包饰品', id: 9},
				{ name: '休闲裤', id: 10},
				{ name: '西装', id: 11},
			],
			active: 0,  //当前选中的导航下标
			left: 0,    //滚动值
			width: 28,
			offsetLeft: 11
		},
	},
	onLoad(){
		let _this = this;
        wx.getSystemInfo({
            success: function (res) {
                //console.log('系统信息:', res);
				_this.setData({
					windowWidth: res.windowWidth
				})
            }
        });
	},
	//滚动导航 - 选中监听
	select: function(e){
		// console.log('当前导航：', e);
		let _this = this,
			nav = this.data.nav,
			idx = e.currentTarget.dataset.idx,
			width = nav.list[idx].name.length * 14,
			windowWidth = this.data.windowWidth,
			offsetLeft = e.target.offsetLeft;
		if (offsetLeft < windowWidth) {
			nav.left = width + 68 - windowWidth + offsetLeft;
		} else {
			nav.left = offsetLeft - windowWidth + width + 68;
		}
		wx.createSelectorQuery().select('.scroll_item' + idx).boundingClientRect(function(res){
			nav.active = idx;
			nav.width = res.width - 20;
			nav.offsetLeft = offsetLeft + 11;
			_this.setData({
				nav: nav,
			})
			//可在这调用接口获取相应tab页的数据
		}).exec();
	}
})
