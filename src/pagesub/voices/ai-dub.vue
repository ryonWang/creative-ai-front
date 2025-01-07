<template>
	<view class="container content">
		<view class="txtBox">
			<u--textarea v-model="form.content" placeholder="这里输入或粘贴需要配音的文字" count height="616" maxlength="5000"></u--textarea>
		</view>
		
		<view class="box">
			<view class="title">语音名称</view>
			<u--input
			    placeholder="请输入语音名称"
				v-model="form.title"
			    border="bottom"
			    clearable
			  ></u--input>
			  
		</view>
		
		<view class="menu">
			<view class="item" @click="goTo(`/pagesub/voices/select`)">
				<view class="tit">声音选择</view>
				<view class="r-b">
					<view class="txt">{{task.default_voice.type}}</view>
					<u-icon name="arrow-right" size="22" color="#999999"></u-icon>
				</view>
			</view>
			
			<view class="item" @click="show=true">
				<view class="tit">语速设置</view>
				<view class="r-b">
					<view class="txt">{{value1}}</view>
					<u-icon name="arrow-right" size="22" color="#999999"></u-icon>
				</view>
			</view>
		</view>
		
		<view class="btn-box">
			<u-button type="primary" shape="circle" color="#2281FE" size="large" text="合成配置" @click="save"></u-button>
		</view>
		
		<u-picker :show="show" :columns="columns" keyName="key" @cancel="show=false" @confirm="confirm"></u-picker>
	</view>
</template>

<script setup>
	import { onLoad } from '@dcloudio/uni-app'
	import { goTo } from '@/utils/helper.js'
	import { useTaskStore } from '@/stores'
	import { voiceAliJob } from '@/api'
	
	onLoad((option)=>{
		form.value.oem_id = import.meta.env.VITE_OEM_ID
		form.value.voice_id = option.id
		form.value.voice = task.default_voice.voice
	})
	const task = useTaskStore()
	const voice_id = ref(null)
	const value1 = ref('正常')
	const show = ref(false)
	const columns = reactive([[{key: '0.5倍', value: -500},{key: '正常', value: 0}, {key: '1.25倍',value: 125}, {key: '1.5倍', value: 250}, {key: '2倍', value: 500}]])
	
	const form = ref({
		// room_id: '',
		content: '',
		oem_id: '',
		voice: '',
		volume: 10,
		title: '',
		voice_id: '',
		speech_rate: 0
	})
	
	function confirm(data){
		form.value.speech_rate = data.value[0].value
		value1.value = data.value[0].key
		show.value = false
	}
	
	function save(){
		form.value.voice = task.default_voice.voice
		console.log('form', form.value)
		if(!form.value.content) return uni.showToast({title: '请输入要转换语音的内容!',icon: 'none',duration: 2000});
		if(!form.value.title) return uni.showToast({title: '语音名称不能为空!',icon: 'none',duration: 2000});
		voiceAliJob(form.value).then(res =>{
			uni.showToast({title: '提交成功!',icon: 'success',duration: 1500})
			goTo(`/pagesub/voices/voiceStore?id=${form.value.voice_id}`)
		})
	}
</script>

<style lang="scss" scoped>
	.content {
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  padding: 36rpx 20rpx;
	  box-sizing: border-box;
	  position: relative;
	  min-height: 100vh;
	  
	  .box{
	  	width: 100%;
	  	padding: 34rpx 40rpx;
	  	box-sizing: border-box;
	  	background: #ffffff;
		margin-top: 24rpx;
	  	// margin-bottom: 122rpx;
	  	.title{
	  		font-size: 28rpx;
	  		font-weight: bold;
	  		color: #333333;
	  	}
	  }
	  
	  .txtBox{
		  width: 100%;
		  min-height: 616rpx;
		  background: #ffffff;
		  border-radius: 20rpx;
		  .u-textarea{
		  		  padding-bottom: 50rpx !important;
		  }
		}
		.menu{
			width: 100%;
			height: 200rpx;
			background: #ffffff;
			border-radius: 20rpx;
			margin-top: 24rpx;
			padding: 36rpx;
			box-sizing: border-box;
			font-size: 28rpx;
			color: #666666;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			.item{
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 50rpx;
				.r-b{
					display: flex;
					align-items: center;
					.txt{
						font-size: 24rpx;
						color: #000;
						margin-right: 10rpx;
					}
				}
			}
		}
		
		.btn-box{
			width: 100%;
			height: 150rpx;
			padding: 0 40rpx;
			display: flex;
			align-items: center;
			flex-shrink: 0;
			position: fixed;
			bottom: 34rpx;
		}
	}
</style>