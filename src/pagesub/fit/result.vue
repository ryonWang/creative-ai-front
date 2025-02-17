<template>
	<view class="page">
		<!-- 全屏图片展示 -->
		<view class="image-marker">
			<image 
				:src="resultImage" 
				mode="aspectFit" 
				class="result-image"
				:class="{ 'loaded': imageLoaded }"
				@load="handleImageLoad"
			></image>
			
			<!-- 标记点 -->
			<view 
				v-for="marker in markers" 
				:key="marker.id"
				class="marker"
				:style="{
					left: marker.x + '%',
					top: marker.y + '%'
				}"
				@tap="handleMarkerClick(marker)"
			>
				<view class="marker-content">
					<text class="marker-label">{{ marker.label }}</text>
					<text class="buy-text">买同款</text>
				</view>
			</view>
			
			<!-- 加载动画 -->
			<view class="loading-container" v-if="!imageLoaded">
				<view class="loading-icon">
					<view class="loading-circle"></view>
				</view>
				<text class="loading-text">图片加载中...</text>
			</view>
		</view>

		<!-- 右侧悬浮按钮组 -->
		<view class="action-buttons" :class="{ 'show': imageLoaded }">
			<view 
				v-for="(btn, index) in actionButtons" 
				:key="index"
				class="action-btn"
				:class="{ 'expand': activeButton === index }"
				@tap="handleAction(btn.action)"
				@touchstart="handleButtonHover(index)"
				@touchend="handleButtonLeave"
			>
				<text class="btn-text">{{ btn.text }}</text>
				<text class="btn-label" :class="{ 'show': activeButton === index }">{{ btn.label }}</text>
			</view>
		</view>

		<!-- 返回按钮 -->
		<view class="back-btn" @tap="handleBack">
			<text class="iconfont icon-arrow-left"></text>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 获取页面参数
const query = defineProps({
	task_id: {
		type: String,
		default: ''
	},
	image_url: {
		type: String,
		default: ''
	}
})

const resultImage = ref('')
const imageLoaded = ref(false)
const showLabels = ref(false)

// 添加激活按钮状态
const activeButton = ref(null)

// 修改操作按钮配置，使用文字替代图标
const actionButtons = [
	{ text: '保存', label: '保存到相册', action: 'save' },
	{ text: '分享', label: '分享', action: 'share' },
	{ text: '添加', label: '添加到衣橱', action: 'addToCloset' }
]

// 添加标记点数据
const markers = ref([
	{ 
		id: 'top', 
		x: 30, 
		y: 30, 
		label: '上装',
		type: 'top'
	},
	{ 
		id: 'bottom', 
		x: 60, 
		y: 60, 
		label: '下装',
		type: 'bottom'
	}
])

// 图片加载完成处理
const handleImageLoad = () => {
	imageLoaded.value = true
}

// 处理按钮悬浮
const handleButtonHover = (index) => {
	activeButton.value = index
}

const handleButtonLeave = () => {
	activeButton.value = null
}

// 修改分享方法
const handleAction = async (action) => {
	switch (action) {
		case 'save':
			try {
				// 使用 uni.downloadFile 先下载图片
				const downloadRes = await uni.downloadFile({
					url: resultImage.value,
					success: (res) => {
						if (res.statusCode === 200) {
							// 保存临时文件到相册
							uni.saveImageToPhotosAlbum({
								filePath: res.tempFilePath,
								success: () => {
									uni.showToast({
										title: '保存成功',
										icon: 'success'
									})
								},
								fail: () => {
									uni.showToast({
										title: '保存失败',
										icon: 'none'
									})
								}
							})
						}
					}
				})
			} catch (error) {
				uni.showToast({
					title: '保存失败',
					icon: 'none'
				})
			}
			break
			
		case 'share':
			// 使用 uni 小程序分享API
			uni.showShareMenu({
				withShareTicket: true,
				menus: ['shareAppMessage', 'shareTimeline']
			})
			break
			
		case 'addToCloset':
			// TODO: 实现添加到衣橱的逻辑
			uni.showToast({
				title: '已添加到衣橱',
				icon: 'success'
			})
			break
	}
}

// 处理标记点点击
const handleMarkerClick = (marker) => {
	uni.showToast({
		title: `即将跳转到${marker.label}购买页面`,
		icon: 'none'
	})
	// TODO: 实现跳转到购买页面的逻辑
}

// 返回上一页
const handleBack = () => {
	uni.navigateBack()
}

// 添加3D查看功能
const handle3DView = () => {
	uni.navigateTo({
		url: `/pagesub/fit/3d-view?image=${encodeURIComponent(resultImage.value)}`
	})
}

// 组件挂载时设置图片URL
onMounted(() => {
	if (query.image_url) {
		resultImage.value = decodeURIComponent(query.image_url)
	}
})

