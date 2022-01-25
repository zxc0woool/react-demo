
export const defaultHandler = {
	400: function () {

	},
	401: function () {

	},
	// ...更多其他HTTP错误码
}

export const commonErrHandler = {
	400000: function () {
		// 缺少参数, 有客户端必填验证则不会出现
		// 前端代码没问题的情况下, 这里肯定是非法请求
		// 便于开发调试直接alert输出, 后期可加入错误收集机制
		// Vue.prototype.$message.info('缺少请求参数');
	},
	401000: function () {
		// guest模式获取token
		// 获取成功后重新发起请求
		
	},
	401001: function () {
		// 通过refresh_token刷新token
		// 获取成功后保存token并重新发起请求
		// 若获取失败则重定向到登录页面
	},
	403000: function () {
		// 被黑白名单限制
		// 重定向403页面
		// alert("禁止访问")
	},
	500000: function () {
		// 意料之外的错误
		// 重定向500页面
		// Vue.prototype.$message.error('内部服务错误!');
	},
	500001: function () {
		// 意料之外的错误
		// 重定向500页面
		// Vue.prototype.$message.error('获取短信验证吗频繁！请稍后再试！');
	},
};

export const passportErrHandler = {
	400001:()=> {
		// 验证码错误
		// Vue.prototype.$message.error('验证码错误');
		// defaultHandler[400]()
	},
	401002: function () {
		// Token刷新失败
		// Vue.prototype.$message.error('Token刷新失败');
		// defaultHandler[401]()
	},
	403001: function () {
		// 用户已禁用
		// Vue.prototype.$message.error('用户已禁用');
		// defaultHandler[403]()
	},
	404001: function () {
		// 用户不存在
		// Vue.prototype.$message.error('用户不存在');
		// defaultHandler[404]()
	}
};
export const errorException = {
	...commonErrHandler,
	...passportErrHandler
} 
