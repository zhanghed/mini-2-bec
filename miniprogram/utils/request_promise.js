// 封装wx.request为promise
export
const request_promise = (params) => {
	return new Promise((resolve, reject) => {
		wx.request({
			...params,
			success: (result) => {
				resolve(result);
			},
			fail: (err) => {
				reject(err);
			}
		})
	})
}