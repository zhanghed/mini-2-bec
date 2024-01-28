Page({
	data: {

	},
	tabHandle(e) {
		let curtab = e.currentTarget.id * 250
		curtab = "translatex(" + curtab + "rpx)"
		this.setData({
			curtab: curtab,
		})
	}


})