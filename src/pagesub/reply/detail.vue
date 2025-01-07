<template>
<SafeAreaPage class="page2">
	<button class="create" @click="goTo('/pagesub/reply/add?id='+answer_id)">
		<image src="/static/images/reply/icon-msg.png" class="icon-crt"></image>
		<text>添加新回复</text>
	</button>
	<template v-if="plist.length>0">
		<ReplyItem v-for="(item, i) in plist" :index="i+1" :data="item" :answer_id="answer_id" @refresh="queryList(true)"></ReplyItem>
		<u-loadmore v-if="plist.length>=size" :status="listStatus" fontSize="28rpx" iconSize="30rpx" line/>
	</template>
	<u-empty v-else mode="data" textSize="28rpx"></u-empty>
</SafeAreaPage>
</template>

<script setup>
import { onLoad, onShow, onReachBottom } from '@dcloudio/uni-app'
import { goTo } from '@/utils/helper.js'
import { replyList } from '@/api'
import ReplyItem from '@/components/ReplyItem'
import SafeAreaPage from '@/components/SafeAreaPage'

const answer_id = ref(null)
const plist = ref([])
const listStatus = ref('loadmore')
let page = 1, last = 0;
const size = 20;

function queryList(init){
	if(!answer_id.value) return
	replyList(answer_id.value, {page, size}).then(res=>{
		if(res && res.data){
			const {list, total} = res.data
			plist.value = init ? list : plist.value.concat(list);
			last = Math.ceil(total/size)
			if(page >= last) listStatus.value = 'nomore';
		}
	})
}
onLoad((option)=>{
	answer_id.value = option.id
})
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
}
</style>