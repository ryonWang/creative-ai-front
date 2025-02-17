<template>
<view class="page">
	<view class="header">
		<view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
		<view class="nav-bar">
			<text class="title">我的</text>
			<view class="right-icons">
				<u-icon name="edit-pen" size="36" color="#333"></u-icon>
				<u-icon name="setting" size="36" color="#333" class="setting-icon"></u-icon>
			</view>
		</view>

		<!-- 用户信息区域 -->
		<view class="user-info" v-if="user.isLogin">
			<view class="avatar-wrap">
				<u-avatar :text="user.info.name.slice(0,1)" 
						fontSize="44rpx" 
						size="140rpx"
						:bgColor="avatarBgColor">
				</u-avatar>
			</view>
			<view class="info-content">
				<text class="name">{{user.info.name}}</text>
				<text class="desc">个人主页 ></text>
			</view>
		</view>
	</view>

	<!-- 数据统计 -->
	<view class="stats-bar">
		<view class="stat-item">
			<text class="value">0</text>
			<text class="label">关注</text>
		</view>
		<view class="stat-item">
			<text class="value">2</text>
			<text class="label">粉丝</text>
		</view>
		<view class="stat-item">
			<text class="value">35</text>
			<text class="label">获赞过</text>
		</view>
	</view>

	<!-- 收藏与历史 -->
	<view class="quick-entries">
		<view class="entry-item">
			<image src="/static/icon/like.png" class="icon"></image>
			<text>我的喜欢</text>
		</view>
		<view class="entry-item">
			<image src="/static/icon/history.png" class="icon"></image>
			<text>我的收藏</text>
		</view>
	</view>

	<!-- VIP横幅 -->
	<view class="vip-banner">
		<view class="left">
			<image src="/static/icon/vip.png" class="vip-icon"></image>
			<text>VIP会员上线了</text>
		</view>
		<view class="right">
			<text class="go-text">GO</text>
		</view>
	</view>

	<!-- 功能网格 -->
	<view class="function-grid">
		<view class="grid-item" v-for="(item, index) in quickActions" :key="index" @click="handleQuickAction(item.title)">
			<image :src="item.icon" class="icon"></image>
			<text>{{item.title}}</text>
		</view>
	</view>

	<!-- 功能列表 -->
	<view class="menu-list">
		<view class="menu-item" v-for="(item, index) in menuItems" :key="index" @click="handleMenuItem(item)">
			<view class="left">
				<image :src="item.icon" class="icon"></image>
				<text>{{item.title}}</text>
			</view>
			<u-icon name="arrow-right" size="28" color="#999"></u-icon>
		</view>
	</view>
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
const statusBarHeight = ref(0)

// 特权订单数据
const privilegeOrders = ref([
	{ title: '充值订单', icon: 'recharge', color: '#f32b99' },
	{ title: '优惠券订单', icon: 'coupon', color: '#FF8120' },
	// { title: '加油订单', icon: 'gas', color: '#3B71EC' },
	// { title: '话费订单', icon: 'phone', color: '#32C9AA' }
])

// 赚钱工具数据
const moneyTools = ref([
	{ title: '邀请好友', icon: 'invite', color: '#f32b99' },
	{ title: '地推宣传', icon: 'promote', color: '#FF8120' },
	{ title: '进群领福利', icon: 'gift', color: '#3B71EC' },
	{ title: '完善邀请码', icon: 'code', color: '#32C9AA' }
])

const quickActions = ref([
	{ title: '足迹', icon: '/static/icon/footprint.png' },
	{ title: '会员中心', icon: '/static/icon/vip.png' },
	{ title: '任务中心', icon: '/static/icon/task.png' },
	{ title: '评论', icon: '/static/icon/comment.png' },
	{ title: '草稿箱', icon: '/static/icon/draft.png' },
	{ title: '设置', icon: '/static/icon/setting.png' }
])

const menuItems = ref([
	{ title: '创建的圈子', icon: '/static/icon/circle.png' },
	{ title: '帮助与反馈', icon: '/static/icon/help.png' },
	{ title: '即刻小贴部', icon: '/static/icon/instant.png' },
	{ title: '把即刻推荐给朋友', icon: '/static/icon/share.png' }
])

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

