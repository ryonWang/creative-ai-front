<template>
<view class="page">
	<u-navbar title="拍摄说明" bgColor="#ffffff" :border="false" :autoBack="true"></u-navbar>
	<scroll-view scroll-y class="content">
		<!-- 正确示范 -->
		<view class="guide-section">
			<view class="section-title">
				<text class="title-text">正确示范</text>
				<text class="title-tag correct">推荐</text>
			</view>
			<view class="image-grid">
				<view class="grid-item">
					<image src="/static/images/guide/biaozhun1.png" mode="aspectFit" class="grid-image"></image>
					<view class="grid-desc">
						<u-icon name="checkmark-circle" color="#4CAF50" size="32"></u-icon>
						<text>正面全身照，姿势自然</text>
					</view>
				</view>
				<view class="grid-item">
					<image src="/static/images/guide/biaozhun2.png" mode="aspectFit" class="grid-image"></image>
					<view class="grid-desc">
						<u-icon name="checkmark-circle" color="#4CAF50" size="32"></u-icon>
						<text>手臂放松，展示完整</text>
					</view>
				</view>
				<view class="grid-item">
					<image src="/static/images/guide/biaozhun3.png" mode="aspectFit" class="grid-image"></image>
					<view class="grid-desc">
						<u-icon name="checkmark-circle" color="#4CAF50" size="32"></u-icon>
						<text>6岁+以上</text>
					</view>
				</view>
				<view class="grid-item">
					<image src="/static/images/guide/biaozhun4.png" mode="aspectFit" class="grid-image"></image>
					<view class="grid-desc">
						<u-icon name="checkmark-circle" color="#4CAF50" size="32"></u-icon>
						<text>真人拍摄，不要使用AI</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 错误示范 -->
		<view class="guide-section">
			<view class="section-title">
				<text class="title-text">错误示范</text>
				<text class="title-tag incorrect">避免</text>
			</view>
			<view class="image-grid">
				<view class="grid-item">
					<image src="/static/images/guide/error1.png" mode="aspectFit" class="grid-image"></image>
					<view class="grid-desc">
						<u-icon name="close-circle" color="#FF5252" size="32"></u-icon>
						<text>非正面全身照</text>
					</view>
				</view>
				<view class="grid-item">
					<image src="/static/images/guide/error2.png" mode="aspectFit" class="grid-image"></image>
					<view class="grid-desc">
						<u-icon name="close-circle" color="#FF5252" size="32"></u-icon>
						<text>多人照片</text>
					</view>
				</view>
				<view class="grid-item">
					<image src="/static/images/guide/error3.png" mode="aspectFit" class="grid-image"></image>
					<view class="grid-desc">
						<u-icon name="close-circle" color="#FF5252" size="32"></u-icon>
						<text>人物服装遮挡</text>
					</view>
				</view>
				<view class="grid-item">
					<image src="/static/images/guide/error4.png" mode="aspectFit" class="grid-image"></image>
					<view class="grid-desc">
						<u-icon name="close-circle" color="#FF5252" size="32"></u-icon>
						<text>光线过暗/模糊不清</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 基本要求 -->
		<view class="guide-section">
			<view class="section-title">
				<text class="title-text">基本要求</text>
			</view>
			<view class="requirement-card">
				<view class="requirement-item">
					<u-icon name="photo" color="#f32b99" size="40"></u-icon>
					<text class="item-title">图片要求</text>
					<text class="item-desc">单张人物照片，5KB~5MB</text>
				</view>
				<view class="requirement-item">
					<u-icon name="grid" color="#f32b99" size="40"></u-icon>
					<text class="item-title">尺寸要求</text>
					<text class="item-desc">最小 150*150px，最大边长 4096px</text>
				</view>
				<view class="requirement-item">
					<u-icon name="file-text" color="#f32b99" size="40"></u-icon>
					<text class="item-title">格式支持</text>
					<text class="item-desc">jpg、jpeg、png、bmp、heic</text>
				</view>
			</view>
		</view>

		<!-- 拍摄建议 -->
		<view class="guide-section">
			<view class="section-title">
				<text class="title-text">拍摄建议</text>
			</view>
			<view class="tips-list">
				<view class="tip-item">
					<u-icon name="checkmark" color="#f32b99" size="32"></u-icon>
					<text>选择光线充足的环境</text>
				</view>
				<view class="tip-item">
					<u-icon name="checkmark" color="#f32b99" size="32"></u-icon>
					<text>背景简单纯净为佳</text>
				</view>
				<view class="tip-item">
					<u-icon name="checkmark" color="#f32b99" size="32"></u-icon>
					<text>穿着贴身但不要过于宽松的衣物</text>
				</view>
			</view>
		</view>

		<!-- 底部占位，防止按钮遮挡内容 -->
		<view style="height: 180rpx;"></view>
	</scroll-view>

	<!-- 底部按钮 -->
	<view class="bottom-action">
		<view class="confirm-btn" @click="showActionSheet">开始拍摄</view>
	</view>

	<!-- 底部弹出层 -->
	<u-action-sheet
		:show="showActions"
		:actions="actions"
		@close="showActions = false"
		@select="handleActionSelect"
		cancelText="取消"
	></u-action-sheet>
