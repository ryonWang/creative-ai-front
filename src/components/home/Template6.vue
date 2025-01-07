<template>
<view class="page">
	<image src="/static/images/template/bg6.jpg" class="bg"></image>
	<view class="content">
		<!-- 顶部header -->
		<u-navbar bgColor="transparent" title="" titleStyle="font-size:36rpx;font-weight:bold;color:#333" :fixed="false">
			<template #left><text style="font-size: 36rpx;font-weight: bold;color: #fff">创意宝</text></template>
		</u-navbar>
		<!-- 轮播图插槽 -->
		<view class="swiperBox">
			<swiper class="swiper" 
				:indicator-dots="true" 
				:autoplay="true" 
				:interval="3000" 
				:duration="500"
				indicator-active-color="#f32b99"
				indicator-color="rgba(255,255,255,0.6)"
				:circular="true">
				<swiper-item v-for="(item, index) in bannerList" :key="index" class="swiper-item">
					<image :src="item.image" mode="aspectFill" class="swiper-image" @click="handleBannerClick(item)"></image>
					<view class="swiper-caption">
						<text class="caption-text">{{ item.title || '精彩活动' }}</text>
					</view>
				</swiper-item>
			</swiper>
		</view>
		
		<!-- 通知栏 -->
		<view class="notification-bar" v-if="notifications.length">
			<view class="notification-icon">
				<u-icon name="volume" color="#f32b99" size="32"></u-icon>
			</view>
			<swiper 
				class="notification-swiper"
				:autoplay="true"
				:interval="4000"
				:duration="500"
				:circular="true"
				vertical="true">
				<swiper-item v-for="(notice, index) in notifications" :key="index" class="notification-item" @click="handleNoticeClick(notice)">
					<view class="notice-content">
						<text class="notice-tag" v-if="notice.type">{{notice.type}}</text>
						<text class="notice-text">{{notice.content}}</text>
					</view>
				</swiper-item>
			</swiper>
			<view class="notification-more" @click="viewAllNotices">
				<text>更多</text>
				<u-icon name="arrow-right" color="#666" size="24"></u-icon>
			</view>
		</view>
		<!-- 菜单按钮区 -->
		<view class="menuArea">
			<view class="menuFull m0 flex special-menu" :class="{'shine-effect': true}" @click="goTo('/pagesub/fit/index')" style="width: 100%; position: relative;">
				<view class="highlight-border"></view>
				<image src="/static/images/template/sticker6_0.png" class="stickerFull animate-float"></image>
				<view class="content-wrapper">
					<view class="h3Full">
						<text class="new-tag">New</text>
						AI试衣-你的智能衣橱
					</view>
					<view class="descFull">百变场合，智能穿搭！</view>
					<view class="btnFull pulse">立即体验</view>
				</view>
				<view class="corner-decoration"></view>
			</view>
			<view class="menu m1 flex" @click="goTo('/pagesub/voices/index')">
				<image src="/static/images/template/sticker6_1.png" class="sticker"></image>
				<view>
					<view class="h3">AI语音库</view>
					<view class="desc">话术支持循环播放</view>
					<view class="btn">立即体验</view>
				</view>
				
			</view>
			<view class="menu m2 flex" @click="goTo('/pagesub/reply/list')">
				<image src="/static/images/template/sticker6_2.png" class="sticker"></image>
				<view>
					<view class="h3">智能回复库</view>
					<view class="desc">评论区关键词回复</view>
					<view class="btn">立即体验</view>
				</view>
			</view>
			<view class="menu m3 flex" @click="goTo('/pagesub/store/tasks')">
				<image src="/static/images/template/sticker6_3.png" class="sticker"></image>
				<view>
					<view class="h3">话术库</view>
					<view class="desc">专业通用话术</view>
					<view class="btn">立即体验</view>
				</view>
			</view>
			<view class="menu m4 flex" @click="goTo('/pagesub/ai/index')">
				<image src="/static/images/template/sticker6_4.png" class="sticker"></image>
				<view>
					<view class="h3">AI创作</view>
					<view class="desc">定制不同行业文案</view>
					<view class="btn">立即体验</view>
				</view>
			</view>
			<view class="menu m5 flex" @click="goTo('/pagesub/common/voice')">
				<image src="/static/images/template/sticker6_5.png" class="sticker"></image>
				<view>
					<view class="h3">公共语音库</view>
					<view class="desc">专业通用语音</view>
					<view class="btn">立即体验</view>
				</view>
			</view>
			<view class="menu m6 flex" @click="goTo('/pagesub/goods/index')">
				<image src="/static/images/template/sticker6_6.png" class="sticker"></image>
				<view>
					<view class="h3">商品库</view>
					<view class="desc">添加或修改商品</view>
					<view class="btn">立即体验</view>
				</view>
			</view>
			
		</view>
	</view>
</view>
</template>

