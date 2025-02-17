<template>
<view class="page">
	<u-navbar title="选择服装" bgColor="#ffffff" :border="false" :autoBack="true"></u-navbar>
	<view class="content">
		<!-- 左侧分类 -->
		<scroll-view scroll-y class="category-list">
			<view 
				v-for="(category, index) in categories" 
				:key="index"
				class="category-item"
				:class="{ active: currentCategory === index }"
				@click="handleCategoryChange(index)"
			>
				<text>{{ category.name }}</text>
			</view>
			
			<!-- 添加预览区域 -->
			<view class="preview-section">
				<view class="preview-title">已选择</view>
				<view class="preview-grid">
					<!-- 模特预览 -->
					<view class="preview-item model-preview" v-if="fitStore.modelImage">
						<image :src="fitStore.modelImage" mode="aspectFill" class="preview-image"></image>
						<text class="preview-label">模特</text>
					</view>
					<!-- 上装预览 -->
					<view class="preview-item clothes-preview" v-if="fitStore.topImage">
						<image :src="fitStore.topImage" mode="aspectFill" class="preview-image"></image>
						<text class="preview-label">上装</text>
					</view>
					<!-- 下装预览 -->
					<view class="preview-item clothes-preview" v-if="fitStore.bottomImage">
						<image :src="fitStore.bottomImage" mode="aspectFill" class="preview-image"></image>
						<text class="preview-label">下装</text>
					</view>
				</view>
			</view>
		</scroll-view>
		
		<!-- 右侧内容 -->
		<scroll-view scroll-y class="clothes-list">
			<!-- 我的服装选择区域 -->
			<template v-if="currentCategory === 3">
				<view class="my-clothes">
					<view class="label-section">
						<view class="label-title">已选择</view>
						<view class="label-list">
							<view 
								v-for="(label, index) in selectedLabels" 
								:key="index"
								class="label-item"
								:class="{ active: currentLabel === index }"
								@click="handleLabelClick(index)"
							>
								<text>{{ label.name }}</text>
								<view v-if="label.selected" class="selected-mark">
									<u-icon name="checkmark" color="#ffffff" size="24"></u-icon>
								</view>
							</view>
						</view>
					</view>
					
					<view class="upload-section">
						<view class="upload-title">上传{{ currentLabelName }}图片</view>
						<view class="upload-btn" @click="handleUpload">
							<u-icon name="plus" color="#f32b99" size="40"></u-icon>
							<text>上传图片</text>
						</view>
					</view>
				</view>
			</template>
			
			<!-- 常规服装列表 -->
			<template v-else>
				<view class="clothes-grid">
					<view 
						v-for="(item, index) in currentClothes" 
						:key="index"
						class="clothes-item"
						@click="handleClothesSelect(item)"
					>
						<image :src="item.image" mode="aspectFit" class="clothes-image"></image>
						<view class="clothes-info">
							<text class="clothes-name">{{ item.name }}</text>
							<text class="clothes-style">{{ item.style }}</text>
						</view>
					</view>
				</view>
			</template>
		</scroll-view>
	</view>
	
	<!-- 添加底部生成按钮 -->
	<view class="generate-btn-wrapper">
		<view 
			class="generate-btn"
			:class="{ disabled: !fitStore.isReadyToGenerate || isGenerating }"
			@click="handleGenerate"
		>
			<text v-if="!isGenerating">开始生成</text>
			<view v-else class="generating-status">
				<view class="progress-wrapper">
					<view 
						class="progress-bar"
						:style="{ width: `${uploadProgress}%` }"
					></view>
				</view>
				<text class="status-text">{{ uploadProgress < 100 ? '上传中...' : '生成中...' }}</text>
			</view>
		</view>
	</view>
	
	<!-- 添加生成中的蒙层 -->
	<view class="generating-mask" v-if="isGenerating">
		<view class="generating-content">
			<view class="icon-wrapper">
				<view class="loading-spinner"></view>
			</view>
			<text class="main-text">魔法中...</text>
			<text class="sub-text">请勿退出该页面</text>
		</view>
	</view>
</view>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useFitStore } from '@/stores/fit'
import { useUserStore } from '@/stores'

const currentCategory = ref(0)
const currentLabel = ref(0)
const fitStore = useFitStore()
const userStore = useUserStore()

// 添加状态变量
const uploadProgress = ref(0)
const isGenerating = ref(false)
const taskId = ref('')
const pollTimer = ref(null)

// 添加配置变量
const USE_MOCK = false // 这里控制是否使用模拟数据

// 分类数据
const categories = [
	{ name: '上装', type: 'top' },
	{ name: '下装', type: 'bottom' },
	{ name: '连体装', type: 'full' },
	{ name: '我的', type: 'my' }
]

