<template>
<view class="page">
	 <scroll-view :scroll-y="true" :scroll-top="scrollTop" class="scrollView" ref="scrollArea">
		<view class="con">
			<view class="msgRow">
				<u-avatar src="/static/images/ai/gpt.png" :size="72" class="bot"></u-avatar>
				<view class="msgBox">您好，很高兴为您服务，有什么可以帮助您？</view>
			</view>
			<template v-for="item in msgList">
				<view :class="['msgRow',{'user': item.type===1}]">
					<u-avatar src="/static/images/ai/gpt.png" :size="72" class="bot" v-if="item.type===0"></u-avatar>
					<view class="msgBox" @longpress="copyText(item.msg)">{{item.msg}}</view>
					<u-avatar src="/static/images/ai/humen.png" :size="72" class="human" v-if="item.type===1"></u-avatar>
				</view>
			</template>
			<view class="msgRow" v-if="loading">
				<u-avatar src="/static/images/ai/gpt.png" :size="72" class="bot"></u-avatar>
				<view class="msgBox" v-if="textWriter">{{ textWriter }}</view>
				<view class="msgBox" v-else><image src="/static/images/ai/load.gif" class="loading" mode="widthFix"/></view>
			</view>
		</view>
	</scroll-view>
	<view class="fixedBot safeArea between">
		<u--input
		    placeholder="输入您想说的话~"
		    border="surround"
		    v-model="question"
			class="inputBox"
			@confirm="submit"
		></u--input>
		<image src="/static/images/ai/send.png" class="send" @click="submit"></image>
	</view>
</view>
</template>

<script setup>
import { nextTick, onBeforeUnmount } from 'vue';
import { chatGPT } from '@/api'
const scrollTop = ref('')
const msgList = ref([])
const question = ref('')
const textWriter = ref('')
const loading = ref(false)
let query = null, typingStr= ''

function copyText(data){
	if(!data) return
	uni.setClipboardData({
		data,
		success: function () {
			uni.showToast({title: '内容复制成功', icon: 'success', duration: 1000});
		}
	});
}
function scrollBottom() {
    //聊天滚动底部方法
	if(!query) query = uni.createSelectorQuery().select('.con').boundingClientRect()
    query.exec(function (res) {
        scrollTop.value = res[0].height
    });
}
function typing(str){
	// js打字效果
	let i = 0;
	let timer = setInterval(function(){
		if (i <= str.length) {
			textWriter.value = str.slice(0, i++) + '_'
		} else {
			textWriter.value = str
			clearInterval(timer)
			nextTick(()=>{
				textWriter.value = ''
				msgList.value.push({msg: str, type: 0})
				loading.value = false
			})
		}
		scrollBottom()
	}, 100)
}
function submit(){
    if(!question.value||loading.value) return
	// 先显示用户发的信息
	msgList.value.push({msg: question.value, type: 1})
	loading.value = true
	nextTick(scrollBottom)
	// 再请求chatGPT
	chatGPT({data: question.value}).then(res=>{
		if(res){
			const msg = res.data[0]
			typing(msg)
		}
	}).catch(()=>loading.value = false)
	// 重置
	question.value = ''
}
onBeforeUnmount(()=>{
	query = null
})
</script>

<style lang="scss" scoped>
.page{
    display: flex;
    flex-direction: column;
    background: #f2f2f2;
    height: 100vh;
	overflow: hidden;
    .scrollView{
		flex: 1;
		height: calc(100vh - 120rpx);
		overflow-anchor: auto;
    }
    .con{
        padding: 44rpx 30rpx 20rpx;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }
	.msgRow{
		display: flex;
		width: 100%;
		.bot{
			margin-right: 20rpx;
			width: 72rpx;
			height: 72rpx;
		}
		.human{
			margin-left: 20rpx;
			width: 72rpx;
			height: 72rpx;
		}
	}
    .msgBox{
        display: inline-block;
        max-width: 462rpx;
        background: #ffffff;
        border: 1rpx solid #ffffff;
        border-radius: 0 32rpx 32rpx 32rpx;
        padding: 20rpx 22rpx;
        margin-bottom: 34rpx;
        font-size: 28rpx;
        color: #201E1E;
		word-break: break-all;
		.loading{
			width: 100rpx;
		}
    }
	.user{
		justify-content: flex-end;
		.msgBox{
			background: #2281FE!important;
			border-radius: 32rpx 0 32rpx 32rpx!important;
			color: #fff!important;
		}
	}
    .fixedBot{
        width: 750rpx;
		height: 120rpx;
        // min-height: 120rpx;
        background: #ffffff;
        // box-sizing: content-box;
		padding-top: 24rpx;
		padding-bottom: 24rpx;
        padding-left: 40rpx;
        padding-right: 40rpx;
		overflow: hidden;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-shrink: 0;
        .inputBox{
            width: 586rpx;
            border: 1rpx solid #d2d2d2;
            border-radius: 38rpx;
            padding: 0 30rpx;
        }
        .send{
            width: 64rpx;
            height: 64rpx;
			margin-left: 14rpx;
        }
    }
}
</style>