<template>
	<view class="container content">
		<web-view :src="`/hybrid/html/index.html?token=${encodeURIComponent(userStore.qnToken)}`" @onPostMessage="postMessage" @message="postMessage"></web-view>
		<!-- <view class="title">上传音频</view>
		<view class="uploadBox">
			<view class="upStyle flex-rcc" @click="upLoad">
				<image src="/static/images/voices/audio.png"></image>
				上传音频
			</view>
		</view>
		<view class="name flex-rcc">
			<u--input
			    placeholder="请输入该音频名称"
			    border="none"
			    clearable
			  ></u--input>
		</view>
		
		<u-button type="primary" size="large" text="确定添加" color="#2281FE" shape="circle" @click="save" class="btn"></u-button> -->
	</view>
</template>

<script setup>
	import { onLoad } from '@dcloudio/uni-app'
	import { useConfigStore } from '@/stores';
	import { addVoiceAtReply, voiceReaCreate } from '@/api'
	
	const userStore = useConfigStore()
	let id = null, type = null;
	onLoad((option)=>{
		type = option.type
		id = option.id
		userStore.getQnToken()
		console.log('encodeURIComponent(userStore.qnToken)', encodeURIComponent(userStore.qnToken))
	})
	
	const postMessage = async(data)=>{
		const { upload_id, title } = data.detail.data[0]
		const res = (type == 2) ? await addVoiceAtReply(id, {upload_id, title}) : await voiceReaCreate({voice_id: id, upload_id, title});
		if(res){
			uni.showToast({title: '添加成功', icon: 'success', duration: 1500});
			setTimeout(uni.navigateBack, 1500)
		}
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
	  .title{
		  width: 100%;
		  font-size: 36rpx;
		  font-family: Microsoft YaHei, Microsoft YaHei-Regular;
		  color: #212121;
	  }
	  .uploadBox{
		  width: 100%;
		  margin: 30rpx 0;
		  .upStyle{
			  width: 300rpx;
			  height: 100rpx;
			  background: #e8f2ff;
			  border: 1rpx solid #2281fe;
			  border-radius: 10rpx;
			  image{
				  width: 58rpx;
				  height: 40rpx;
				  margin-right: 16rpx;
			  }
		  }
	  }
	  .name{
		  width: 100%;
		  height: 77rpx;
		  background: #ffffff;
		  border-radius: 20rpx;
		  padding: 0 20rpx;
	  }
	  .btn{
		  width: 710rpx;
		  position: absolute;
		  bottom: 28rpx;
		  left: 20rpx;
	  }
	}
</style>