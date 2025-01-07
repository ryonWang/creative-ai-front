<template>
<view :class="['panel',{'expand': !showMore}]">
	<view class="dele" @click="deleteItem"><u-icon name="trash" size="34rpx" color="#fff"></u-icon></view>
	<view class="fir">
		<view class="index">{{ index }}</view>
		<u--text :text="data.title" :lines="1" size="30rpx" bold color="#333"></u--text>
	</view>
	<view class="iptBox vcenter">
		<text class="keyword">{{data.keywords?data.keywords.join('/'):'暂无关键词'}}</text>
	</view>
	<view class="iptBox between" v-for="(item, i) in list">
		<view class="vcenter">
			<u-icon :name="isplay&&playId==item.id?'pause-circle-fill':'play-circle-fill'" size="50rpx" color="#1E64FE" @click="togglePlay(item)"></u-icon>&nbsp;
			<u--text :text="item.title||item.upload.name" :lines="1" size="28rpx" color="#333"></u--text>
		</view>
		<u-icon name="trash-fill" size="50rpx" color="#1E64FE" @click="delReplyVoice(item.id)"></u-icon>
	</view>
	<view class="btnGroup" v-if="!showMore">
		<button class="btn" @click="goTo('/pagesub/voices/upload?type=2&id='+data.id)">上传</button>
		<button class="btn" @click="goTo('/pagesub/voices/transcribe?type=2&id='+data.id)">录制</button>
		<button class="btn" @click="editKeyword">添加关键词</button>
	</view>
	<view class="center expand" v-if="showMore" @click="toggleExt"><u-icon name="arrow-down" color="#999" size="32rpx"></u-icon>&nbsp;展开更多</view>
	<view class="center" v-else @click="toggleExt"><u-icon name="arrow-up" color="#999" size="32rpx"></u-icon>&nbsp;收起</view>
</view>
</template>

<script setup>
import { goTo } from '@/utils/helper.js'
import { useReplyStore } from '@/stores'
import { deleReply, deleReplyVoice } from '@/api'

const emit = defineEmits(['refresh']);
const props = defineProps({
    data: {
        type: Object,
        require: true,
		default: {
			keywords: [], // 关键词
			media: [] // 录音数据
		}
    },
	index:{
		type: Number,
		require: true,
	},
	answer_id: {
		require: true,
	},
});

const reply = useReplyStore()
const showMore = ref(true)
const list = computed(()=>{
	return showMore.value ? props.data.media.slice(0,1) : props.data.media
})
const isplay = ref(false)
const playId = ref(null)
let innerAudioContext = null;

function deleteItem(){
	uni.showModal({
		title: '提示',
		content: `是否确定删除当前回复(${props.data.title})?`,
		success: function (res) {
			if (res.confirm) {
				deleReply(props.data.id).then(res=>{
					uni.showToast({title: '删除成功', icon: 'success', duration: 2000});
					emit('refresh')
				})
			}
		}
	})
}
function delReplyVoice(id){
	uni.showModal({
		title: '提示',
		content: `是否确定删除当前回复语音片段?`,
		success: function (res) {
			if (res.confirm) {
				deleReplyVoice(id).then(res=>{
					uni.showToast({title: '删除成功', icon: 'success', duration: 2000});
					emit('refresh')
				})
			}
		}
	})
}
function toggleExt(){
	showMore.value = !showMore.value
}
function editKeyword(){
	reply.saveReplyTemp(props.data)
	goTo(`/pagesub/reply/add?id=${props.answer_id}&rid=${props.data.id}`)
}
function togglePlay(item){
	// if(playId.value===item.id) return
	if(!innerAudioContext){
		innerAudioContext = uni.createInnerAudioContext();
		innerAudioContext.onEnded(()=>isplay.value = false);
	}
	if(!isplay.value||playId.value!=item.id){
		playId.value = item.id
		// 未播放点击播放
		innerAudioContext.autoplay = true;
		innerAudioContext.src = item.upload.full_path;
		innerAudioContext.play();
		isplay.value = true
	}else if(isplay.value){
		// 已播放点击停止
		innerAudioContext.stop()
		isplay.value = false
	}
}
onBeforeUnmount(()=>{
	if(innerAudioContext) innerAudioContext.destroy();
})
</script>

<style lang="scss" scoped>
.center{
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 30rpx 0;
	font-size: 24rpx;
	color: #999;
}
.between{
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.panel{
	width: 710rpx;
	min-height: 184rpx;
	background: #ffffff;
	border-radius: 20rpx;
	padding: 30rpx 30rpx 0;
	position: relative;
	margin: 15rpx 0;
	transition: all 1s;
	&.expand{
		height: auto!important;
		overflow: hidden;
	}
	.fir{
		display: flex;
		align-items: center;
	}
	.index{
		width: 40rpx;
		height: 40rpx;
		background: #f2faff;
		border-radius: 50%;
		color: #2281fe;
		font-size: 32rpx;
		font-weight: 700;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right: 14rpx;
	}
	.dele{
		position: absolute;
		right: 0;
		top: 0;
		width: 53rpx;
		height: 53rpx;
		background: #2281fe;
		border-radius: 0 20rpx 0 20rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.iptBox{
		width: 640rpx;
		min-height: 80rpx;
		border: 2rpx solid #2281FE;
		border-radius: 10rpx;
		position: relative;
		z-index: 2;
		margin: 20rpx 0 0;
		padding: 20rpx;
		.keyword{
			line-height: 40rpx;
		}
	}
	.ipt{
		width: 100%;
		height: 80rpx;
	}
	.btnGroup{
		display: flex;
		justify-content: center;
		margin-top: 26rpx;
		.btn{
			height: 55rpx;
			background: #e8f2ff;
			border: 2rpx solid #2281fe;
			border-radius: 10rpx;
			font-size: 26rpx;
			color: #333;
			display: flex;
			justify-content: center;
			align-items: center;
			margin: 0 20rpx;
			&:after{
				border: 0;
			}
		}
	}
}
</style>