</view>
</template>

<script setup>
import { ref } from 'vue'
import { useWebsetStore } from '@/stores'
import { useFitStore } from '@/stores/fit'

const showActions = ref(false)
const imageUrl = useWebsetStore().staticWebsite
const fitStore = useFitStore()

const actions = [
	{ name: '从照片获取', color: '#f32b99' },
	{ name: '摄像头拍摄', color: '#f32b99' }
]

const showActionSheet = () => {
	showActions.value = true
}

const handleActionSelect = (e) => {
	if (e.name === '从照片获取') {
		uni.chooseImage({
			count: 1,
			sourceType: ['album'],
			success: (res) => {
				const tempFilePath = res.tempFilePaths[0]
				// 存储到 store
				fitStore.setModelImage(tempFilePath)
				// 跳转到服装选择页面
				uni.navigateTo({
					url: '/pagesub/fit/clothes'
				})
			},
			fail: (err) => {
				if (err.errMsg.includes('authorize')) {
					uni.showModal({
						title: '提示',
						content: '需要访问您的相册权限，是否去设置？',
						success: (res) => {
							if (res.confirm) {
								uni.openSetting()
							}
						}
					})
				}
			}
		})
	} else if (e.name === '摄像头拍摄') {
		uni.chooseImage({
			count: 1,
			sourceType: ['camera'],
			success: (res) => {
				const tempFilePath = res.tempFilePaths[0]
				// 存储到 store
				fitStore.setModelImage(tempFilePath)
				// 跳转到服装选择页面
				uni.navigateTo({
					url: '/pagesub/fit/clothes'
				})
			},
			fail: (err) => {
				if (err.errMsg.includes('authorize')) {
					uni.showModal({
						title: '提示',
						content: '需要访问您的相机权限，是否去设置？',
						success: (res) => {
							if (res.confirm) {
								uni.openSetting()
							}
						}
					})
				}
			}
		})
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	background-color: #ffffff;
	
	.content {
		height: calc(100vh - 44px);
		padding: 30rpx;
	}
	
	.guide-section {
		margin-bottom: 50rpx;
		
		.section-title {
			display: flex;
			align-items: center;
			margin-bottom: 30rpx;
			
			.title-text {
				font-size: 36rpx;
				font-weight: bold;
				color: #333;
				margin-right: 16rpx;
			}
			
			.title-tag {
				padding: 4rpx 16rpx;
				border-radius: 100rpx;
				font-size: 24rpx;
				
				&.correct {
					background: rgba(76, 175, 80, 0.1);
					color: #4CAF50;
				}
				
				&.incorrect {
					background: rgba(255, 82, 82, 0.1);
					color: #FF5252;
				}
			}
		}
		
		.image-grid {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 20rpx;
			
			.grid-item {
				background: #f8f8f8;
				border-radius: 20rpx;
				overflow: hidden;
				
				.grid-image {
					width: 100%;
					height: 400rpx;
					background: #eee;
					object-fit: cover; // 确保图片填充整个容器
				}
				
				.grid-desc {
					padding: 20rpx;
					display: flex;
					align-items: center;
					gap: 12rpx;
					font-size: 26rpx;
					color: #666;
					min-height: 88rpx; // 固定描述区域高度
				}
			}
		}
		
		.requirement-card {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 20rpx;
			background: #f8f8f8;
			border-radius: 20rpx;
			padding: 30rpx;
			
			.requirement-item {
				display: flex;
				flex-direction: column;
				align-items: center;
				text-align: center;
				
				.item-title {
					font-size: 28rpx;
					font-weight: bold;
					color: #333;
					margin: 16rpx 0 8rpx;
				}
				
				.item-desc {
					font-size: 24rpx;
					color: #666;
					line-height: 1.4;
				}
			}
		}
		
		.tips-list {
			background: #f8f8f8;
			border-radius: 20rpx;
			padding: 30rpx;
			
			.tip-item {
				display: flex;
				align-items: center;
				gap: 16rpx;
				margin-bottom: 20rpx;
				font-size: 28rpx;
				color: #666;
				
				&:last-child {
					margin-bottom: 0;
				}
			}
		}
	}
	
	.bottom-action {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 30rpx;
		background: #ffffff;
		box-shadow: 0 -2rpx 20rpx rgba(0, 0, 0, 0.05);
		
		.confirm-btn {
			background: linear-gradient(135deg, #f32b99, #f6a1d0);
			height: 88rpx;
			border-radius: 44rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #ffffff;
			font-size: 32rpx;
			font-weight: bold;
			box-shadow: 0 8rpx 16rpx rgba(243, 43, 153, 0.2);
			
			&:active {
				transform: scale(0.98);
			}
		}
	}
}
</style> 