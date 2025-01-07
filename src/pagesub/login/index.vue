<template>
	<view class="container content">
		<!-- <view :style="{paddingTop: `${statusBarHeight}px`}"></view> -->
		<view class="logo flex-rcc">
			<image src="/static/logo.png"></image>
		</view>
		
		<view class="formBox">
			<u--form labelPosition="left" :model="form" :rules="rules" ref="form1">
				<u-form-item label="" prop="userName">
					<u--input v-model="form.userName" shape="circle" :type="isLogin? 'text': 'number'" placeholder="请输入用户名/手机号" :maxlength="11" class="inputBox inputBox1" clearable></u--input>
				</u-form-item>
				<u-form-item label="" prop="password">
					<u--input v-model="form.password" :type="isAct?'text':'password'" shape="circle" placeholder="请输入密码" class="inputBox" clearable></u--input>
				</u-form-item>
				<u-form-item label="" prop="activation_code" v-if="!isLogin">
					<u--input v-model="form.activation_code" shape="circle" placeholder="请输入卡密" class="inputBox inputBox1" clearable></u--input>
				</u-form-item>
			</u--form>
		</view>
		<view class="tips" @click="isLogin=!isLogin">{{isLogin? '没有账号?去注册': '返回登录'}}</view>
		<u-button type="primary" size="large" :text="isLogin? '立即登录': '马上注册'" :disabled="isLoading" color="#2281FE" shape="circle" :loadingText="isLogin? '登录中...': '注册中...'" :loading="isLoading" @click="submitLogin"></u-button>
		
		<!-- 验证码组件 -->
		<verify ref="verifyRef" @success="onVerifySuccess" />
	</view>
</template>

<script setup>
	import { onLoad, onShow } from '@dcloudio/uni-app'
	import { login, activateCode, register } from '@/api'
	import { useUserStore } from '@/stores/index'
	import { setToken } from '@/utils/auth'
	import Verify from '@/components/verify/verify.vue'
	import { encrypt } from '@/utils/encrypt'
	
	const user = useUserStore()
	const show = ref(false)
	const code = ref('')
	const form = reactive({
			userName: '',
			password: '',
			activation_code: '',
			captcha: {
				captchaVerification: ''
			}
	})
	const isLogin = ref(true) 
	const form1 = ref(null)
	const isLoading = ref(false)
	const isAct = ref(false)
	const verifyRef = ref(null)
	
	// 页面加载时执行
	onLoad(() => {
		// 检查是否已登录
		if (user.isLogin) {
			uni.switchTab({
				url: '/tabber/index/index'
			})
		}
	})
	
	// 表单验证规则
	const rules = {
		'userName': {
			type: 'number',
			required: true,
			validator: (rule, value, callback) => {
				if(isLogin.value){
					return value!=='';
				}else{
					return uni.$u.test.mobile(value);
				}	
			},
			message: '用户名/手机号不正确',
			trigger: ['change','blur'],
		},
		'password': {
			type: 'string',
			required: true,
			message: '请输入密码',
			trigger: ['blur', 'change']
		},
		'activation_code': {
			type: 'string',
			required: true,
			message: '请输入卡密',
			trigger: ['blur', 'change']
		}
	}
	
	const submitLogin = () => {
		if(!form.userName) return uni.$u.toast('请输入正确的用户名!')
		if(!form.password) return uni.$u.toast('请输入密码!')
		if(!form.activation_code && !isLogin.value) return uni.$u.toast('请输入卡密!')
		
		if(isLogin.value) {
			// 显示验证码
			verifyRef.value.showVerify()
		} else {
			isLoading.value = true
			const registerData = {
				userName: form.userName,
				password: encrypt(form.password),
				activation_code: form.activation_code
			}
			register(registerData).then(res=>{
				if(res&&res.data){
					uni.$u.toast('注册成功,请登录!')
					isLogin.value = true
				}
			}).finally(()=>isLoading.value = false)
		}
	}
	
	// 验证码验证成功
	const onVerifySuccess = (data) => {
		if (!data || !data.captchaVerification) {
			uni.$u.toast('验证码验证失败')
			return
		}		
		isLoading.value = true
		const loginData = {
			userName: form.userName,
			password: encrypt(form.password),
			captcha: {
				captchaVerification: data.captchaVerification
			}
		}
		// 调用登录接口
		login(loginData).then(res => {
			console.log('登录接口返回数据:', res)
			if(res && res.data) {
				// 存储token
				setToken(res.data)
				
				// 显示成功提示
				uni.showToast({
					title: '登录成功，欢迎来到创意宝！',
					icon: 'success',
					duration: 1500
				})
				
				// 等待一段时间确保token已经被正确设置
				return new Promise(resolve => {
					setTimeout(async () => {
						try {
							// 获取用户信息
							await user.GetInfo()
							resolve()
						} catch (error) {
							console.error('获取用户信息失败:', error)
							throw error
						}
					}, 500)
				})
			}
		}).then(() => {
			// 跳转到首页
			setTimeout(() => {
				console.log('准备跳转，当前登录状态:', user.isLogin)
				uni.reLaunch({
					url: '/tabber/index/index',
					success: () => {
						console.log('跳转成功，当前登录状态:', user.isLogin)
					},
					fail: (err) => {
						console.error('跳转失败:', err)
					}
				})
			}, 1000)
		}).catch(err => {
			console.error('登录失败:', err)
			uni.$u.toast(err.message || '登录失败')
		}).finally(() => {
			isLoading.value = false
			form.captcha.captchaVerification = ''
		})
	}
</script>

<style lang="scss" scoped>
	.content {
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  padding: 252rpx 90rpx;
	  box-sizing: border-box;
	  background-color: #fff !important;
	  .logo{
		  width: 380rpx;
		  height: 180rpx;
		  background: #f0f6ff;
		  border-radius: 20rpx;
		  box-shadow: 0rpx 0rpx 10rpx rgba(205, 205, 205, 0.7);
		  image{
			  width: 100%;
			  height: 100%;
			  border-radius: 20rpx;
			  // border-radius: 50%;
		  }
	  }
	  .formBox{
		  width: 100%;
		  margin-top: 66rpx;
		  margin-bottom: 36rpx;
		  .inputBox{
			  height: 80rpx;
			  padding-left: 40rpx !important;
		  }
	  }
	  .tips{
		  font-size: 24rpx;
		  color: #2281FE;
		  text-decoration:underline;
		  margin-bottom: 36rpx;
	  }
	  .slot-content{
		  width: 100%;
		  padding: 40rpx;
	  }
	  .codeBox{
		  width: 100%;
		  padding: 20rpx !important;
	  }
	}
</style>