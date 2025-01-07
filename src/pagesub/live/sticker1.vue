<template>
<view class="liveScreen">
	<live-pusher
		id='livePusher' 
		ref="livePusher" 
		class="livePusher" 
		url=""
	    mode="SD" 
		:muted="true" 
		:enable-camera="true" 
		:auto-focus="true" 
		:beauty="1" 
		whiteness="2"
	    aspect="9:16" 
		@statechange="statechange"
		@error = "error"
	></live-pusher>
	<button class="btn" @click="startPreview">开启摄像头预览</button>
	<button class="btn" @click="stopPreview">关闭摄像头预览</button>
	<!-- 悬浮的可拖动区域 -->
	<movable-area class="fixedScreen" :scale-area="true">
		<movable-view 
			class="block" 
			:x="x" 
			:y="y" 
			:inertia="true" 
			:scale="true"
			direction="all" 
			@change="onChange"
		>text</movable-view>
	</movable-area>
</view>
</template>

<script setup>
import { onLoad, onReady, onShow, onHide, onUnload } from '@dcloudio/uni-app'
import { useConfigStore, useTaskStore, useLiveStore } from '@/stores'
import { getLiveTit, createLiveRoom } from '@/api'
import { goTo, checkAppPermissions } from '@/utils/helper'

const liveContext = null
const x = ref(0)
const y = ref(0)
onReady(()=>{
	console.log(1111, liveContext)
	if(!liveContext){
		liveContext = uni.createLivePusherContext("livePusher", this);
	}
})
// onUnload(()=>{
// 	if(context) context.stop()
// })
function onChange(e) {
	console.log(1111, e)
}
function startPreview(){
	liveContext.startPreview({
		success: (a) => {
			console.log("livePusher.startPreview:" + JSON.stringify(a));
		}
	});
}
function stopPreview(){
	liveContext.stopPreview({
		success: (a) => {
			console.log("livePusher.stopPreview:" + JSON.stringify(a));
		}
	});
}
function statechange(e) {
	console.log("success1:" + JSON.stringify(e));
}
function error(e) {
	console.log("fail1:" + JSON.stringify(e));
}

</script>

<style lang="scss" scoped>
.liveScreen{
	.livePusher{
		width: 750rpx;
		height: 100vh;
		background-color: #808080;
	}
	.fixedScreen{
		width: 750rpx;
		height: 1500rpx;
		position: fixed;
		top: 0;
		left: 0;
		.block{
			width: 400rpx;
			height: 400rpx;
			background-color: aqua;
		}
	}
}
</style>