// 标签数据
const selectedLabels = ref([
	{ name: '上装', selected: false },
	{ name: '下装', selected: false }
])

// 当前标签名称
const currentLabelName = computed(() => {
	return selectedLabels.value[currentLabel.value]?.name || ''
})

// 模拟服装数据，后续从接口获取
const clothesList = ref({
	top: [
		{ id: 1, name: '基础白T恤', style: '休闲', image: '/static/images/clothes/top1.png' },
		{ id: 2, name: '条纹衬衫', style: '通勤', image: '/static/images/clothes/top2.png' }
	],
	bottom: [
		{ id: 101, name: '直筒牛仔裤', style: '休闲', image: '/static/images/clothes/bottom1.png' },
		{ id: 102, name: 'A字半身裙', style: '通勤', image: '/static/images/clothes/bottom2.png' }
	],
	full: [
		{ id: 201, name: '连衣裙', style: '优雅', image: '/static/images/clothes/full1.png' },
		{ id: 202, name: '连体裤', style: '休闲', image: '/static/images/clothes/full2.png' }
	]
})

// 当前分类的服装列表
const currentClothes = computed(() => {
	const type = categories[currentCategory.value].type
	return clothesList.value[type] || []
})

// 切换分类
const handleCategoryChange = (index) => {
	currentCategory.value = index
}

// 点击标签
const handleLabelClick = (index) => {
	currentLabel.value = index
}

// 选择服装
const handleClothesSelect = (item) => {
	console.log('选择的服装:', item)
	// 根据当前分类存储图片
	const type = categories[currentCategory.value].type
	if (type === 'top') {
		fitStore.setTopImage(item.image)
		selectedLabels.value[0].selected = true
	} else if (type === 'bottom') {
		fitStore.setBottomImage(item.image)
		selectedLabels.value[1].selected = true
	}
	
	uni.showToast({
		title: '选择成功',
		icon: 'success'
	})
}

// 处理上传
const handleUpload = () => {
	uni.chooseImage({
		count: 1,
		sizeType: ['original', 'compressed'],
		sourceType: ['album', 'camera'],
		success: (res) => {
			const tempFilePath = res.tempFilePaths[0]
			// 根据当前标签存储图片
			if (currentLabel.value === 0) {
				fitStore.setTopImage(tempFilePath)
			} else {
				fitStore.setBottomImage(tempFilePath)
			}
			
			// 标记当前类型已选择
			selectedLabels.value[currentLabel.value].selected = true
			// 如果是上装，自动切换到下装
			if (currentLabel.value === 0) {
				currentLabel.value = 1
			}
			
			uni.showToast({
				title: '选择成功',
				icon: 'success'
			})
		}
	})
}

// 修改生成方法
const handleGenerate = async () => {
	const uploadTasks = await fitStore.startGenerate()
	if (!uploadTasks) return
	
	try {
		isGenerating.value = true
		uploadProgress.value = 0
		
		if (USE_MOCK) {
			// 模拟上传进度
			const simulateUpload = () => {
				let progress = 0
				const timer = setInterval(() => {
					progress += 10
					uploadProgress.value = progress
					
					if (progress >= 100) {
						clearInterval(timer)
						// 模拟生成完成，跳转到结果页
						setTimeout(() => {
							isGenerating.value = false
							// 使用测试图片URL
							const testImageUrl = 'https://qiniupic.xjspace.cn/image/2025/01/03/7cd0c79e461c45c88910fcf2b5b1c0e0.png'
							uni.navigateTo({
								url: `/pagesub/fit/result?task_id=test123&image_url=${encodeURIComponent(testImageUrl)}`
							})
						}, 1000)
					}
				}, 300)
			}
			simulateUpload()
		} else {
			// 实际上传逻辑
			const uploadPromise = new Promise((resolve, reject) => {
				const uploadTask = uni.uploadFile({
					url: '/module/synthesis/outfit/uploadFitImg',
					files: uploadTasks.map(task => ({
						name: 'file',
						uri: task.filePath
					})),
					header: {
						'Authorization': 'Bearer ' + userStore.token
					},
					formData: {
						type: uploadTasks.map(task => task.type)
					},
					success: (res) => {
						console.log('上传成功:', res)
						const data = JSON.parse(res.data)
						resolve(data)
					},
					fail: (error) => {
						console.error('上传失败:', error)
						reject(error)
					}
				})
				
				// 监听上传进度
				uploadTask.onProgressUpdate((res) => {
					uploadProgress.value = res.progress
				})
			})
			
			// 等待上传完成
			const result = await uploadPromise
			console.log('上传结果:', result.data.taskId)
			// 获取task_id并开始轮询
			if (result.data && result.data.taskId) {
				taskId.value = result.data.taskId
				startPolling()
			} else {
				throw new Error('未获取到任务ID')
			}
		}
		
	} catch (error) {
		isGenerating.value = false
		uploadProgress.value = 0
		uni.showToast({
			title: error.message || '生成失败',
			icon: 'none'
		})
	}
}

