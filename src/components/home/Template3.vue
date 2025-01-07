<template>
<view class="page">
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
			<view class="menuRow">
				<view class="menu m1" @click="goTo('/pagesub/voices/index')">
					<view class="h3">AI语音库</view>
					<view class="desc">话术支持循环播放</view>
					<view class="btn">立即体验</view>
					<image src="/static/images/template3/sticker1.png" class="sticker" mode="widthFix"></image>
					<view class="circle"></view>
				</view>
				<view class="rightCol">
					<view class="menu m2" @click="goTo('/pagesub/reply/list')">
						<view class="h3">智能回复库</view>
						<view class="desc">评论区关键词回复</view>
						<view class="btn">立即体验</view>
						<image src="/static/images/template3/sticker2.png" class="sticker" mode="widthFix"></image>
						<view class="circle"></view>
					</view>
					<view class="menu m3" @click="goTo('/pagesub/ai/index')">
						<view class="h3">AI创作</view>
						<view class="desc">定制不同行业文案</view>
						<view class="btn">立即体验</view>
						<image src="/static/images/template3/sticker3.png" class="sticker" mode="widthFix"></image>
						<view class="circle"></view>
					</view>
				</view>
			</view>
			<view class="menu m4" @click="goTo('/pagesub/store/tasks')">
				<view class="h3">话术库</view>
				<view class="desc">专业通用话术</view>
				<view class="btn">立即体验</view>
				<image src="/static/images/template3/sticker4.png" class="sticker" mode="widthFix"></image>
				<view class="circle"></view>
			</view>
			<view class="menu m5" @click="goTo('/pagesub/common/voice')">
				<view class="h3">公共语音库</view>
				<view class="desc">专业通用语音</view>
				<view class="btn">立即体验</view>
				<image src="/static/images/template3/sticker5.png" class="sticker" mode="widthFix"></image>
				<view class="circle"></view>
			</view>
			<view class="menu m6" @click="goTo('/pagesub/goods/index')">
				<view class="h3">商品库</view>
				<view class="desc">添加或修改商品</view>
				<view class="btn">立即体验</view>
				<image src="/static/images/template3/sticker6.png" class="sticker" mode="widthFix"></image>
				<view class="circle"></view>
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
		.menuRow{
			display: flex;
		}
		.menu{
			border-radius: 20rpx;
			margin-left: 20rpx;
			margin-bottom: 20rpx;
			position: relative;
			padding: 44rpx 40rpx 0 40rpx;
			overflow: hidden;
		}
		.circle{
			position: absolute;
			top: -20%;
			right: -5%;
			z-index: 0;
			border-radius: 50%;
		}
		.sticker{
			position: absolute;
			z-index: 1;
		}
		.h3{
			font-size: 36rpx;
			font-weight: 700;
			line-height: 34rpx;
			position: relative;
			z-index: 2;
		}
		.desc{
			color: #333333;
			font-size: 22rpx;
			line-height: 23rpx;
			margin: 16rpx 0 20rpx;
			position: relative;
			z-index: 2;
		}
		.btn{
			width: 110rpx;
			height: 35rpx;
			border-radius: 17rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #ffffff;
			font-size: 20rpx;
			position: relative;
			z-index: 2;
		}
		.m1{
			width: 388rpx;
			height: 330rpx;
			background: #f6fdfa;
			border: 2rpx solid #dcf9d4;
			.circle{
				width: 245rpx;
				height: 245rpx;
				background: linear-gradient(0deg,rgba(176,241,220,0.50) 0%, #ffffff 100%);
			}
			.h3{
				color: #2C554C;
			}
			.btn{
				background: #37DAB2;
			}
			.sticker{
				right: 30rpx;
				bottom: 24rpx;
				width: 152rpx;
				height: 152rpx;
			}
		}
		.m2{
			width: 301rpx;
			height: 152rpx;
			background: #fffefa;
			border: 2rpx solid #f9e5b5;
			padding: 22rpx 24rpx 0 24rpx;
			.circle{
				top: -25%;
				width: 166rpx;
				height: 166rpx;
				background: linear-gradient(0deg,rgba(255,240,214,0.50) 0%, #ffffff 100%);
			}
			.h3{
				color: #9d781f;
			}
			.desc{
				margin: 12rpx 0 9rpx;
			}
			.btn{
				background: #faba40;
			}
			.sticker{
				right: 12rpx;
				bottom: 10rpx;
				width: 86rpx;
				height: 86rpx;
			}
		}
		.m3{
			width: 301rpx;
			height: 152rpx;
			background: #f7f9fd;
			border: 2rpx solid #e5edff;
			padding: 22rpx 24rpx 0 24rpx;
			.circle{
				top: -25%;
				width: 166rpx;
				height: 166rpx;
				background: linear-gradient(0deg,#e1eeff 0%, #ffffff 100%);
			}
			.h3{
				color: #475475;
			}
			.desc{
				margin: 12rpx 0 9rpx;
			}
			.btn{
				background: #037bf5;
			}
			.sticker{
				right: 12rpx;
				bottom: 10rpx;
				width: 86rpx;
				height: 86rpx;
			}
		}
		.m4{
			width: 310rpx;
			height: 215rpx;
			background: #fcfaff;
			border: 2rpx solid #fcdaff;
			.circle{
				width: 182rpx;
				height: 182rpx;
				background: linear-gradient(0deg,rgba(239,222,245,0.50) 0%, #ffffff 99%);
			}
			.h3{
				color: #5b516d;
			}
			.desc{
				margin: 12rpx 0 9rpx;
			}
			.btn{
				background: #9b34fe;
			}
			.sticker{
				right: 24rpx;
				bottom: 20rpx;
				width: 110rpx;
				height: 110rpx;
			}
		}
		.m5{
			width: 380rpx;
			height: 215rpx;
			background: #f7fcfe;
			border: 2rpx solid #d1eeff;
			.circle{
				width: 182rpx;
				height: 182rpx;
				background: linear-gradient(0deg,rgba(202,240,248,0.50) 0%, #ffffff 99%);
			}
			.h3{
				color: #34505e;
			}
			.desc{
				margin: 12rpx 0 9rpx;
			}
			.btn{
				background: #0994fd;
			}
			.sticker{
				right: 24rpx;
				bottom: 20rpx;
				width: 110rpx;
				height: 110rpx;
			}
		}
		.m6{
			width: 380rpx;
			height: 215rpx;
			background: #fffbfa;
			border: 2rpx solid #ffe2d1;
			.circle{
				width: 182rpx;
				height: 182rpx;
				background: linear-gradient(0deg,rgba(255,208,138,0.50) 0%, #ffffff 99%);
			}
			.h3{
				color: #34505e;
			}
			.desc{
				margin: 12rpx 0 9rpx;
			}
			.btn{
				background: #feab4a;
			}
			.sticker{
				right: 24rpx;
				bottom: 20rpx;
				width: 110rpx;
				height: 110rpx;
			}
		}
	}
}
</style>