<template>
<view class="page">
	<u-navbar :title="modelName" bgColor="#ffffff" :border="false" :autoBack="true"></u-navbar>
	<view class="content">
		<swiper class="swiper" 
			:indicator-dots="true" 
			:autoplay="false"
			indicator-active-color="#f32b99"
			indicator-color="rgba(0,0,0,0.3)"
			:circular="true">
			<swiper-item v-for="index in totalImages" :key="index">
				<image :src="getModelImage(index)" mode="aspectFit" class="model-image"></image>
			</swiper-item>
		</swiper>
		
		<view class="model-info">
			<view class="info-header">
				<text class="model-title">{{ modelName }}</text>
				<view class="style-tags">
					<text class="tag" v-for="(style, index) in modelInfo.styles" :key="index">{{ style }}</text>
				</view>
			</view>
			
			<view class="info-grid">
				<view class="info-item">
					<text class="label">身高</text>
					<text class="value">{{ modelInfo.height }}cm</text>
				</view>
				<view class="info-item">
					<text class="label">体重</text>
					<text class="value">{{ modelInfo.weight }}kg</text>
				</view>
				<view class="info-item">
					<text class="label">三围</text>
					<text class="value">{{ modelInfo.measurements }}</text>
				</view>
			</view>
			
			<view class="body-features">
				<view class="feature-title">身材特征</view>
				<view class="feature-list">
					<view class="feature-item" v-for="(feature, index) in modelInfo.features" :key="index">
						<u-icon name="checkmark" color="#f32b99" size="28"></u-icon>
						<text>{{ feature }}</text>
					</view>
				</view>
			</view>
		</view>
		
		<view class="action-area">
			<view class="select-btn" @click="handleSelect">选择此模特</view>
		</view>
	</view>
</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useFitStore } from '@/stores/fit'

const fitStore = useFitStore()
const modelId = ref('')
const modelName = ref('')
const totalImages = ref(0)
const currentIndex = ref(0)

// 模拟模特数据，后续可从接口获取
const modelInfo = ref({
	height: 168,
	weight: 48,
	measurements: '88/66/89',
	styles: ['休闲风', '通勤风', '韩系'],
	features: [
		'标准矩形身材',
		'肩宽适中',
		'腿型笔直',
		'适合各类风格'
	]
})

onMounted(() => {
	const pages = getCurrentPages()
	const page = pages[pages.length - 1]
	const options = page.$page.options
	
	modelId.value = options.id
	modelName.value = options.name
	totalImages.value = parseInt(options.totalImages)
})

const getModelImage = (index) => {
	return `/static/images/models/${modelId.value}/${index}.png`
}

const handleThumbnailClick = (index) => {
	currentIndex.value = index
}

const handleSelect = () => {
	// 获取当前显示的模特图片
	const currentModelImage = getModelImage(currentIndex.value + 1)
	
	// 设置到 fitStore
	fitStore.setModelImage(currentModelImage)
	
	// 跳转到服装选择页面
	uni.navigateTo({
		url: '/pagesub/fit/clothes'
	})
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	background-color: #ffffff;
	
	.content {
		padding: 20rpx;
	}
	
	.swiper {
		width: 100%;
		height: 800rpx;
		background: #f8f8f8;
		border-radius: 20rpx;
		overflow: hidden;
	}
	
	.model-image {
		width: 100%;
		height: 100%;
	}
	
	.model-info {
		margin: 30rpx 0;
		padding: 30rpx;
		background: #f8f8f8;
		border-radius: 20rpx;
		
		.info-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 30rpx;
			
			.model-title {
				font-size: 36rpx;
				font-weight: bold;
				color: #333;
			}
			
			.style-tags {
				display: flex;
				gap: 12rpx;
				
				.tag {
					padding: 4rpx 16rpx;
					background: rgba(243, 43, 153, 0.1);
					color: #f32b99;
					border-radius: 100rpx;
					font-size: 24rpx;
				}
			}
		}
		
		.info-grid {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 20rpx;
			margin-bottom: 30rpx;
			
			.info-item {
				display: flex;
				flex-direction: column;
				align-items: center;
				padding: 20rpx;
				background: #ffffff;
				border-radius: 16rpx;
				
				.label {
					font-size: 24rpx;
					color: #666;
					margin-bottom: 8rpx;
				}
				
				.value {
					font-size: 32rpx;
					color: #333;
					font-weight: bold;
				}
			}
		}
		
		.body-features {
			.feature-title {
				font-size: 28rpx;
				font-weight: bold;
				color: #333;
				margin-bottom: 20rpx;
			}
			
			.feature-list {
				display: grid;
				grid-template-columns: repeat(2, 1fr);
				gap: 16rpx;
				
				.feature-item {
					display: flex;
					align-items: center;
					gap: 8rpx;
					font-size: 26rpx;
					color: #666;
				}
			}
		}
	}
	
	.action-area {
		padding: 40rpx 0;
		display: flex;
		justify-content: center;
	}
	
	.select-btn {
		background: linear-gradient(90deg, #f32b99, #f6a1d0);
		color: #ffffff;
		padding: 24rpx 100rpx;
		border-radius: 100rpx;
		font-size: 32rpx;
		font-weight: bold;
		box-shadow: 0 8rpx 16rpx rgba(243, 43, 153, 0.2);
		
		&:active {
			transform: scale(0.98);
		}
	}
}
</style> 