// 添加轮询方法
const startPolling = () => {
	pollTimer.value = setInterval(async () => {
		try {
			
			const res = await uni.request({
				url: '/module/synthesis/outfit/status/'+taskId.value,
				method: 'GET',
				header: {
					'Authorization': 'Bearer ' + userStore.token
				}
			})
			// 处理新的返回格式
			if (res.data.data && res.data.data.output) {
				console.log('res.data.output:', res.data.data.output)
				const { task_status, image_url } = res.data.data.output
				if (task_status === 'SUCCEEDED' && image_url) {
					clearInterval(pollTimer.value)
					isGenerating.value = false
					uploadProgress.value = 100
					// 清空store数据
					fitStore.clearAll()
					
					// 跳转到结果页面，并传递完整的图片URL
					uni.navigateTo({
						url: `/pagesub/fit/result?task_id=${taskId.value}&image_url=${encodeURIComponent(image_url)}`
					})
				} else if (task_status === 'FAILED') {
					clearInterval(pollTimer.value)
					isGenerating.value = false
					uploadProgress.value = 0
					uni.showToast({
						title: '生成失败',
						icon: 'none'
					})
				}
				// 如果状态是其他值（如处理中），继续轮询
			} else if (['PENDING', 'PRE-PROCESSING', 'RUNNING', 'POST-PROCESSING'].includes(task_status)) {
				// 继续轮询
				console.log('Task still in progress, status:', task_status)
			} else {
				throw new Error('返回数据格式错误')
			}
		} catch (error) {
			clearInterval(pollTimer.value)
			isGenerating.value = false
			uploadProgress.value = 0
			uni.showToast({
				title: error.message || '检查状态失败',
				icon: 'none'
			})
		}
	}, 5000) // 每5秒检查一次
}

// 组件卸载时清理定时器
onUnmounted(() => {
	if (pollTimer.value) {
		clearInterval(pollTimer.value)
	}
})
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	background-color: #ffffff;
	
	.content {
		height: calc(100vh - 44px);
		display: flex;
	}
	
	.category-list {
		width: 200rpx;
		height: 100%;
		background: #f8f8f8;
		
		.category-item {
			height: 100rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 28rpx;
			color: #666;
			position: relative;
			transition: all 0.3s ease;
			
			&.active {
				color: #f32b99;
				font-weight: bold;
				background: #ffffff;
				
				&::after {
					content: '';
					position: absolute;
					left: 0;
					top: 50%;
					transform: translateY(-50%);
					width: 6rpx;
					height: 36rpx;
					background: #f32b99;
					border-radius: 0 4rpx 4rpx 0;
				}
			}
			
			&:active {
				background: rgba(243, 43, 153, 0.05);
			}
		}
	}
	
	.clothes-list {
		flex: 1;
		height: 100%;
		padding: 20rpx;
		
		.my-clothes {
			.label-section {
				margin-bottom: 40rpx;
				
				.label-title {
					font-size: 28rpx;
					color: #333;
					font-weight: bold;
					margin-bottom: 20rpx;
				}
				
				.label-list {
					display: flex;
					gap: 20rpx;
					
					.label-item {
						position: relative;
						padding: 16rpx 40rpx;
						background: #f8f8f8;
						border-radius: 100rpx;
						font-size: 28rpx;
						color: #666;
						transition: all 0.3s ease;
						
						&.active {
							background: rgba(243, 43, 153, 0.1);
							color: #f32b99;
							font-weight: bold;
						}
						
						.selected-mark {
							position: absolute;
							right: -8rpx;
							top: -8rpx;
							width: 36rpx;
							height: 36rpx;
							background: #4CAF50;
							border-radius: 50%;
							display: flex;
							align-items: center;
							justify-content: center;
						}
					}
				}
			}
			
			.upload-section {
				.upload-title {
					font-size: 28rpx;
					color: #333;
					font-weight: bold;
					margin-bottom: 20rpx;
				}
				
				.upload-btn {
					width: 100%;
					height: 300rpx;
					background: #f8f8f8;
					border-radius: 20rpx;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					gap: 16rpx;
					transition: all 0.3s ease;
					
					text {
						font-size: 28rpx;
						color: #666;
					}
					
					&:active {
						transform: scale(0.98);
						background: rgba(243, 43, 153, 0.05);
					}
				}
			}
		}
		
		.clothes-grid {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 20rpx;
			
			.clothes-item {
				background: #f8f8f8;
				border-radius: 20rpx;
				overflow: hidden;
				transition: transform 0.3s ease;
				
				&:active {
					transform: scale(0.98);
				}
				
				.clothes-image {
					width: 100%;
					height: 300rpx;
					background: #fff;
				}
				
				.clothes-info {
					padding: 20rpx;
					
					.clothes-name {
						font-size: 28rpx;
						color: #333;
						font-weight: bold;
						margin-bottom: 8rpx;
						display: block;
					}
					
					.clothes-style {
						font-size: 24rpx;
						color: #666;
						display: block;
					}
				}
			}
		}
	}
}

