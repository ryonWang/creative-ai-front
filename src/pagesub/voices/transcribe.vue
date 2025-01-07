<template>
	<view class="container content">
		<view class="txtBox">
			<u--textarea v-model="value1" placeholder="请输入内容" count height="616" maxlength="5000"></u--textarea>
			<view class="export" @click="testWord">检测敏感词</view>
			<view class="checkBox" v-if="tips.length>0">检测到上述话术存在敏感词: <text v-for="item in tips" :key="item" class="word">{{item}}&nbsp;</text>请修改后录制!</view>
		</view>
		
		<view class="mediaBox">
			<AudioQuickPlay ref="audioQuickPlay" :url="voicePath" @ended="isPlay=false"></AudioQuickPlay>
			<view class="fcc-sb">
				<view class="btn btn1 flex-rcc" @click="playVoice">
					<image :src="`/static/images/voices/${isPlay? 'pause': 'play'}-w.png`"></image>
					试听
				</view>
				<view class="btn flex-rcc" @click="saveVoice">
					<image src="/static/images/voices/save.png"></image>
					保存音频
				</view>
			</view>
		</view>
		
		<view class="recordBox flex-cc">
			<view class="aBox flex-rcc">
				<view class="animate-wave" v-if="isRecord">
					<view class="w1"></view>
					<view class="w2"></view>
					<view class="w3"></view>
					<view class="w4"></view>
				</view>
				<image src="/static/images/voices/record.png" @click="handleRecord"></image>
			</view>
			<view class="isRecording" v-if="isRecord">正在录音中{{time}}s</view>
			<view class="tips">点击开始录音，再次点击结束录音</view>
		</view>
		
		<u-popup :show="showPopup" @close="showPopup=false" :closeOnClickOverlay="false" safeAreaInsetBottom :round="10" closeable>
			<view class="titBox">
				<u--input
				    placeholder="请输入音频名称"
				    border="surround"
				    v-model.trim="title"
					inputAlign="center"
					maxlength="10"
					showWordLimit
					clearable
				  ></u--input>
				  <u-button type="primary" text="确定" shape="circle" class="btn" @click="save"></u-button>
			</view>
		</u-popup>
	</view>
</template>

<script setup>
	import { onLoad,onShow, onUnload } from '@dcloudio/uni-app'
	import { goTo } from '@/utils/helper.js' 
	import AudioQuickPlay from '@/components/audioQuickPlay/index.vue'
	import { useConfigStore, useTaskStore } from '@/stores'
	import { addVoiceAtReply, voiceReaCreate, checkWords } from '@/api'
	
	const config = useConfigStore()
	const useTask = useTaskStore()
	const value1 = ref('')
	const showPopup = ref(false)
	const voicePath = ref(null)
	const title = ref(null)
	const tips = ref([]) // 检测结果
	
	const show = ref(false)
	const content = ref('请确认删除该语音?')
	const time = ref(0)
	// 计时
	const timer = ref(null)
	const timmerBegin = () =>{
		timer.value = setInterval(()=>{
			time.value++
		},1000)
	}
	
	const delItem = item =>{
		show.value = true
	}
	
	onBeforeUnmount(()=>{
		useTask.setTask({})
	})
	// 播放中数据
	const playDataId = ref(null) 
	
	onShow(()=>{
		if(Object.keys(useTask.task).length>0){
			value1.value = useTask.task.content
		}
	})
	
	function testWord(){
		if(!value1.value) return uni.$u.toast('话术不能为空!')	
		checkWords({str: value1.value}).then(res =>{
			tips.value = res.data
			if(res.data.length===0) return uni.$u.toast('未检测到敏感词,请放心录制!')	
		})
	}
	
	const handleItem = item =>{
		if(playDataId.value === null){
			playDataId.value = item.id
			// 播放
		}else{
			if(playDataId.value === item.id){
				// 当前播放暂停
				playDataId.value = null
			}else{
				playDataId.value = item.id
				// 播放
			}
		}
		
	}
	const type = ref(1) // 1 语音库， 2 回复
	let recorderManager = null, innerAudioContext = null, id = null, isBack = false;
	onLoad((option)=>{
		id = option.id
		type.value = option.type
		// 初始化录音
		recorderManager = uni.getRecorderManager();
		// 初始化播放器
		// innerAudioContext = uni.createInnerAudioContext();
		// innerAudioContext.autoplay = true;
		// 获取音频信息
		// innerAudioContext.onCanplay(res=>{
		// 	console.log('res音频',JSON.stringify(res))
		// })
		
		// 音频停止事件
		// innerAudioContext.onStop(function (res){
		// 	isPlay.value = false
		// 	uni.$u.toast('播放结束!')
		// })
		
		recorderManager.onStop(function (res) {
			isRecord.value = false
			voicePath.value = res.tempFilePath;
			clearInterval(timer.value)
			timer.value = null
			time.value = 0
			if(!isBack){
				uni.showToast({title: '录音完成!', icon: 'success', duration: 1500})
			}
		});
		// 获取七牛token
		config.getQnToken()
	})
	
	const isRecord = ref(false)
	
	const handleRecord = ()=>{
		isRecord.value = !isRecord.value
		// 震动后开始
		// uni.vibrateLong({
		// 	success:()=>{
				if(isRecord.value){
					uni.showToast({
						title: '录音开始!',
						icon: 'success',
						duration: 1500,
					})
					recorderManager.start({duration: 600000}); // 录音时间 最多10分钟
					timmerBegin()
				}else{
					recorderManager.stop();
				}
		// 	}
		// })
	}
	
	// 播放录音
	const audioQuickPlay = ref(null)
	const isPlay = ref(false)
	const playVoice = ()=>{
		if(voicePath.value){
			isPlay.value = !isPlay.value
			if(voicePath.value){
				// innerAudioContext.src = voicePath.value;
				if(isPlay.value){
					audioQuickPlay.value.play()
					// innerAudioContext.play();
				}else{
					audioQuickPlay.value.stop()
					// innerAudioContext.pause();
				}
				
			}	
		}else{
			uni.$u.toast('请录音完成后试听!')
		}
	}
	
	const ok = ()=>{
		show.value = false
	}
	function saveVoice(){
		if(!voicePath.value) return uni.$u.toast('请录音完成后保存!')
		// title.value = voicePath.value.split('.').slice(0, -1).join('.')
		showPopup.value = true
	}
	
	const save = ()=>{
		if(title.value){
			upLoadFile()
		}else{
			uni.$u.toast('请填写音频名称!')
		}
	}
	
	const upLoadFile = ()=>{
		uni.showLoading({title: '加载中', mask: true})
		// 获取音频
		uni.uploadFile({
			url: 'https://upload-z1.qiniup.com',
			filePath: voicePath.value,
			name: 'file',
			formData: {
				"token": config.qnToken,
				"x:type": 15,
			},
			success: async(res) => { 
				const file = JSON.parse(res.data)
				const upload_id = file.data.id
				const response = (type.value == 2) ? await addVoiceAtReply(id, {upload_id,title:title.value}) : await voiceReaCreate({upload_id,voice_id:id,title:title.value})
				if(response){
					showPopup.value = false
					useTask.setTask({})
					uni.showToast({title: '保存成功', icon: 'success', duration: 1500});
					setTimeout(uni.navigateBack, 1500)
					title.value = null
				}
			},
			fail: (err) => {
				uni.showToast({title: '保存失败', icon: 'error', duration: 2000});
			},
			complete(){
				uni.hideLoading()
			}
		})
	}
	
	onUnload(()=>{
		if(audioQuickPlay.value){
			clearInterval(timer.value)
			audioQuickPlay.value.destroy()
			audioQuickPlay.value = null
		}
		isBack = true
		recorderManager.stop()
		recorderManager = null
	})
