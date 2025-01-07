<template>
	<view class="container">
		<view class="des">当前AI配音可使用次数: <text class="num">{{num}}</text></view>
		<view class="u-flex menu">
			<view class="item u-flex" @click="toPath">
				<view class="des">
					<view class="tit">AI配音</view>
					<view>选择配音</view>
				</view>
				<image src="/static/images/voices/ai-v.png" class="ai"></image>
			</view>
			
			<view class="item u-flex" @click="goTo(`/pagesub/voices/voiceStore?id=${voice_id}`)">
				<view class="des">
					<view class="tit">真人配音</view>
					<view>录制配音</view>
				</view>
				<image src="/static/images/voices/pe-v.png" class="po"></image>
			</view>
		</view>
		
	</view>
</template>

<script setup>
	import { onLoad, onShow } from '@dcloudio/uni-app'
	import { goTo } from '@/utils/helper.js'
	import { oemInfo } from '@/api'
	
	onLoad((option)=>{
		voice_id.value = option.id
	})
	
	onShow(()=>{
		getOemInfo()
	})
	const voice_id = ref(null)
	const is_aiaudio = ref(0)
	const num = ref(0)
	function getOemInfo(){
		oemInfo({oem_id: import.meta.env.VITE_OEM_ID}).then(res =>{
			is_aiaudio.value = res.data.is_aiaudio
			num.value = res.data.num
		})
	}
	function toPath(){
		if(is_aiaudio.value===0) return uni.showToast({title: '请联系上级开启此功能!',icon: 'none',duration: 2000});
		if(num.value===0) return uni.showToast({title: '请联系上级增加使用次数!',icon: 'none',duration: 2000});
		goTo(`/pagesub/voices/ai-dub?id=${voice_id.value}`)
	}
</script>

<style lang="scss" scoped>
	.des{
		font-size: 24rpx;
		color: #999;
		padding: 20rpx;
		padding-left: 30rpx;
		.num{
			font-weight: bold;
			color:red;
		}
	}
	.u-flex{
		display: flex;
	}
	.menu{
		width: 100%;
		padding: 0rpx 30rpx 50rpx 30rpx;
		box-sizing: border-box;
		justify-content: space-between;
		.item{
			width: 316rpx;
			height: 180rpx;
			background: #ffffff;
			border-radius: 20rpx;
			box-shadow: 0px 0px 6rpx 0px rgba(224,224,224,0.48);
			position: relative;
			 .des{
				 width: 100%;
				 font-size: 24rpx;
				 font-weight: 400;
				 color: #666666;
				 position: absolute;
				 padding-top: 36rpx;
				 padding-left: 30rpx;
				 z-index: 2;
				 .tit{
					 font-size: 32rpx;
					 font-weight: 700;
					 color: #333333;
					 margin-bottom: 18rpx;
				 }
			 }
			 image{
				 position: absolute;
				 bottom: 0;
				 right: 12rpx;
			 }
			 .ai{
				 width: 198rpx;
				 height: 148rpx;
			 }
			 .po{
				 width: 148rpx;
				 height: 148rpx;
			 }
		}
	}
</style>