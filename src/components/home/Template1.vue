<template>
	<view class="content">
		<view class="headerBox" :style="{marginTop: `${statusBar}px`}">
			<image src="/static/logo.png" class="logo"></image>
			<text>{{app_name}}</text>
		</view>
		<view class="swiperBox">
			<slot></slot>
		</view>
		
		<view class="menus flex" >
			<view class="voiceBox" @click="goTo('/pagesub/voices/index')">
				<image src="/static/images/voices/voice.png"></image>
				<view class="name">
					<view>AI语音库</view>
					<view class="line"></view>
				</view>
			</view>
			<view class="flex-cc fcc-sb">
				<view class="r-box" @click="goTo('/pagesub/reply/list')">
					<image src="/static/images/voices/reply.png"></image>
					<view class="name name1">
						<view>智能回复</view>
						<view class="line blue"></view>
					</view>
				</view>
				<view class="r-box" @click="goTo('/pagesub/store/tasks')">
					<image src="/static/images/voices/tasks.png"></image>
					<view class="name name1">
						<view>话术库</view>
						<view class="line yellow"></view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="menus menus1 flex">
			<view class="r-box" @click="goTo('/pagesub/ai/index')">
				<image src="/static/images/voices/ai.png"></image>
			</view>
			<view class="r-box" @click="goTo('/pagesub/common/voice')">
				<image src="/static/images/voices/voices.png"></image>
			</view>
		</view>
		<view class="menus menus1 flex">
			<view class="r-box" @click="goTo('/pagesub/goods/index')">
				<image src="/static/images/voices/shop.png"></image>
			</view>
		</view>
		
	</view>
</template>

<script setup>
import { goTo } from '@/utils/helper.js'
const props = defineProps({
    statusBar: {
        type: Number,
        require: true,
    },
	app_name: {
		type: String,
		require: true,
	}
});
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding-bottom: 40rpx;
}
.swiperBox{
	width: 100%;
	height: 410rpx;
	box-sizing: border-box;
}
.headerBox{
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: flex-start;
	height: 136rpx;
	font-weight: bold;
	font-size: 36rpx;
	color: #060606;
	.logo{
		width: 70rpx;
		height: 70rpx;
		border-radius: 50%;
		margin: 0 20rpx;
	}
}

.menus{
	margin-top: 40rpx;
	width: 100%;
	padding: 0 20rpx;
	box-sizing: border-box;
	justify-content: space-between;
	.line{
		width: 57rpx;
		height: 8rpx;
		background: #72d75b;
		border-radius: 4rpx;
		margin-top: 14rpx;
	}
	image{
		width: 100%;
		height: 100%;
	}
	.voiceBox{
		width: 345rpx;
		height: 304rpx;
		position: relative;
	}
	.name{
		top: 40rpx;
		left: 40rpx;
		position: absolute;
		font-size: 36rpx;
		color: #333333;
	}
	.name1{
		top: 35rpx;
		left: 30rpx;
	}
	.r-box{
		width: 344rpx;
		height: 145rpx;
		position: relative;
	}
	.blue{
		background-color: #5CD3BF;
	}
	.yellow{
		background-color: #F4AE34;
	}
}
.menus1{
	margin-top: 23rpx;
}
</style>