<template>
<view class="page">
	<view class="panel">
		<view class="title">回复标题</view>
		<u--input placeholder="请输入标题" border="bottom" v-model.trim="form.title" :disabled="isEdit"></u--input>
	</view>
	<view class="panel">
		<view class="title fcc-sb">
			<view>关键词<text class="r">*关键词一行一个</text></view>
			<u-button type="primary" text="增加" class="addBtn" @click="addBtn" v-show="showAddBtn"></u-button>
		</view>
		<view class="iptBox" v-for="(item, i) in form.keywords" :key="i">
			<u-input 
				placeholder="请输入关键词" 
				border="none" 
				v-model.trim="form.keywords[i]" 
				class="ipt" 
				cursor-spacing="10"
			>
				<template slot="suffix" #suffix>
					<u-icon name="trash-fill" size="50rpx" color="#1E64FE" @click="delKeyword(i)"></u-icon>
				</template>
			</u-input>
		</view>
		<transition>
			<view class="iptBox" v-show="!showAddBtn">
				<u--input 
					class="ipt"
					placeholder="请输入关键词" 
					border="none" 
					v-model.trim="iptword" 
					@blur="updateKeyword" 
					autoBlur
				></u--input>
			</view>
		</transition>
	</view>
	<u-button type="primary" text="确定保存" shape="circle" class="submit" @click="backToList"></u-button>
</view>
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app'
import { addKeyword, editKeyword } from '@/api'
import { useReplyStore } from '@/stores'

const reply = useReplyStore()
const form = reactive({
	answer_id: '',
	title: '',
	keywords: [],
})
const iptword = ref('')
const isEdit = ref(false)
const showAddBtn = ref(false)

const redirect = url => uni.redirectTo({url})
onLoad((option)=>{
	const { id, rid } = option // id: 项目id, rid: 回复id
	form.answer_id = id
	if(rid && reply.replyTemp){
		// 进入编辑模式
		const { title, keywords } = reply.replyTemp
		form.title = title
		form.keywords = keywords||[]
		isEdit.value = true
		showAddBtn.value = true
	}
})
function updateKeyword(val){
	if(val){
		showAddBtn.value = true
		iptword.value = ''
		form.keywords.push(val)
	}
}
function addBtn(){
	showAddBtn.value = false
}

// 删除关键字
function delKeyword(index){
	form.keywords.splice(index, 1)
}

async function backToList(){
	const res = isEdit.value ? await editKeyword(reply.replyTemp.id, {keywords: form.keywords}) : await addKeyword(form);
	if(res){
		uni.showToast({title: '保存成功', icon: 'success', duration: 1000});
		setTimeout(uni.navigateBack, 1000)
	}
}
onBeforeUnmount(()=>{
	if(isEdit.value) reply.saveReplyTemp(null)
})
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
		margin: 30rpx 0;
	}
	.title{
		font-size: 32rpx;
		font-weight: 700;
		color: #000;
		margin-bottom: 20rpx;
		.r{
			font-size: 22rpx;
			margin-left: 6rpx;
		}
		.addBtn{
			font-size: 24px;
			width: 100rpx;
			margin: 0;
		}
	}
	.submit{
		margin-top: 100rpx;
		height: 88rpx;
		background: #2281fe;
		font-size: 36rpx;
	}
	.iptBox{
		width: 640rpx;
		height: 80rpx;
		border: 2rpx solid #2281FE;
		border-radius: 10rpx;
		padding: 0 20rpx 0 30rpx;
		position: relative;
		z-index: 2;
		margin: 30rpx 0 26rpx;
	}
	.ipt{
		width: 100%;
		height: 80rpx;
	}
}
</style>