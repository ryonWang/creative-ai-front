<template>
<view class="page">
	<view class="h1">请先选择直播方式</view>
	<view class="panel">
		<view class="li" @click="goTo('/tabber/live/index')">
			<image src="/static/images/live/default.png" class="topIcon" mode="widthFix"></image>
			<text class="name">AI专业直播</text>
			<text class="desc">{{desc.pt}}</text>
		</view>
		<u-gap height="1" bgColor="#D7D8D9"></u-gap>
		<view class="li" @click="selectHigh">
			<image src="/static/images/live/senior.png" class="topIcon" mode="widthFix"></image>
			<text class="name blue">AI高级直播</text>
			<text class="desc">{{desc.vip}}</text>
		</view>
	</view>
</view>
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app'
import { getLiveRoom, getLiveDesc } from '@/api'
import { goTo } from '@/utils/helper.js'

let flag = false
const desc = reactive({
	pt: 'ai语音库   智能回复  公屏互动',
	vip: 'ai语音库   智能回复  直播间搭建  公屏互动  自动弹商品卡片',
})
function selectHigh(){
	if(flag) return
	flag = true
	getLiveRoom({type: 2}).then(res=>{
		if(res && res.data){
			if(res.data.platform===3) return goTo('/pagesub/live/create2')
			console.log('res.data', res.data)
			// const { get_top, get_left, get_right, get_bottom } = res.data
			// live.setLiveRoomStick({
			// 	top: get_top ? [{status: 'success', message: '', url: get_top.full_path, id: get_top.id}] : [],
			// 	left: get_left ? [{status: 'success', message: '', url: get_left.full_path, id: get_left.id}] : [],
			// 	right: get_right ? [{status: 'success', message: '', url: get_right.full_path, id: get_right.id}] : [],
			// 	bottom: get_bottom ? [{status: 'success', message: '', url: get_bottom.full_path, id: get_bottom.id}] : []
			// })
			uni.showModal({
				title: '提示',
				content: '检测到您最近有创建过AI高级直播间, 是否使用最近一次的配置直接开始直播？',
				confirmText: '确定',
				showCancel: true,
				success: res => {
					const path = res.confirm ? 'sticker' : 'create2'
					goTo('/pagesub/live/'+path, ()=>{
						flag = false
					})
					
				}
			})
		}else{
			goTo('/pagesub/live/create2', ()=>{
				flag = false
			})
		}
	}).catch(()=>{
		goTo('/pagesub/live/create2', ()=>{
			flag = false
		})
	})
}

onLoad(()=>{
	getLiveDesc().then(res=>{
		if(res && res.data){
			desc.pt = res.data.pt
			desc.vip = res.data.vip
		}
	})
})
</script>

<style lang="scss" scoped>
.page{
	min-height: 100vh;
	background-color: #f8f8f8;
	.h1{
		font-size: 36rpx;
		font-weight: 400;
		height: 148rpx;
		line-height: 148rpx;
		color: #212121;
		text-align: center;
	}
	.panel{
		width: 710rpx;
		min-height: 854rpx;
		background: #ffffff;
		border-radius: 10rpx;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		padding: 0 30rpx;
	}
	.li{
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		color: #333333;
		.topIcon{
			width: 132rpx;
		}
		.name{
			margin-top: 24rpx;
			font-size: 36rpx;
		}
		.desc{
			font-size: 24rpx;
			margin-top: 12rpx;
		}
		.blue{
			color: #2281FE;
		}
	}
}
</style>