// 新增方法
function handleQuickAction(type) {
	console.log('Quick action clicked:', type)
	// 根据类型处理不同的跳转逻辑
	switch(type) {
		case '收益记录':
			uni.navigateTo({url: '/pagesub/my/earnings'})
			break
		case '我的订单':
			uni.navigateTo({url: '/pagesub/my/orders'})
			break
		case '我的团队':
			uni.navigateTo({url: '/pagesub/my/team'})
			break
	}
}

function handleGridItem(item) {
	console.log('Grid item clicked:', item)
	// 这里可以根据item.title来处理不同的跳转逻辑
	uni.showToast({
		title: '功能开发中',
		icon: 'none'
	})
}

function handleMenuItem(item) {
	console.log('Menu item clicked:', item)
	// 这里可以根据item.title来处理不同的跳转逻辑
	uni.showToast({
		title: '功能开发中',
		icon: 'none'
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
	
	// 获取状态栏高度
	statusBarHeight.value = uni.getSystemInfoSync().statusBarHeight
})
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	background: #f8f8f8;
}

.header {
	background: #ffe066;
	padding: 0 30rpx;
	padding-bottom: 40rpx;

	.nav-bar {
		height: 88rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 20rpx;

		.title {
			font-size: 36rpx;
			font-weight: 600;
			color: #333;
		}

		.right-icons {
			display: flex;
			align-items: center;
			gap: 30rpx;
		}
	}

	.user-info {
		display: flex;
		align-items: center;
		margin-top: 30rpx;

		.avatar-wrap {
			margin-right: 24rpx;
		}

		.info-content {
			.name {
				font-size: 36rpx;
				font-weight: 600;
				color: #333;
				margin-bottom: 8rpx;
				display: block;
			}

			.desc {
				font-size: 28rpx;
				color: #666;
			}
		}
	}
}

.stats-bar {
	display: flex;
	justify-content: space-around;
	padding: 30rpx 0;
	background: #fff;
	margin-bottom: 20rpx;

	.stat-item {
		display: flex;
		flex-direction: column;
		align-items: center;

		.value {
			font-size: 36rpx;
			font-weight: 600;
			color: #333;
			margin-bottom: 8rpx;
		}

		.label {
			font-size: 28rpx;
			color: #666;
		}
	}
}

.quick-entries {
	display: flex;
	background: #fff;
	padding: 30rpx;
	margin-bottom: 20rpx;

	.entry-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;

		&:first-child::after {
			content: '';
			position: absolute;
			right: 0;
			top: 50%;
			transform: translateY(-50%);
			width: 2rpx;
			height: 40%;
			background: #eee;
		}

		.icon {
			width: 80rpx;
			height: 80rpx;
			margin-bottom: 16rpx;
		}

		text {
			font-size: 28rpx;
			color: #333;
		}
	}
}

.vip-banner {
	margin: 0 30rpx;
	background: linear-gradient(90deg, #FFE5B4, #FFD700);
	border-radius: 20rpx;
	padding: 24rpx 30rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;

	.left {
		display: flex;
		align-items: center;
		gap: 16rpx;

		.vip-icon {
			width: 48rpx;
			height: 48rpx;
		}

		text {
			font-size: 28rpx;
			color: #333;
			font-weight: 500;
		}
	}

	.right {
		.go-text {
			font-size: 32rpx;
			font-weight: 600;
			color: #333;
		}
	}
}

.function-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	background: #fff;
	padding: 30rpx;
	gap: 30rpx;
	margin-bottom: 20rpx;

	.grid-item {
		display: flex;
		flex-direction: column;
		align-items: center;

		.icon {
			width: 80rpx;
			height: 80rpx;
			margin-bottom: 16rpx;
		}

		text {
			font-size: 26rpx;
			color: #333;
		}
	}
}

.menu-list {
	background: #fff;
	padding: 0 30rpx;

	.menu-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx 0;
		border-bottom: 2rpx solid #f5f5f5;

		&:last-child {
			border-bottom: none;
		}

		.left {
			display: flex;
			align-items: center;
			gap: 20rpx;

			.icon {
				width: 40rpx;
				height: 40rpx;
			}

			text {
				font-size: 28rpx;
				color: #333;
			}
		}
	}
}
</style>