<template>
<view class="page">
	<image src="/static/images/template/bg1.png" class="bg"></image>
	<view class="content">
		<!-- 顶部header -->
		<u-navbar bgColor="transparent" title="首页" titleStyle="font-size:36rpx;font-weight:bold;color:#333" :fixed="false">
			<template #left><text></text></template>
		</u-navbar>
		<!-- 轮播图插槽 -->
		<view class="swiperBox">
			<slot></slot>
		</view>
		<!-- 菜单按钮区 -->
		<view class="menuArea">
			<view class="menu m1" @click="goTo('/pagesub/voices/index')">
				<view class="h3">AI语音库</view>
				<view class="desc">话术支持循环播放</view>
				<view class="btn">立即体验</view>
				<image src="/static/images/template/sticker1.png" class="sticker" mode="widthFix"></image>
			</view>
			<view class="menu m2" @click="goTo('/pagesub/reply/list')">
				<view class="h3">智能回复库</view>
				<view class="desc">评论区关键词回复</view>
				<view class="btn">立即体验</view>
				<image src="/static/images/template/sticker2.png" class="sticker" mode="widthFix"></image>
			</view>
			<view class="menu m3" @click="goTo('/pagesub/store/tasks')">
				<view class="h3">话术库</view>
				<view class="desc">专业通用话术</view>
				<view class="btn">立即体验</view>
				<image src="/static/images/template/sticker3.png" class="sticker" mode="widthFix"></image>
			</view>
			<view class="menu m4" @click="goTo('/pagesub/ai/index')">
				<view class="h3">AI创作</view>
				<view class="desc">定制不同行业文案</view>
				<view class="btn">立即体验</view>
				<image src="/static/images/template/sticker4.png" class="sticker" mode="widthFix"></image>
			</view>
			<view class="menu m5" @click="goTo('/pagesub/common/voice')">
				<view class="h3">公共语音库</view>
				<view class="desc">专业通用语音</view>
				<view class="btn">立即体验</view>
				<image src="/static/images/template/sticker5.png" class="sticker" mode="widthFix"></image>
			</view>
			<view class="menu m6" @click="goTo('/pagesub/goods/index')">
				<view class="h3">商品库</view>
				<view class="desc">添加或修改商品</view>
				<view class="btn">立即体验</view>
				<image src="/static/images/template/sticker6.png" class="sticker" mode="widthFix"></image>
			</view>
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
.page{
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	padding-bottom: 20rpx;
	position: relative;
	.bg{
		width: 750rpx;
		height: 1004rpx;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
	}
	.content{
		position: relative;
		z-index: 2;
		width: 750rpx;
		.swiperBox{
			width: 710rpx;
			height: 360rpx;
			box-sizing: border-box;
			margin: 20rpx auto 32rpx;
			border-radius: 10rpx;
			overflow: hidden;
		}
		.menuArea{
			display: flex;
			flex-wrap: wrap;
		}
		.menu{
			width: 345rpx;
			height: 360rpx;
			border-radius: 20rpx;
			margin-left: 20rpx;
			margin-bottom: 20rpx;
			position: relative;
			padding: 44rpx 40rpx 0 40rpx;
		}
		.m1{
			background: linear-gradient(180deg,#ecfff4 0%, #ffffff 100%);
			border: 2rpx solid #dcf9d4;
		}
		.m2{
			background: linear-gradient(180deg,#edf7ff 0%, #ffffff 100%);
			border: 2rpx solid #d3e4f8;
		}
		.m3{
			background: linear-gradient(180deg,#fff6f0 0%, #ffffff 100%);
			border: 2rpx solid #fce5c3;
		}
		.m4{
			background: linear-gradient(180deg,#fff0ff 0%, #ffffff 100%);
			border: 2rpx solid #ffdcfc;
		}
		.m5{
			background: linear-gradient(180deg,#f4f3ff 0%, #ffffff 100%);
			border: 2rpx solid #e4d3fd;
		}
		.m6{
			background: linear-gradient(180deg,#ecf7ff 0%, #ffffff 100%);
			border: 2rpx solid #d3edfd;
		}
		.sticker{
			position: absolute;
			right: 12rpx;
			bottom: 6rpx;
			width: 180rpx;
		}
		.h3{
			color: #333333;
			font-size: 36rpx;
			font-weight: 700;
			line-height: 34rpx;
		}
		.desc{
			color: #666666;
			font-size: 22rpx;
			line-height: 23rpx;
			margin: 16rpx 0 20rpx;
		}
		.btn{
			width: 135rpx;
			height: 44rpx;
			background: #ffffff;
			border: 2rpx solid #4886ff;
			border-radius: 22rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #4886ff;
			font-size: 22rpx;
		}
	}
}
</style>