<script setup>
import { ref } from 'vue'
import { goTo } from '@/utils/helper.js'

const props = defineProps({
    statusBar: {
        type: Number,
        require: true,
    },
	app_name: {
		type: String,
		require: true,
	}
});

// 轮播图数据
const bannerList = ref([
	{
		id: 1,
		image: '/static/images/banner/banner1.png',
		url: '/pagesub/goods/index'
	},
	{
		id: 2,
		image: '/static/images/banner/banner2.png',
		url: '/pagesub/voices/index'
	},
	{
		id: 3,
		image: '/static/images/banner/banner3.png',
		url: '/pagesub/ai/index'
	},
	{
		id: 4,
		image: '/static/images/banner/banner4.png',
		url: '/pagesub/store/tasks'
	}
]);

// 轮播图点击处理
const handleBannerClick = (item) => {
	if (item.url) {
		goTo(item.url);
	}
};

// 通知数据
const notifications = ref([
	{
		id: 1,
		type: '活动',
		content: '新人专享优惠，立即体验AI智能搭配',
		url: '/pagesub/fit/index'
	},
	{
		id: 2,
		type: '公告',
		content: '系统升级公告：新增多款时尚单品',
		url: ''
	}
]);

// 通知点击处理
const handleNoticeClick = (notice) => {
	if (notice.url) {
		goTo(notice.url);
	}
};

// 查看所有通知
const viewAllNotices = () => {
	// 可以跳转到通知列表页
	uni.showToast({
		title: '功能开发中',
		icon: 'none'
	});
};
</script>

