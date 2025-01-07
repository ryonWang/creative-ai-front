<template>
<view class="page2">
	<view class="panel shadow">
		<view class="tit">{{platformName}}</view>
		<view class="fcc-sb">
			<view class="name">直播间</view>
			<view class="iptBox">
				<u--input 
					v-model.trim="detail.live_url" 
					border="none" 
					class="ipt"
					prefixIcon="search"
					prefixIconStyle="font-size: 36rpx;color: #909399"
					placeholder="输入直播账号的抖音号"
					readonly
				></u--input>
			</view>
		</view>
	</view>
	<view class="panel shadow">
		<view class="flex between">
			<view class="lebel">选择语音库</view>
			<u-button plain type="primary" text="添加" icon="plus" shape="circle" class="add" @click="goTo('/pagesub/voices/taskStore?type=2')"></u-button>
		</view>
		<view class="selectItem" v-if="task.selectVoice">
			<image src="/static/images/live/ico-voice.png" class="voice"/>
			<text>{{task.selectVoice.title}}</text>
		</view>
	</view>
	<view class="panel shadow">
		<view class="flex between">
			<view class="lebel">选择智能回复</view>
			<u-button plain type="primary" text="添加" icon="plus" shape="circle" class="add" @click="goTo('/pagesub/voices/taskStore?type=3')"></u-button>
		</view>
		<view class="selectItem" v-if="task.selectReply">
			<image src="/static/images/live/ico-reply.png" class="voice"/>
			<text>{{task.selectReply.title}}</text>
		</view>
	</view>
	<view class="placeholder"></view>
	<view class="fixedArea">
		<u-button type="primary" text="重新开播" shape="circle" class="submit" @click="reStart"></u-button>
	</view>
</view>
</template>

<script setup>
import { onLoad, onReachBottom } from '@dcloudio/uni-app'
import { useTaskStore } from '@/stores'
import { getLiveById, createLiveRoom } from '@/api'
import { goTo } from '@/utils/helper.js'

const task = useTaskStore()
const detail = reactive({
	live_url: '',
	is_welcome: 0,
	welcome_interval: 30,
})
const platformName = ref('')

onLoad((option)=>{
	const { id } = option
	// var pages = getCurrentPages();
	getLiveById({id}).then(res=>{
		if(res&&res.data){
			const { live_url, is_welcome, welcome_interval, platform, voice, answer } = res.data
			platformName.value = platform ===1 ? '抖音直播' : '快手直播'
			detail.platform = platform
			detail.live_url = live_url
			detail.is_welcome = is_welcome
			detail.welcome_interval = welcome_interval
			task.setVoice({id: voice.id, title: voice.title})
			task.setReply({id: answer[0].id, title: answer[0].title})
		}
	})
})
function reStart(){
	if(!task.selectVoice) return uni.$u.toast('请选择语音库')
	if(!task.selectReply) return uni.$u.toast('请选择回复')
	const parame = {
		...detail,
		voice_id: task.selectVoice.id,
		answer_id: task.selectReply.id, 
		type: 1,
	}
	createLiveRoom(parame).then(res=>{
		if(res){
			// 开始直播
			uni.redirectTo({url: '/tabber/live/index'})
			// uni.switchTab({url: '/tabber/live/index'})
		}
	})
}
onBeforeUnmount(()=>{
	if(task.selectVoice) task.setVoice(null)
	if(task.selectReply) task.setReply(null)
})
</script>

<style lang="scss" scoped>
.page2{
	padding: 10rpx 20rpx;
	min-height: 100vh;
	background: #f8f8f8;
}
.between{
	flex-direction: row!important;
	align-items: center;
	justify-content: space-between;
}
.panel{
	width: 710rpx;
	background: #ffffff;
	border-radius: 20rpx;
	padding: 30rpx;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	margin: 30rpx 0;
	position: relative;
	overflow: hidden;
	&.shadow{
		box-shadow: 0 0 8rpx 0 #e0e0e0;
	}
	.tit{
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
	}
	.name{
		width: 125rpx;
		height: 31rpx;
		font-size: 30rpx;
		color: #1e64fe;
	}
	.iptBox{
		width: 620rpx;
		height: 60rpx;
		border: 2rpx solid #2281FE;
		border-radius: 30rpx;
		padding: 0 20rpx 0 20rpx;
		position: relative;
		z-index: 2;
		margin: 30rpx 0 26rpx;
	}
	.ipt{
		width: 100%;
		height: 60rpx;
	}
	.searchText{
		font-size: 30rpx;
		padding-left: 14rpx;
		font-weight: 700;
		position: relative;
		z-index: 1;
	}
	.liveName{
		font-size: 30rpx;
		color: #333;
	}
	.icon-msg{
		position: absolute;
		bottom: -4rpx;
		right: -10rpx;
		width: 182rpx;
		height: 216rpx;
		z-index: 0;
	}
	.add{
		width: 134rpx;
		height: 44rpx;
		margin: 0;
	}
	.lebel{
		font-size: 32rpx;
	}
	.mar20{
		margin-bottom: 20rpx;
	}
}
.fixedArea{
	box-sizing: content-box;
	height: 128rpx;
	width: 710rpx;
	padding-top: 40rpx;
	padding-left: 20rpx;
	padding-right: 20rpx;
	position: fixed;
	bottom: 0;
	left: 0;
	background-color: #f8f8f8;
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);
	.submit{
		height: 88rpx;
		background: #2281fe;
		font-size: 36rpx;
	}
}
.placeholder{
	box-sizing: content-box;
	width: 710rpx;
	height: 168rpx;
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);
}
.selectItem{
	min-height: 40px;
	background: #ffffff;
	border: 2rpx solid #2281fe;
	border-radius: 10rpx;
	display: flex;
	align-items: center;
	margin-top: 20rpx;
	font-size: 28rpx;
	color: #333;
	padding: 20rpx;
	.voice{
		width: 36rpx;
		height: 36rpx;
		margin-right: 8rpx;
	}
}
</style>