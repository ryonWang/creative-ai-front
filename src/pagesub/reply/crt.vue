<template>
<view class="page">
	<view class="panel">
		<view class="title">新项目名称</view>
		<u--input placeholder="请输入内容" border="bottom" v-model.trim="name"></u--input>
	</view>
	<u-button type="primary" text="确定添加" shape="circle" class="submit" @click="submit"></u-button>
</view>
</template>

<script setup>
import { crtReplyClass } from '@/api'
const name = ref('')
const redirect = url => uni.redirectTo({url})
function submit(){
	if(!name.value) return uni.showToast({title: '名称不能为空', icon: 'error'})
	crtReplyClass({title: name.value}).then(res=>{
		if(res&&res.data){
			// redirect('/pagesub/reply/list)
			uni.navigateBack()
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
		background: #ffffff;
		border-radius: 20rpx;
		padding: 30rpx;
	}
	.title{
		font-size: 32rpx;
		font-weight: 700;
		color: #000;
		margin-bottom: 20rpx;
	}
	.submit{
		margin-top: 100rpx;
		height: 88rpx;
		background: #2281fe;
		font-size: 36rpx;
	}
}
</style>