// 添加预览区域样式
.preview-section {
	margin-top: 30rpx;
	padding: 30rpx 20rpx;
	background: #ffffff;
	border-radius: 20rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

	.preview-title {
		font-size: 28rpx;
		color: #333;
		font-weight: bold;
		margin-bottom: 20rpx;
		padding: 0 10rpx;
	}

	.preview-grid {
		display: flex;
		flex-direction: column;
		gap: 20rpx;

		.preview-item {
			position: relative;
			width: 100%;
			height: 260rpx; // 增加高度
			border-radius: 16rpx;
			overflow: hidden;
			background: #f8f8f8;
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
			transition: all 0.3s ease;

			&.model-preview {
				height: 320rpx; // 模特预览更高一些
			}

			&:active {
				transform: scale(0.98);
			}

			.preview-image {
				width: 100%;
				height: 100%;
				object-fit: cover;
			}

			.preview-label {
				position: absolute;
				bottom: 0;
				left: 0;
				right: 0;
				padding: 12rpx 0;
				background: rgba(0, 0, 0, 0.6);
				color: #ffffff;
				font-size: 24rpx;
				text-align: center;
				font-weight: 500;
				backdrop-filter: blur(4px);
			}
		}
	}
}

// 修改生成按钮样式
.generate-btn-wrapper {
	position: fixed;
	right: 40rpx;
	bottom: 40rpx;
	z-index: 100;

	.generate-btn {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		background: linear-gradient(135deg, #f32b99, #f6a1d0);
		display: flex;
		align-items: center;
		justify-content: center;
		color: #ffffff;
		font-size: 28rpx;
		font-weight: bold;
		box-shadow: 0 8rpx 16rpx rgba(243, 43, 153, 0.2);
		transition: all 0.3s ease;
		
		&:active {
			transform: scale(0.92);
		}
		
		&.disabled {
			background: #cccccc;
			box-shadow: none;
			opacity: 0.8;
		}

		.generating-status {
			width: 80%;
			text-align: center;

			.progress-wrapper {
				width: 100%;
				height: 4rpx;
				background: rgba(255, 255, 255, 0.3);
				border-radius: 2rpx;
				margin-bottom: 8rpx;

				.progress-bar {
					height: 100%;
					background: #ffffff;
					border-radius: 2rpx;
					transition: width 0.3s ease;
				}
			}

			.status-text {
				font-size: 20rpx;
				color: #ffffff;
			}
		}
	}
}

// 添加动画关键帧
@keyframes rotate {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}

@keyframes pulse {
	0% {
		opacity: 1;
	}
	50% {
		opacity: 0.6;
	}
	100% {
		opacity: 1;
	}
}

// 修改服装选择区域样式
.clothes-list {
	.clothes-grid {
		.clothes-item {
			// 增加选中状态的样式
			&.selected {
				border: 4rpx solid #f32b99;
				transform: scale(1.02);
				box-shadow: 0 8rpx 16rpx rgba(243, 43, 153, 0.15);
				
				&::after {
					content: '';
					position: absolute;
					top: 20rpx;
					right: 20rpx;
					width: 40rpx;
					height: 40rpx;
					background: #f32b99;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
					box-shadow: 0 2rpx 8rpx rgba(243, 43, 153, 0.3);
				}
			}
			
			// 增加悬浮效果
			&:hover {
				transform: translateY(-5rpx);
				box-shadow: 0 8rpx 16rpx rgba(0, 0, 0, 0.1);
			}
		}
	}
}

// 添加生成中蒙层样式
.generating-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.8);
	z-index: 999;
	display: flex;
	align-items: center;
	justify-content: center;
	
	.generating-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20rpx;
		
		.icon-wrapper {
			width: 120rpx;
			height: 120rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			
			.loading-spinner {
				width: 80rpx;
				height: 80rpx;
				border: 4rpx solid rgba(255, 255, 255, 0.3);
				border-top: 4rpx solid #ffffff;
				border-radius: 50%;
				animation: spin 1s linear infinite;
			}
		}
		
		.main-text {
			font-size: 48rpx;
			color: #ffffff;
			font-weight: bold;
			margin-top: 30rpx;
			
			animation: pulse 1.5s ease infinite;
		}
		
		.sub-text {
			font-size: 28rpx;
			color: rgba(255, 255, 255, 0.8);
			margin-top: 10rpx;
		}
	}
}

@keyframes spin {
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
}
</style> 