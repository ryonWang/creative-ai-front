import { defineStore } from 'pinia'
import request from '@/utils/request'
import { useWebsetStore } from './webset'

export const useUserStore = defineStore('user', {
	state: () => {
		console.log('初始化token:', uni.getStorageSync('token'))
		// 从本地存储加载所有用户信息
		return {
			token: uni.getStorageSync('token') || '',
			userName: uni.getStorageSync('userName') || '',
			imgHeader: uni.getStorageSync('imgHeader') || '',
			sex: uni.getStorageSync('sex') || '',
			ifTourist: uni.getStorageSync('ifTourist') || '',
			userId: uni.getStorageSync('userId') || '',
			userDetail: uni.getStorageSync('userDetail') || {}
		}
	},
	
	getters: {
		isLogin: (state) => {
			const loginState = !!state.token
			console.log('检查登录状态:', loginState, 'token:', state.token)
			return loginState
		},
		info: (state) => ({
			name: state.userName || '',
			userId: state.userId || '',
			imgUrl: state.imgHeader || ''
		})
	},

	actions: {
		// 初始化store
		initStore() {
			console.log('初始化store')
			this.token = uni.getStorageSync('token') || ''
			this.userName = uni.getStorageSync('userName') || ''
			this.imgHeader = uni.getStorageSync('imgHeader') || ''
			this.sex = uni.getStorageSync('sex') || ''
			this.ifTourist = uni.getStorageSync('ifTourist') || ''
			this.userId = uni.getStorageSync('userId') || ''
			this.userDetail = uni.getStorageSync('userDetail') || {}
			
			// 如果有token但没有用户信息，尝试获取用户信息
			if (this.token && !this.userId) {
				this.GetInfo().catch(err => {
					console.error('获取用户信息失败:', err)
					this.clearToken()
				})
			}
		},

		setUserToken(token) {
			if (!token) {
				console.error('设置token失败: token为空')
				return
			}
			console.log('设置token:', token)
			this.token = token
			uni.setStorageSync('token', token)
			// 更新请求头中的token
			if (request.defaults) {
				request.defaults.headers.common['Authorization'] = 'Bearer ' + token
			}
		},

		// 只清除token
		clearToken() {
			console.log('清除token')
			this.token = ''
			uni.removeStorageSync('token')
			if (request.defaults) {
				delete request.defaults.headers.common['Authorization']
			}
		},

		// 获取用户信息
		async GetInfo() {
			try {
				const res = await request({
					url: '/module/user/userinfo/getInfo',
					method: 'get'
				})
				
				console.log('获取用户信息返回:', res)
				if (res && res.data) {
					const data = res.data
					this.userName = data.userName || data.ipaddress
					this.userId = data.id
					this.imgHeader = data.imgUrl
					this.sex = data.sex
					this.ifTourist = data.ifTourist
					this.userDetail = data
					
					// 存储到本地
					uni.setStorageSync('userName', this.userName)
					uni.setStorageSync('userId', this.userId)
					uni.setStorageSync('imgHeader', this.imgHeader)
					uni.setStorageSync('sex', this.sex)
					uni.setStorageSync('ifTourist', this.ifTourist)
					uni.setStorageSync('userDetail', this.userDetail)
					
					// 加载网站配置
					const websetStore = useWebsetStore()
					await websetStore.initWebset()
					
					return res
				} else {
					throw new Error(res.message || '获取用户信息失败')
				}
			} catch (error) {
				console.error('获取用户信息失败:', error)
				uni.showToast({
					title: error.message || '获取用户信息失败',
					icon: 'none'
				})
				return Promise.reject(error)
			}
		},

		clearUserInfo() {
			console.log('清除用户信息')
			this.token = ''
			this.userName = ''
			this.imgHeader = ''
			this.sex = ''
			this.ifTourist = ''
			this.userId = ''
			this.userDetail = {}
			
			try {
				uni.removeStorageSync('token')
				uni.removeStorageSync('userName')
				uni.removeStorageSync('userId')
				uni.removeStorageSync('imgHeader')
				uni.removeStorageSync('sex')
				uni.removeStorageSync('ifTourist')
				uni.removeStorageSync('userDetail')
				
				// 清除webset配置
				const websetStore = useWebsetStore()
				websetStore.clearWebset()
				
				console.log('清除存储成功')
			} catch (error) {
				console.error('清除存储失败:', error)
			}
		},

		logOut() {
			this.clearUserInfo()
			uni.reLaunch({
				url: '/pagesub/login/index'
			})
		}
	}
})