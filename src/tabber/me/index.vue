<template>
<view class="page">
	<u-image width="100%" :height="410" src="/static/images/me/bg.jpg"></u-image>
	<view class="infoBox" v-if="user.isLogin">
		<u-avatar class="avatar" :text="user.info.name.slice(0,1)" fontSize="44rpx" size="120rpx" randomBgColor></u-avatar>
		<view class="username">
			<view class="account">{{user.info.name}}</view>
			<view class="id">ID:{{user.info.userId}}</view>
		</view>
		<u-button plain type="primary" shape="circle" class="exit" @click="handleLogout">退出登录</u-button>
	</view>
	<view class="infoBox" v-else @click="goToLogin">
		<u-avatar url="" size="120rpx"></u-avatar>
		<view class="username">
			<view class="account">您还未登录</view>
			<view class="id">请点击登录</view>
		</view>
	</view>
	<div class="function">
		<u-cell-group :border="false">
			<u-cell title="修改密码" size="large" isLink @click="showPwdPop = true" v-if="user.isLogin">
				<template #icon>
					<u-image :width="35" :height="35" src="/static/images/me/exchange.png"></u-image>
				</template>
			</u-cell>
			<u-cell title="用户隐私服务协议" size="large" isLink url="/pagesub/other/policy">
				<template #icon>
					<u-image :width="35" :height="35" src="/static/images/me/privacy.png"></u-image>
				</template>
			</u-cell>
			<u-cell title="关于我们" size="large" isLink url="/pagesub/other/about">
				<template #icon>
					<u-image :width="35" :height="35" src="/static/images/me/aboutus.png"></u-image>
				</template>
			</u-cell>
			<u-cell title="反馈" size="large" isLink url="/pagesub/other/feedback">
				<template #icon>
					<u-image :width="35" :height="35" src="/static/images/me/feedback.png"></u-image>
				</template>
			</u-cell>
			<u-cell title="版本号" size="large" :value="config.app_version">
				<template #icon>
					<u-image :width="35" :height="35" src="/static/images/me/about.png"></u-image>
				</template>
			</u-cell>
			<u-cell title="注销用户" size="large" isLink @click="deleteUser" v-if="user.isLogin&&is_ios">
				<template #icon>
					<u-image :width="35" :height="35" src="/static/images/me/about.png"></u-image>
				</template>
			</u-cell>
			<!-- <u-cell title="AI创作" size="large" isLink url="/pagesub/ai/index">
				<template #icon>
					<u-image :width="35" :height="35" src="/static/images/me/feedback.png"></u-image>
				</template>
			</u-cell>
			<u-cell title="公共语音库" size="large" isLink url="/pagesub/common/voice">
				<template #icon>
					<u-image :width="35" :height="35" src="/static/images/me/feedback.png"></u-image>
				</template>
			</u-cell> -->
		</u-cell-group>
	</div>
	<!-- 修改密码弹窗 -->
	<u-modal :show="showPwdPop" title="修改密码" showCancelButton @confirm="changePwdConfirm" @cancel="showPwdPop = false">
		<u--input
		    placeholder="请输入您的新密码"
		    border="surround"
		    v-model="password"
			type="password"
		></u--input>
	</u-modal>
</view>
</template>

<script setup>
import { onShow, onLoad } from '@dcloudio/uni-app'
import { useUserStore, useLiveStore, useConfigStore } from '@/stores/index'
import { closeWebsocket } from '@/utils/socket'
import { changePwd } from '@/api'

const user = useUserStore()
const config = useConfigStore()
const live = useLiveStore()
const showPwdPop = ref(false)
const password = ref('')
const is_ios = ref(false)

function goToLogin(){
	uni.navigateTo({url: '/pagesub/login/index'})
}

function handleLogout() {
	uni.showModal({
		title: '提示',
		content: '确定要退出登录吗？',
		success: (res) => {
			if (res.confirm) {
				user.logOut()
				uni.showToast({
					title: '已退出登录',
					icon: 'success',
					duration: 1500
				})
			}
		}
	})
}

function changePwdConfirm(){
	if(!password.value) return uni.showToast({title: '密码不能为空', icon: 'none'})
	changePwd(user.info.userId, {password: password.value}).then(res=>{
		if(res){
			showPwdPop.value = false
			uni.showToast({title: '修改密码成功', icon: 'success', duration: 1500})
			setTimeout(()=>{
				user.logOut()
				goToLogin()
			}, 1500)
		}
	})
}

function deleteUser(){
	uni.showModal({
		title: '警告',
		content: '注销用户操作，将删除当前登录账号的所有相关数据和资料，请谨慎操作是否继续？',
		confirmText: '确定',
		showCancel: true,
		success: res => {
			if(res.confirm){
				user.logOut()
				uni.showToast({title: '注销成功', icon: 'success', duration: 2000})
			}
		}
	})
}

onShow(()=>{
	// 每次显示页面时初始化store
	user.initStore()
})

onLoad(() => {
	// #ifdef APP-PLUS
	is_ios.value = plus.os.name === 'iOS'
	// #endif
})
</script>

<style lang="scss" scoped>
.page{
	background: #f8f8f8;
	min-height: 100vh;
	position: relative;
	.infoBox{
		display: flex;
		align-items: center;
		padding: 172rpx 20rpx 0;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		box-sizing: border-box;
		.avatar{
			width: 120rpx;
			height: 120rpx;
			border-radius: 50%;
			border: 2rpx solid #ffffff;
			flex-shrink: 0;
		}
		.username{
			flex: 1;
			margin: 0 20rpx;
			color: #fff;
		}
		.exit{
			width: 160rpx;
			height: 60rpx;
			background-color: #fff;
			font-size: 26rpx;
			color: #1e64fe;
			font-weight: 700;
		}
		.account{
			font-weight: 700;
			font-size: 36rpx;
		}
		.id{
			margin-top: 8rpx;
			font-size: 32rpx;
		}
	}
	.function{
		width: 710rpx;
		margin: -48rpx auto 0;
		background-color: #fff;
		position: relative;
		z-index: 1;
		border-radius: 20rpx;
		overflow: hidden;
		// box-shadow: 0 0 20rpx #ccc;
	}
}
</style>