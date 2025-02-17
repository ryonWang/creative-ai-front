import axios from 'axios';
import { useUserStore } from '@/stores';
import { uniAdapter } from 'fant-axios-adapter'
import { getToken } from './auth'

// 设置全局的请求次数，请求的间隙
axios.defaults.retry = 2
axios.defaults.retryDelay = 1000

// 根据环境使用不同的baseURL
const baseURL = import.meta.env.MODE === 'development' ? import.meta.env.VITE_BASE_URL : import.meta.env.VITE_BASE_URL;

// 是否显示重新登录
export let isRelogin = { show: false };

// 创建axios实例
const service = axios.create({
	baseURL,
	timeout: 60000,
	headers: {
		'X-Requested-With': 'XMLHttpRequest',
		'Content-Type': 'application/json',
		'Accept': 'application/json',
	},
	adapter: uniAdapter,
	validateStatus: function (status) {
		return status >= 200 && status < 300
	},
	withCredentials: true,
	crossDomain: true
})

// request拦截器
service.interceptors.request.use(
	config => {
		if(config.loading){
			uni.showLoading({title: '加载中', mask: true})     
		}
		
		// 是否需要设置 token
		const token = getToken()
		const isToken = (config.headers || {}).isToken === false
		if (token && !isToken) {
			config.headers['Authorization'] = 'Bearer ' + token
		}
		
		// 防止重复提交
		if (config.method === 'post' || config.method === 'put') {
			const requestObj = {
				url: config.url,
				data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
				time: new Date().getTime()
			}
			const sessionObj = uni.getStorageSync('sessionObj')
			if (!sessionObj) {
				uni.setStorageSync('sessionObj', requestObj)
			} else {
				const s_url = sessionObj.url;
				const s_data = sessionObj.data;
				const s_time = sessionObj.time;
				const interval = 250;
				if (s_data === requestObj.data && requestObj.time - s_time < interval && s_url === requestObj.url) {
					return Promise.reject(new Error('数据正在处理，请勿重复提交'))
				} else {
					uni.setStorageSync('sessionObj', requestObj)
				}
			}
		}
		return config
	},
	error => {
		uni.hideLoading()
		console.error('Request error:', error)
		return Promise.reject(error)
	}
)

// response 拦截器
service.interceptors.response.use(
	response => {
		if(response.config.loading){
			uni.hideLoading()
		}
		
		// 验证码接口特殊处理
		if (response.config.url.includes('/captcha/')) {
			return response.data
		}
		
		// 二进制数据直接返回
		if (response.request && response.request.responseType === 'blob' || response.request && response.request.responseType === 'arraybuffer') {
			return response.data
		}
		
		const res = response.data
		if (res) {
			// 处理成功响应
			if (res.code === 0 || res.code === 200) {
				return res
			}
			
			// 处理401未授权
			if (res.code === 401) {
				const userStore = useUserStore()
				if (!isRelogin.show) {
					isRelogin.show = true
					uni.showModal({
						title: '系统提示',
						content: '登录状态已过期，请重新登录',
						confirmText: '重新登录',
						cancelText: '取消',
						success: function(res) {
							isRelogin.show = false
							if (res.confirm) {
								userStore.logOut()
							}
						}
					})
				}
				return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
			}
			
			// 显示错误信息
			if (res.message) {
				uni.showToast({ 
					title: res.message, 
					icon: 'none', 
					duration: 3000
				})
			}
			return Promise.reject(res)
		} else {
			const error = new Error('返回数据格式错误')
			uni.showToast({ 
				title: error.message, 
				icon: 'none', 
				duration: 3000
			})
			return Promise.reject(error)
		}
	},
	error => {
		console.error('Response error:', error)
		uni.hideLoading()
		
		let message = '请求失败'
		if (error.message === 'Network Error') {
			message = '网络连接失败，请检查网络设置'
		} else if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
			message = '请求超时，请重试'
		} else if (error.response) {
			const status = error.response.status
			const statusMessages = {
				400: '请求错误',
				401: '未授权，请重新登录',
				403: '拒绝访问',
				404: '请求地址出错',
				408: '请求超时',
				500: '服务器内部错误',
				501: '服务未实现',
				502: '网关错误',
				503: '服务不可用',
				504: '网关超时',
				505: 'HTTP版本不受支持'
			}
			message = statusMessages[status] || `请求失败(${status})`
			
			// 处理401错误
			if (status === 401) {
				const userStore = useUserStore()
				if (!isRelogin.show) {
					isRelogin.show = true
					uni.showModal({
						title: '系统提示',
						content: '登录状态已过期，请重新登录',
						confirmText: '重新登录',
						cancelText: '取消',
						success: function(res) {
							isRelogin.show = false
							if (res.confirm) {
								userStore.logOut()
							}
						}
					})
				}
				return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
			}
		}
		
		uni.showToast({ 
			title: message, 
			icon: 'none', 
			duration: 2000
		})
		
		return Promise.reject(error)
	}
)

export default service
