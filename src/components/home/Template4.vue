<template>
<view class="page">
	<image src="/static/images/template/bg4.png" class="bg"></image>
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
			<view class="flex meunsBox">
				<view>
					<view class="menu1 fcc-sb" @click="goTo('/pagesub/voices/index')">
						<view class="subInfo">
							<view class="title">AI语音库</view>
							<view class="sub">话术支持循环播放</view>
							<view class="btn flex-rcc">立即体验</view>
						</view>
						<image src="/static/images/template/sticker4_1.png" class="sticker" mode="widthFix"></image>
					</view>
					<view class="menu1 fcc-sb" @click="goTo('/pagesub/reply/list')">
						<view class="subInfo">
							<view class="title">智能回复库</view>
							<view class="sub">评论区关键词回复</view>
							<view class="btn flex-rcc">立即体验</view>
						</view>
						<image src="/static/images/template/sticker4_3.png" class="sticker" mode="widthFix"></image>
					</view>
				</view>
				<view class="menu2" @click="goTo('/pagesub/store/tasks')">
					<view class="subInfo">
						<view class="title">话术库</view>
						<view class="sub">专业通用话术</view>
						<view class="btn flex-rcc">立即体验</view>
					</view>
					<view class="stickerBox">
						<image src="/static/images/template/sticker4_2.png" class="sticker2" mode="widthFix"></image>
					</view>
				</view>
			</view>
			
			<view class="flex meunsBox">
				<view class="menu2" @click="goTo('/pagesub/ai/index')">
					<view class="subInfo">
						<view class="title">AI创作</view>
						<view class="sub">定制不同行业文案</view>
						<view class="btn flex-rcc">立即体验</view>
					</view>
					<view class="stickerBox">
						<image src="/static/images/template/sticker4_5.png" class="sticker2" mode="widthFix"></image>
					</view>
				</view>
				<view>
					<view class="menu1 fcc-sb" @click="goTo('/pagesub/common/voice')">
						<view class="subInfo">
							<view class="title">公共语音库</view>
							<view class="sub">专业通用语音</view>
							<view class="btn flex-rcc">立即体验</view>
						</view>
						<image src="/static/images/template/sticker4_4.png" class="sticker" mode="widthFix"></image>
					</view>
					<view class="menu1 fcc-sb" @click="goTo('/pagesub/goods/index')">
						<view class="subInfo">
							<view class="title">商品库</view>
							<view class="sub">添加或修改商品</view>
							<view class="btn flex-rcc">立即体验</view>
						</view>
						<image src="/static/images/template/sticker4_6.png" class="sticker" mode="widthFix"></image>
					</view>
				</view>
				
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
		height: 445rpx;
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
			padding: 0 20rpx;
			.title{
				font-size: 36rpx;
				font-family: Microsoft YaHei, Microsoft YaHei-Bold;
				font-weight: 700;
				color: #333333;
			}
			.sub{
				font-size: 22rpx;
				font-family: Microsoft YaHei, Microsoft YaHei-Regular;
				font-weight: 400;
				color: #333333;
				line-height: 38rpx;
			}
			.btn{
				width: 109rpx;
				height: 35rpx;
				background: #ffffff;
				border: 1rpx solid #4886ff;
				border-radius: 17rpx;
				font-size: 18rpx;
				font-family: Microsoft YaHei, Microsoft YaHei-Regular;
				font-weight: 400;
				color: #4886ff;
			}
		}
		.meunsBox{
			width: 100%;
			display: flex;
			justify-content: space-between;
		}
		.menu1{
			width: 425rpx;
			height: 150rpx;
			background: #fafbff;
			border: 1rpx solid #f2f2f2;
			border-radius: 20rpx;
			padding: 0 25rpx;
			box-sizing: border-box;
			margin-bottom: 20rpx;
			.sticker{
				width: 92rpx;
				height: 85rpx;
			}
		}
		.menu2{
			width: 272rpx;
			height: 320rpx;
			background: #fafbff;
			border: 1rpx solid #f2f2f2;
			border-radius: 20rpx;
			padding: 30rpx;
			box-sizing: border-box;
			justify-content: flex-end;
			.stickerBox{
				width: 100%;
				display: flex;
				justify-content: flex-end;
				padding-top: 30rpx;
			}
			.sticker2{
				width: 111rpx;
				height: 109rpx;
			}
		}
		
	}
}
</style>