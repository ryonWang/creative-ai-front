<template>
	<view class="container content">
		<view class="list">
			<view class="item" v-for="(item,index) in voice_live" :key="index" @click="handleClick(item)" :class="{'a-item':current.voice===item.voice}">
				<image :src="item.icon" class="icon"></image>
				{{item.type}}
				<view class="select" v-if="current.voice===item.voice">
					<u-icon name="checkbox-mark" size="22" color="#fff" class="checkbox"></u-icon>
				</view>
			</view>
		</view>
		
		<view class="btn-box">
			<u-button type="primary" shape="circle" color="#2281FE" size="large" text="确定" @click="save"></u-button>
		</view>
	</view>
</template>

<script setup>
	import { onLoad, onHide,  onUnload} from '@dcloudio/uni-app'
	import { useTaskStore } from '@/stores'
	
	const voice_live = [
		{ name: '知猫', voice: 'zhimao', type: '普通话女声', time: '5s', path: 'https://help-static-aliyun-doc.aliyuncs.com/file-manage-files/zh-CN/20230227/eomj/1677483215080.wav', icon: '/static/images/voices/ai/w1.png' },
		{ name: '老妹', voice: 'laomei', type: '吆喝女声', time: '3s', path: 'https://help-static-aliyun-doc.aliyuncs.com/file-manage-files/zh-CN/20230227/hxyk/1677483281444.wav', icon: '/static/images/voices/ai/w2.png' },
		{ name: '知甜(高清)', voice: 'zhitian', type: '甜美女声', time: '4s', path: 'https://help-static-aliyun-doc.aliyuncs.com/file-manage-files/zh-CN/20230227/ggtx/1677483071839.wav', icon: '/static/images/voices/ai/w6.png' },
		{ name: '小仙', voice: 'xiaoxian', type: '亲切女声', time: '8s', path: 'https://help-static-aliyun-doc.aliyuncs.com/file-manage-files/zh-CN/20230227/dbss/1677483377592.wav', icon: '/static/images/voices/ai/w4.png' },
		{ name: '柜姐', voice: 'guijie', type: '亲切女声', time: '3s', path: 'https://help-static-aliyun-doc.aliyuncs.com/file-manage-files/zh-CN/20230227/zulm/1677483418518.wav', icon: '/static/images/voices/ai/w5.png' },
		{ name: 'Stella', voice: 'stella', type: '知性女声', time: '3s', path: 'https://help-static-aliyun-doc.aliyuncs.com/file-manage-files/zh-CN/20230227/ayxg/1677483462464.wav', icon: '/static/images/voices/ai/w6.png' },
		{ name: '猫小美', voice: 'maoxiaomei', type: '活力女声', time: '4s', path: 'https://help-static-aliyun-doc.aliyuncs.com/file-manage-files/zh-CN/20230227/jgta/1677483541315.wav', icon: '/static/images/voices/ai/w1.png' },
		{ name: '巧薇', voice: 'qiaowei', type: '卖场主播', time: '6s', path: 'https://help-static-aliyun-doc.aliyuncs.com/file-manage-files/zh-CN/20230227/jxte/1677483615668.wav', icon: '/static/images/voices/ai/w3.png' },
		{ name: '艾伦', voice: 'ailun', type: '悬疑解说', time: '2s', path: 'https://help-static-aliyun-doc.aliyuncs.com/file-manage-files/zh-CN/20230227/dlyx/1677483659936.wav', icon: '/static/images/voices/ai/n1.png' },
		{ name: '艾飞', voice: 'aifei', type: '激昂解说', time: '4s', path: 'https://help-static-aliyun-doc.aliyuncs.com/file-manage-files/zh-CN/20230227/bwdc/1677483726528.wav', icon: '/static/images/voices/ai/n2.png' },
		{ name: '亚群', voice: 'yaqun', type: '卖场广播', time: '3s', path: 'https://help-static-aliyun-doc.aliyuncs.com/file-manage-files/zh-CN/20230227/pvcf/1677483757340.wav', icon: '/static/images/voices/ai/n6.png' },
		{ name: 'Stanley', voice: 'stanley', type: '沉稳男声', time: '6s', path: 'https://help-static-aliyun-doc.aliyuncs.com/file-manage-files/zh-CN/20230227/ymew/1677483831124.wav', icon: '/static/images/voices/ai/n4.png' },
		{ name: 'Kenny', voice: 'kenny', type: '温暖男声', time: '6s', path: 'https://help-static-aliyun-doc.aliyuncs.com/file-manage-files/zh-CN/20230227/izoc/1677483866042.wav', icon: '/static/images/voices/ai/n5.png' },
		{ name: '老铁', voice: 'laotie', type: '东北老铁', time: '3s', path: 'https://help-static-aliyun-doc.aliyuncs.com/file-manage-files/zh-CN/20230227/ssui/1677483332755.wav', icon: '/static/images/voices/ai/n3.png' },
	  ]
  onLoad(()=>{
	 innerAudioContext.value = uni.createInnerAudioContext();
  })
  
  
  const current = ref({
	  voice: 'zhimao',
	  type: '普通话女声'
  })
  const innerAudioContext = ref(null)
  const task = useTaskStore()
  
  function handleClick(item){
	  if(innerAudioContext.value){
		 innerAudioContext.value.stop() 
	  }else{
		 innerAudioContext.value = uni.createInnerAudioContext() 
	  }
	  
	  current.value.voice = item.voice
	  current.value.type = item.type
	  innerAudioContext.value.src = item.path
	  innerAudioContext.value.play()
  }
  
  function save(){
	  task.setDefaultVoice(current.value)
	  uni.navigateBack()
  }
  
  onHide(()=>{
  	if(innerAudioContext.value){
  		innerAudioContext.value.destroy()
  		innerAudioContext.value = null
  	} 	
  })
  
  onUnload(()=>{
	 if(innerAudioContext.value){
	 	innerAudioContext.value.destroy()
	 	innerAudioContext.value = null
	 } 	 
  })
