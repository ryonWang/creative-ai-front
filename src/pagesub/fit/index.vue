<template>
<view class="page">
	<u-navbar title="选择模特" bgColor="#ffffff" :border="false" :autoBack="true"></u-navbar>
	<view class="content">
		<view class="tab-wrapper">
			<view class="tab-container">
				<view 
					v-for="(tab, index) in tabsList" 
					:key="index"
					class="tab-item"
					:class="{ active: currentTab === index }"
					@click="handleTabChange(index)"
				>
					<text class="tab-text">{{ tab.name }}</text>
					<view class="tab-line" v-if="currentTab === index"></view>
				</view>
			</view>
		</view>
		
		<view class="model-grid">
			<view v-for="model in currentModels" :key="model.id" class="model-item" @click="goToDetail(model)">
				<image :src="model.image" mode="aspectFill" class="model-image"></image>
				<view class="model-name">{{ model.name }}</view>
			</view>
		</view>

		<view class="be-model-btn-wrapper">
			<view class="be-model-btn" @click="goToGuide">
				<view class="btn-content">
					<view class="btn-title">自己当模特</view>
					<view class="btn-subtitle">AI智能换装 解锁专属穿搭</view>
				</view>
				<view class="btn-icon">
					<text class="icon-text pulse">试一试</text>
					<text class="icon-arrow" style="font-weight: bold;">→</text>
				</view>
			</view>
		</view>
	</view>
</view>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { goTo } from '@/utils/helper.js'

const tabsList = [
	{ name: '女模特' },
	{ name: '男模特' }
]

const currentTab = ref(0)

const modelList = [
	{ id: 'eva-l', name: 'Eva', image: '/static/images/models/eva-l/1.png', gender: 'female', totalImages: 3 },
	{ id: 'rouyan-l', name: '柔研', image: '/static/images/models/rouyan-l/1.png', gender: 'female', totalImages: 3 },
	{ id: 'yaqi-l', name: '雅琪', image: '/static/images/models/yaqi-l/1.png', gender: 'female', totalImages: 2 },
	{ id: 'yufei-l', name: '雨霏', image: '/static/images/models/yufei-l/1.png', gender: 'female', totalImages: 2 },
	{ id: 'simon-m', name: 'Simon', image: '/static/images/models/simon-m/1.png', gender: 'male', totalImages: 2 },
	{ id: 'xiaoxuan-m', name: '小轩', image: '/static/images/models/xiaoxuan-m/1.png', gender: 'male', totalImages: 3 },
	{ id: 'yifeng-m', name: '易峰', image: '/static/images/models/yifeng-m/1.png', gender: 'male', totalImages: 3 },
]

const currentModels = computed(() => {
	return modelList.filter(model => 
		currentTab.value === 0 ? model.gender === 'female' : model.gender === 'male'
	)
})

const handleTabChange = (index) => {
	currentTab.value = index
}

const goToDetail = (model) => {
	uni.navigateTo({
		url: `/pagesub/fit/detail?id=${model.id}&name=${model.name}&totalImages=${model.totalImages}`
	})
}

const goToGuide = () => {
	uni.navigateTo({
		url: '/pagesub/fit/guide'
	})
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	background-color: #f8f8f8;
	
	.content {
		padding: 20rpx;
	}
	
	.tab-wrapper {
		margin: 20rpx 0 40rpx;
		display: flex;
		justify-content: center;
		
		.tab-container {
			display: flex;
			background: rgba(243, 43, 153, 0.1);
			border-radius: 100rpx;
			padding: 8rpx;
			position: relative;
			box-shadow: 0 4rpx 12rpx rgba(243, 43, 153, 0.1);
		}
		
		.tab-item {
			position: relative;
			padding: 16rpx 60rpx;
			border-radius: 100rpx;
			transition: all 0.3s ease;
			
			&.active {
				background: #ffffff;
				box-shadow: 0 4rpx 12rpx rgba(243, 43, 153, 0.2);
				
				.tab-text {
					color: #f32b99;
					font-weight: bold;
					transform: scale(1.05);
				}
			}
			
			.tab-text {
				font-size: 28rpx;
				color: #666;
				transition: all 0.3s ease;
			}
			
			&:active {
				transform: scale(0.98);
			}
		}
	}
	
	.model-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 20rpx;
		padding: 20rpx 0;
	}
	
	.model-item {
		background: #ffffff;
		border-radius: 20rpx;
		overflow: hidden;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
		transition: transform 0.3s ease;
		
		&:active {
			transform: scale(0.98);
		}
	}
	
	.model-image {
		width: 100%;
		height: 400rpx;
		background: #f5f5f5;
	}
	
	.model-name {
		padding: 20rpx;
		text-align: center;
		font-size: 28rpx;
		color: #333;
		font-weight: bold;
	}
}

.be-model-btn-wrapper {
	display: flex;
	justify-content: center;
	margin: 40rpx 0;
	padding: 0 30rpx;
	
	.be-model-btn {
		width: 100%;
		background: linear-gradient(135deg, rgba(243, 43, 153, 0.03) 0%, rgba(243, 43, 153, 0.1) 100%);
		padding: 40rpx;
		border-radius: 30rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-shadow: 0 8rpx 32rpx rgba(243, 43, 153, 0.1);
		border: 2rpx solid rgba(243, 43, 153, 0.1);
		backdrop-filter: blur(10rpx);
		transition: all 0.3s ease;
		position: relative;
		overflow: hidden;
		
		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: linear-gradient(135deg, #f32b99 0%, #f6a1d0 100%);
			opacity: 0;
			transition: opacity 0.3s ease;
			z-index: 1;
		}
		
		.btn-content {
			position: relative;
			z-index: 2;
		}
		
		
		.btn-title {
			font-size: 36rpx;
			font-weight: bold;
			color: #f32b99;
			margin-bottom: 8rpx;
			transition: all 0.3s ease;
		}
		
		.btn-subtitle {
			font-size: 24rpx;
			color: #666;
			transition: all 0.3s ease;
		}
		
		.btn-icon {
			position: relative;
			z-index: 2;
			display: flex;
			align-items: center;
			background: #f32b99;
			padding: 16rpx 32rpx;
			border-radius: 100rpx;
			transform: translateX(0);
			transition: all 0.3s ease;
			
			.icon-text {
				color: #fff;
				font-size: 26rpx;
				font-weight: bold;
				margin-right: 8rpx;
			}
			.pulse {
				animation: pulse 2s infinite;
			}
			
			.icon-arrow {
				color: #fff;
				font-size: 26rpx;
				font-weight: bold;
				transition: transform 0.3s ease;
			}
		}
		
		&:active {
			transform: scale(0.98);
			background: linear-gradient(135deg, #f32b99 0%, #f6a1d0 100%);
			
			.btn-title {
				color: #ffffff;
			}
			
			.btn-subtitle {
				color: rgba(255, 255, 255, 0.8);
			}
			
			.btn-icon {
				background: #ffffff;
				transform: translateX(10rpx);
				
				.icon-text, .icon-arrow {
					color: #f32b99;
				}
				
				.icon-arrow {
					transform: translateX(4rpx);
				}
			}
		}
	}
}
@keyframes pulse {
	0% { transform: scale(1); }
	50% { transform: scale(1.05); }
	100% { transform: scale(1); }
}
</style> 