</script>

<style lang="scss" scoped>
	@keyframes opac {
	    from {
	        opacity: 1;
	        width: 0;
	        height: 0;
	        top: 50%;
	        left: 50%;
	    }
	
	    to {
	        opacity: .1;
	        width: 100%;
	        height: 100%;
	        top: 0;
	        left: 0;
	    }
	}
	.content {
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  padding: 36rpx 20rpx;
	  box-sizing: border-box;
	  position: relative;
	  min-height: 100vh;
	  
	  .txtBox{
		  width: 100%;
		  min-height: 616rpx;
		  background: #ffffff;
		  border-radius: 20rpx;
		  .u-textarea{
		  		  padding-bottom: 50rpx !important;
		  }
		  .export{
			  background-color: #ffffff;
			  position: absolute;
			  font-size: 28rpx;
			  font-weight: bold;
			  color: #2281fe;
			  padding: 5rpx;
			  border-radius: 5rpx;
			  margin-top: -50rpx;
			  margin-left: 10rpx;
			  z-index: 999;
		  }
		  .checkBox{
			  width: 100%;
			  padding: 20rpx;
			  font-size: 24rpx;
			  color: #FF5589;
			  .word{
				color: red;
				font-size: 34rpx;
				font-weight: bolder;
			  }
		  }
	  }
	  .mediaBox{
		  width: 100%;
		  padding-top: 20rpx;
		  .btn{
			  width: 336rpx;
			  height: 98rpx;
			  font-size: 36rpx;
			  background: #e8f2ff;
			  border: 1rpx solid #2281fe;
			  border-radius: 10rpx;
			  color: #333333;
			  image{
				  width: 40rpx;
				  height: 40rpx;
				  margin-right: 13rpx;
			  }
		  }
		  .btn1{
			  background: #2281fe;
			  color: #ffffff;
		  }
	  }
	  .recordBox{
		  width: 100%;
		  padding: 54rpx 0 44rpx 0;
		  .aBox{
			  width: 250rpx;
			  height: 250rpx;
			  border-radius: 50%;
			  position: relative;
			  // border: 1px solid red;
		  }
		  .isRecording{
			  padding-top: 20rpx;
			  font-size: 28rpx;
			  color: #2281fe;
		  }
		  .animate-wave * {
		      background: #2281FE;
		      position: absolute;
		      border-radius: 50%;
			  animation: opac 4s infinite;
		  }
		  .animate-wave .w2 {
		      animation-delay: 1s;
		  }
		  
		  .animate-wave .w3 {
		      animation-delay: 2s;
		  }
		  
		  .animate-wave .w4 {
		      animation-delay: 3s;
		  }
		  .animate-wave .w5 {
		      animation-delay: 4s;
		  }
		  image{
			  width: 140rpx;
			  height: 140rpx;
		  }
		  .tips{
			  padding-top: 34rpx;
			  font-size: 24rpx;
			  color: #333333;
			  line-height: 6rpx;
		  }
	  }
	}
	.titBox{
		width: 100%;
		padding: 100rpx 40rpx;
		.btn{
			margin-top: 100rpx;
		}
	}
	
</style>