<style lang="scss" scoped>
.page{
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	padding-bottom: 20rpx;
	position: relative;
	.bg{
		width: 750rpx;
		height: 580rpx;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
	}
	.content{
		position: relative;
		z-index: 2;
		width: 750rpx;
		.swiperBox{
			width: 710rpx;
			height: 360rpx;
			box-sizing: border-box;
			margin: 20rpx auto 20rpx;
			border-radius: 24rpx;
			overflow: hidden;
			box-shadow: 0 8rpx 20rpx rgba(0,0,0,0.1);
			
			.swiper {
				width: 100%;
				height: 100%;
				
				.swiper-item {
					position: relative;
					
					.swiper-image {
						width: 100%;
						height: 100%;
						border-radius: 24rpx;
						transition: transform 0.3s ease;
						
						&:active {
							transform: scale(0.98);
						}
					}
					
					.swiper-caption {
						position: absolute;
						bottom: 0;
						left: 0;
						right: 0;
						padding: 20rpx 30rpx;
						background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);
						border-radius: 0 0 24rpx 24rpx;
						
						.caption-text {
							color: #fff;
							font-size: 28rpx;
							font-weight: 500;
						}
					}
				}
			}
		}
		.menuArea{
			display: flex;
			flex-wrap: wrap;
			padding: 0 20rpx;
			justify-content: space-between;
		}
		.menuFull{
			width: 100%;
			height: 182rpx;
			border-radius: 20rpx;
			margin-bottom: 10rpx;
			margin-top: 20rpx;
		}
		.menu{
			width: 341rpx;
			height: 182rpx;
			border-radius: 20rpx;
			margin-bottom: 14rpx;
			margin-top: 56rpx;
		}
		.stickerFull{
			width: 149rpx;
			height: 208rpx;
			margin-top: 50rpx;
			// position: absolute;
			// right: 12rpx;
			// bottom: 6rpx;
		}
		
		.sticker{
			width: 149rpx;
			height: 208rpx;
			margin-top: -30rpx;
			// position: absolute;
			// right: 12rpx;
			// bottom: 6rpx;
		}
		.h3Full{
			color: #333333;
			font-size: 28rpx;
			font-weight: 700;
			margin-top: 22rpx;
		}
		.h3{
			color: #333333;
			font-size: 36rpx;
			font-weight: 700;
			margin-top: 22rpx;
		}
		.desc{
			color: #666666;
			font-size: 22rpx;
			margin: 10rpx 0;
		}
		.descFull{
			color: #666666;
			font-size: 22rpx;
			margin: 10rpx 0;
			text-align: center;
		}
		.btn{
			width: 105rpx;
			height: 35rpx;
			border-radius: 17rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #fff;
			font-size: 18rpx;
		}
		.btnFull{
			width: 105rpx;
			height: 35rpx;
			border-radius: 17rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #fff;
			font-size: 18rpx;
		}
		
		.m1{
			background: linear-gradient(0deg,#f2f4ff 0%, #c9d8ff 100%);
			.h3,.desc{
				color: #4D51DF;
			}
			.btn{
				background: #4D51DF;
			}
		}
		.m2{
			background: linear-gradient(0deg,#fff5f3 0%, #ffddd6 100%);
			.h3,.desc{
				color: #FF5F4E;
			}
			.btn{
				background: #FF5F4E;
			}
		}
		.m3{
			background: linear-gradient(0deg,#eefaff 0%, #cdfaf2 100%);
			.h3,.desc{
				color: #32C9AA;
			}
			.btn{
				background: #32C9AA;
			}
		}
		.m4{
			background: linear-gradient(0deg,#f1fffb 0%, #b8f9ff 100%);
			.h3,.desc{
				color: #00C0D3;
			}
			.btn{
				background: #00C0D3;
			}
		}
		.m5{
			background: linear-gradient(0deg,#f2faff 0%, #c9dbff 100%);
			.h3,.desc{
				color: #3B71EC;
			}
			.btn{
				background: #3B71EC;
			}
		}
		.m6{
			background: linear-gradient(0deg,#fffaf2 0%, #ffebd6 100%);
			.h3,.desc{
				color: #FF8120;
			}
			.btn{
				background: #FF8120;
			}
		}
		.m0{
			background: linear-gradient(0deg,#f8a1ce 0%, #f32b9943 100%);
			.h3Full,.descFull{
				color: #f32b99;
			}
			.btnFull{
				background: #f32b99;
			}
		}
	}
}

.special-menu {
	overflow: hidden;
	box-shadow: 0 4rpx 20rpx rgba(255, 129, 32, 0.2);
	transition: transform 0.3s ease;
	padding: 0 40rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	
	&:active {
		transform: scale(0.98);
	}

	.content-wrapper {
		flex: 1;
		margin-left: 30rpx;
		padding-right: 60rpx;
	}
	
	.h3 {
		font-size: 44rpx;
		margin-top: 0;
		display: flex;
		align-items: center;
	}
	
	.desc {
		font-size: 26rpx;
		margin: 16rpx 0;
		color: #FF8120;
	}
	
	.btn {
		width: 140rpx;
		height: 46rpx;
		font-size: 22rpx;
		background: linear-gradient(90deg, #FF8120, #FF9D20);
		box-shadow: 0 4rpx 8rpx rgba(255, 129, 32, 0.2);
	}
}

.shine-effect {
	&::after {
		content: '';
		position: absolute;
		top: -100%;
		left: -100%;
		width: 50%;
		height: 200%;
		background: linear-gradient(
			to right,
			rgba(255,255,255,0) 0%,
			rgba(255,255,255,0.3) 50%,
			rgba(255,255,255,0) 100%
		);
		transform: rotate(45deg);
		animation: shine 3s infinite;
	}
}

.highlight-border {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	border: 2rpx solid rgba(255, 129, 32, 0.3);
	border-radius: 20rpx;
	animation: borderPulse 2s infinite;
}

.corner-decoration {
	position: absolute;
	right: 0;
	bottom: 0;
	width: 40rpx;
	height: 40rpx;
	border-right: 4rpx solid #f32b99;
	border-bottom: 4rpx solid #f32b99;
	border-radius: 0 0 20rpx 0;
	opacity: 0.6;
}

.new-tag {
	background: linear-gradient(90deg, #f32b99, #f6a1d0);
	color: white;
	font-size: 24rpx;
	padding: 6rpx 16rpx;
	border-radius: 20rpx;
	margin-right: 16rpx;
	vertical-align: middle;
	box-shadow: 0 4rpx 8rpx rgba(255, 32, 210, 0.2);
}

.animate-float {
	animation: float 3s ease-in-out infinite;
}

.pulse {
	animation: pulse 2s infinite;
}

@keyframes shine {
	0% { left: -100%; }
	100% { left: 200%; }
}

@keyframes float {
	0%, 100% { transform: translateY(0); }
	50% { transform: translateY(-10rpx); }
}

@keyframes pulse {
	0% { transform: scale(1); }
	50% { transform: scale(1.05); }
	100% { transform: scale(1); }
}

@keyframes borderPulse {
	0% { opacity: 0.3; }
	50% { opacity: 0.6; }
	100% { opacity: 0.3; }
}

.notification-bar {
	width: 710rpx;
	height: 80rpx;
	margin: 0 auto 12rpx;
	background: rgba(255,255,255,0.9);
	backdrop-filter: blur(10rpx);
	border-radius: 16rpx;
	display: flex;
	align-items: center;
	padding: 0 20rpx;
	box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
	
	.notification-icon {
		width: 60rpx;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.notification-swiper {
		flex: 1;
		height: 100%;
		
		.notification-item {
			display: flex;
			align-items: center;
			
			.notice-content {
				display: flex;
				align-items: center;
				
				.notice-tag {
					background: rgba(243,43,153,0.1);
					color: #f32b99;
					font-size: 22rpx;
					padding: 4rpx 12rpx;
					border-radius: 8rpx;
					margin-right: 12rpx;
				}
				
				.notice-text {
					font-size: 26rpx;
					color: #333;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}
		}
	}
	
	.notification-more {
		width: 100rpx;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		font-size: 24rpx;
		color: #666;
	}
}
</style>