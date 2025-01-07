<template>
<view class="page2">
	<button class="create" @click="goTo('/pagesub/reply/crt')">
		<image src="/static/images/reply/icon-create.png" class="icon-crt"></image>
		<text>创建新项目</text>
	</button>
	<template v-if="plist.length>0">
		<view class="panel" v-for="(item, i) in plist" :key="item.id">
			<view class="dele" @click="deleteItem(item)"><u-icon name="trash" size="34rpx" color="#fff"></u-icon></view>
			<view class="fir">
				<view class="index">{{i+1}}</view>
				<u--text :text="item.title" :lines="1" size="30rpx" bold color="#333"></u--text>
			</view>
			<view class="con">
				<view class="status" @click="goTo('/pagesub/reply/detail?id='+item.id)" v-if="item.answerKeywords">
					<text class="b">已创建回复</text>
					<u-icon name="arrow-right" size="34rpx" color="#999"></u-icon>
				</view>
				<view class="status" @click="goTo('/pagesub/reply/add?id='+item.id)" v-else>
					<text class="r">未创建回复</text>
					<u-icon name="arrow-right" size="34rpx" color="#999"></u-icon>
				</view>
			</view>
		</view>
		<u-loadmore v-if="plist.length>=size" :status="listStatus" fontSize="28rpx" iconSize="30rpx" line/>
	</template>
	<u-empty v-else mode="data" textSize="28"></u-empty>
</view>
</template>

<script setup>
import { onLoad, onReachBottom, onShow } from '@dcloudio/uni-app'
import { replyClassList, deleReplyClass } from '@/api'
import { goTo } from '@/utils/helper.js'

const feedback = ref('');
const plist = ref([])
const listStatus = ref('loadmore')
let page = 1, last = 0;
const size = 20;

function deleteItem(item){
	const {id, title} = item
	uni.showModal({
		title: '提示',
		content: `是否确定删除当前回复项目(${title})?`,
		success: function (res) {
			if (res.confirm) {
				deleReplyClass(id).then(res=>{
					uni.showToast({title: '删除成功', icon: 'success', duration: 2000});
					queryList(true)
				})
			}
		}
	})
}
function queryList(init){
	replyClassList({page, size}).then(res=>{
		if(res&&res.data){
			const {list, total} = res.data
			plist.value = init ? list : plist.value.concat(list);
			last = Math.ceil(total/size)
			if(page >= last) listStatus.value = 'nomore';
		}
	})
}
onShow(()=>queryList(true))
onReachBottom(()=>{
	if(page >= last) return;
	listStatus.value = 'loading'
	if(page < last){
		page++
		queryList()
	}
})
</script>

<style lang="scss" scoped>
.page2{
	padding: 2rpx 20rpx;
	min-height: 100vh;
	background: #f8f8f8;
	.create{
		width: 710rpx;
		height: 82rpx;
		background: #ffffff;
		border-radius: 10rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 30rpx 0;
		font-size: 30rpx;
		color: #333;
		&:after{
			border: 0!important;
		}
		.icon-crt{
			width: 40rpx;
			height: 40rpx;
			margin-right: 14rpx;
		}
	}
	.panel{
		width: 710rpx;
		min-height: 184rpx;
		background: #ffffff;
		border-radius: 20rpx;
		padding: 30rpx;
		position: relative;
		margin: 15rpx 0;
		.fir{
			display: flex;
			align-items: center;
		}
		.con{
			margin-top: 20rpx;
			min-height: 80rpx;
			background: rgba(34,129,254,0.10);
			border-radius: 10rpx;
			padding: 24rpx 20rpx;
			font-size: 28rpx;
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
		.status{
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
		.b{
			font-size: 28rpx;
			color: #333;
		}
	}
}
</style>