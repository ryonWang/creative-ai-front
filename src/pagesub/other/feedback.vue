<template>
<view class="page">
	<view class="panel">
		<view class="title">反馈内容</view>
		<u--textarea v-model="feedback" placeholder="请输入内容" class="content" height="286"></u--textarea>
	</view>
	<u-button type="primary" text="确定" shape="circle" class="submit" @click="submit"></u-button>
</view>
</template>

<script setup>
import { sendFeedBack } from '@/api'
import { useUserStore } from '@/stores/index'

const user = useUserStore()
const feedback = ref('')

function submit(){
	sendFeedBack({detail: feedback.value, user_id: user.info.userId }).then(res=>{
		if(res){
			uni.showToast({title: '反馈提交成功', icon: 'success', duration: 1500});
			setTimeout(()=>uni.switchTab({url: '/tabber/me/index'}), 1500)
		}
	})
}
</script>

<style lang="scss" scoped>
.page{
	padding: 36rpx 20rpx;
	min-height: 100vh;
	background: #f8f8f8;
	.panel{
		width: 710rpx;
		min-height: 400rpx;
		background: #ffffff;
		border-radius: 20rpx;
		padding: 30rpx;
	}
	.title{
		font-size: 30rpx;
		color: #000;
		margin-bottom: 20rpx;
	}
	.content{
		background: #f8f8f8;
		border-radius: 20rpx;
	}
	.submit{
		margin-top: 100rpx;
		height: 88rpx;
		background: #2281fe;
		font-size: 36rpx;
	}
}
</style>