// 修改分享内容
defineExpose({
	onShareAppMessage() {
		return {
			title: '我在创意宝生成了一个至美穿搭，让我成为聚会的C位！',
			desc: '快来加入创意宝，AI穿搭，创意无限',
			path: `/pagesub/fit/result?image_url=${encodeURIComponent(resultImage.value)}`,
			imageUrl: resultImage.value
		}
	},
	onShareTimeline() {
		return {
			title: '我在创意宝生成了一个至美穿搭，让我成为聚会的C位！',
			query: `image_url=${encodeURIComponent(resultImage.value)}`,
			imageUrl: resultImage.value
		}
	}
})
</script>

<style lang="scss" scoped>
.page {
	width: 100vw;
	height: 100vh;
	background: #000000;
	position: relative;
	overflow: hidden;
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);
}

.image-marker {
	position: relative;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	
	.result-image {
		width: 100%;
		height: 100%;
		opacity: 0;
		transform: scale(0.95);
		transition: all 0.5s ease;
		
		&.loaded {
			opacity: 1;
			transform: scale(1);
		}
	}
	
	.marker {
		position: absolute;
		transform: translate(-50%, -50%);
		z-index: 10;
		transition: all 0.3s ease;
		
		&:active {
			transform: translate(-50%, -50%) scale(0.95);
		}
		
		.marker-content {
			background: rgba(243, 43, 153, 0.9);
			padding: 16rpx 24rpx;
			border-radius: 16rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.2);
			
			.marker-label {
				color: #fff;
				font-size: 24rpx;
				font-weight: 500;
			}
			
			.buy-text {
				font-size: 20rpx;
				color: rgba(255, 255, 255, 0.9);
				margin-top: 4rpx;
				background: rgba(255, 255, 255, 0.2);
				padding: 4rpx 12rpx;
				border-radius: 20rpx;
			}
		}
	}
}

.loading-container {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 20rpx;
	
	.loading-icon {
		width: 64rpx;
		height: 64rpx;
		margin-bottom: 20rpx;
		position: relative;
		
		.loading-circle {
			width: 100%;
			height: 100%;
			border: 4rpx solid rgba(255, 255, 255, 0.3);
			border-top-color: #ffffff;
			border-radius: 50%;
			animation: spin 1s linear infinite;
		}
	}
	
	.loading-text {
		color: #ffffff;
		font-size: 28rpx;
	}
}

@keyframes spin {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}

.action-buttons {
	position: fixed;
	right: 40rpx;
	top: 50%;
	transform: translateY(-50%);
	display: flex;
	flex-direction: column;
	gap: 30rpx;
	opacity: 0;
	transition: opacity 0.3s ease;
	z-index: 100;
	
	&.show {
		opacity: 1;
	}
	
	.action-btn {
		width: 100rpx;
		height: 100rpx;
		background: rgba(243, 43, 153, 0.9);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		transition: all 0.3s ease;
		cursor: pointer;
		
		&:active {
			transform: scale(0.95);
		}
		
		.btn-text {
			color: #ffffff;
			font-size: 28rpx;
			font-weight: 500;
			text-align: center;
		}
		
		.btn-label {
			position: absolute;
			right: 120rpx;
			background: rgba(0, 0, 0, 0.7);
			color: #ffffff;
			font-size: 24rpx;
			padding: 12rpx 24rpx;
			border-radius: 30rpx;
			white-space: nowrap;
			opacity: 0;
			transform: translateX(20rpx);
			
			&.show {
				opacity: 1;
				transform: translateX(0);
			}
		}
		
		// 添加按钮阴影效果
		box-shadow: 0 4rpx 12rpx rgba(243, 43, 153, 0.3);
		
		// 添加悬浮效果
		&:hover {
			transform: translateY(-2rpx);
			box-shadow: 0 6rpx 16rpx rgba(243, 43, 153, 0.4);
		}
	}
}

.back-btn {
	position: fixed;
	left: 40rpx;
	top: var(--status-bar-height, 40rpx);
	width: 80rpx;
	height: 80rpx;
	background: rgba(255, 255, 255, 0.9);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.3s ease;
	z-index: 100;
	
	&:active {
		transform: scale(0.95);
		background: rgba(255, 255, 255, 1);
	}
}

// 添加图标字体样式
.iconfont {
	font-family: "iconfont";
	font-size: 32rpx;
	color: #ffffff;
}

.icon-arrow-left:before {
	content: "\e6db";
}

.icon-download:before {
	content: "\e6d4";
}

.icon-share:before {
	content: "\e6d5";
}

.icon-heart:before {
	content: "\e6d6";
}

// 添加字体图标
@font-face {
	font-family: 'iconfont';
	src: url('//at.alicdn.com/t/font_3159451_1234567890.woff2') format('woff2'),
		 url('//at.alicdn.com/t/font_3159451_1234567890.woff') format('woff'),
		 url('//at.alicdn.com/t/font_3159451_1234567890.ttf') format('truetype');
}

.iconfont {
	font-family: "iconfont" !important;
	font-style: normal;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}
</style> 