<template>
<view class="page">
	<image src="/static/images/template/bg5.png" class="bg"></image>
	<view class="content">
		<!-- 顶部header -->
		<u-navbar bgColor="transparent" title="创意宝" titleStyle="font-size:36rpx;font-weight:bold;color:#333" :fixed="false">
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
				<image src="/static/images/template/sticker5_1.png" class="sticker" mode="widthFix"></image>
			</view>
			<view class="menu m2" @click="goTo('/pagesub/reply/list')">
				<view class="h3">智能回复库</view>
				<view class="desc">评论区关键词回复</view>
				<view class="btn">立即体验</view>
				<image src="/static/images/template/sticker5_2.png" class="sticker" mode="widthFix"></image>
			</view>
			<view class="menu m3" @click="goTo('/pagesub/store/tasks')">
				<view class="h3">话术库</view>
				<view class="desc">专业通用话术</view>
				<view class="btn">立即体验</view>
				<image src="/static/images/template/sticker5_3.png" class="sticker" mode="widthFix"></image>
			</view>
			<view class="menu m4" @click="goTo('/pagesub/ai/index')">
				<view class="h3">AI创作</view>
				<view class="desc">定制不同行业文案</view>
				<view class="btn">立即体验</view>
				<image src="/static/images/template/sticker5_4.png" class="sticker" mode="widthFix"></image>
			</view>
			<view class="menu m5" @click="goTo('/pagesub/common/voice')">
				<view class="h3">公共语音库</view>
				<view class="desc">专业通用语音</view>
				<view class="btn">立即体验</view>
				<image src="/static/images/template/sticker5_5.png" class="sticker" mode="widthFix"></image>
			</view>
			<view class="menu m6" @click="goTo('/pagesub/goods/index')">
				<view class="h3">商品库</view>
				<view class="desc">添加或修改商品</view>
				<view class="btn">立即体验</view>
				<image src="/static/images/template/sticker5_6.png" class="sticker" mode="widthFix"></image>
			</view>
			<view class="menu m6" @click="goTo('/pagesub/goods/index')">
				<view class="h3">AI试衣</view>
				<view class="desc">添加或修改商品</view>
				<view class="btn">立即体验</view>
				<image src="/static/images/template/sticker5_6.png" class="sticker" mode="widthFix"></image>
			</view>
		</view>
	</view>
</view>
</template>

<script setup>
import { goTo } from '@/utils/helper.js'
import { useUserStore } from '@/stores'
import { onLoad } from '@dcloudio/uni-app'

const user = useUserStore()
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

onLoad(() => {
	console.log('Template5 加载，当前登录状态:', user.isLogin)
	// 初始化store
	user.initStore()
})
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
		height: 552rpx;
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
			width: 220rpx;
			height: 255rpx;
			background: #fff7f6;
			border: 1rpx solid #ffefea;
			border-radius: 20rpx;
			margin-left: 20rpx;
			margin-bottom: 20rpx;
			position: relative;
			padding: 20rpx 22rpx 0 20rpx;
		}
		
		.sticker{
			width: 80rpx;
			height: 80rpx;
			position: absolute;
			right: 12rpx;
			bottom: 12rpx;
		}
		.h3{
			color: #333333;
			font-size: 30rpx;
			font-weight: 700;
			// line-height: 34rpx;
		}
		.desc{
			color: #666666;
			font-size: 20rpx;
			// line-height: 23rpx;
			margin: 16rpx 0 16rpx;
		}
		.btn{
			width: 125rpx;
			height: 35rpx;
			background: #ffffff;
			border: 1rpx solid #4886ff;
			border-radius: 17rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #4886ff;
			font-size: 18rpx;
		}
		.m1{
			background: #fff7f6;
			border: 1rpx solid #ffefea;
			.h3,.desc{
				color: #FE6738;
			}
			.btn{
				border: 1rpx solid #fe6738;
				color: #FE6738;
			}
		}
		.m2{
			background: #E6FFF5;
			border: 1rpx solid #e6fff5;
			.h3{
				color: #32B051;
			}
			.desc{
				color: #0C9F30;
			}
			.btn{
				border: 1rpx solid #32B051;
				color: #32B051;
			}
		}
		.m3{
			background: #FFEFEA;
			border: 1rpx solid #ffefea;
			.h3,.desc{
				color: #FE8732;
			}
			.btn{
				border: 1rpx solid #fe8732;
				color: #FE8732;
			}
		}
		.m4{
			background: #FFEAEC;
			border: 1rpx solid #FFEAEC;
			.h3,.desc{
				color: #FE3E7A;
			}
			.btn{
				border: 1rpx solid #FE3E7A;
				color: #FE3E7A;
			}
		}
		.m5{
			background: #EAF5FF;
			border: 1rpx solid #EAF5FF;
			.h3,.desc{
				color: #226AE4;
			}
			.btn{
				border: 1rpx solid #226AE4;
				color: #226AE4;
			}
		}
		.m6{
			background: #F9F6FF;
			border: 1rpx solid #F9F6FF;
			.h3{
				color: #A133FE;
			}
			.desc{
				color: #A133FE;
			}
			.btn{
				border: 1rpx solid #A133FE;
				color: #A133FE;
			}
		}
	}
}
</style>