</script>

<style lang="scss" scoped>
	.content {
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  padding: 12rpx;
	  box-sizing: border-box;
	  position: relative;
	  min-height: 100vh;
	  .list{
		  width: 100%;
		  min-height: 332.5rpx;
		  background: #ffffff;
		  border-radius: 14rpx;
		  box-sizing: border-box;
		  display: flex;
		  flex-wrap: wrap;
		  padding: 10rpx 4rpx 0 4rpx;
		  .item{
			  width: 330rpx;
			  height: 90rpx;
			  background: #f6f8fd;
			  border-radius: 10rpx;
			  display: flex;
			  align-items: center;
			  // justify-content: center;
			  padding-left: 16rpx;
			  font-size: 28rpx;
			  color: #333333;
			  margin: 0 18rpx 16rpx 10rpx;
			  border: 1rpx solid #f6f8fd;
			  position: relative;
			  overflow: hidden;
			  .icon{
				  width: 70rpx;
				  height: 70rpx;
				  margin-right: 24rpx;
			  }
		  }
		  .a-item{
			  border: 1rpx solid #165dff;
			  color: #165dff;
		  }
		  
		  .select{
			  width: 34rpx;
			  height: 34rpx;
			  background-color: #165dff;
			  position: absolute;
			  right: 0;
			  bottom: 0;
			  z-index: 1;
			  .checkbox{
				  position: absolute;
				  right: 0;
				  bottom: 0;
			  }
		  }
		  .select::after{
			  content: '';
			  width: 0px;
			 height: 0px;
			 border-left: 0rpx solid transparent;
			 border-right: 38rpx solid transparent;
			 border-top: 38rpx solid #f6f8fd;
			 position: absolute;
			 top: -2rpx;
			 left: -2rpx;
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