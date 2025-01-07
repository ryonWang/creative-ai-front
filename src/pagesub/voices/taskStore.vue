<template>
	<view class="container content">
		<view class="list" v-if="list.length>0">
			<scroll-view :scroll-top="0" scroll-y="true" style="height: 90vh;" class="scrollBox">
			<view class="item fcc-sb" v-for="(item,index) in list" :key="index" @click="select(item)">
				<view class="flex-rcc leftBox">
					<image class="lIcon" src="/static/images/voices/list-icon.png"></image>
					<view class="name u-line-1">{{item.title}}</view>
				</view>
				
				<image class="rIcon" src="/static/images/voices/select.png" v-if="current===item.id"></image>
			</view>
			</scroll-view>
		</view>
		
		<u-empty v-else mode="data" text="暂无数据" :marginTop="160" iconSize="160" textSize="28" style="width: 100%;"></u-empty>
		
		<view class="btn flex-rcc" v-if="list.length>0" @click="handleAdd">确定添加</view>
	</view>
</template>

<script setup>
	import { onLoad, onReady, onReachBottom } from '@dcloudio/uni-app'
	import { scriptIndex, voiceIndex, replyClassList } from '@/api'
	import { useTaskStore } from '@/stores'
	
	const useTask = useTaskStore()
	const type = ref(1) // 1 话术库 
	const current = ref(null)
	const list = ref([])
	const listStatus = ref('loadmore')
	let page = 1, last = 0, currentItem = {};
	const size = 50;
	
	onLoad((option)=>{
		type.value = Number(option.type)
		getList(true)
	})
	onReady(()=>{
		uni.setNavigationBarTitle({
			title: type.value===1? '话术库': type.value===2? '选择语音': '选择回复'
		})
	})
	
	const getList = (init) =>{
		const fun = type.value===1 ? scriptIndex : (type.value===2 ? voiceIndex : replyClassList)
		fun({page, size}).then(res=>{
			if(type.value===1){
				list.value = res.data
			}else{
				list.value =  init ? res.data.list : list.value.concat(res.data.list);
				last = Math.ceil(total/size)
				if(page >= last) listStatus.value = 'nomore';
			}
		})
	}
	const select = item =>{
		currentItem = item
		current.value = item.id
	}
	const handleAdd = ()=>{
		if(!current.value) return uni.$u.toast('请选择对应内容再添加！')
		switch (type.value){
			case 1:
				useTask.setTask(currentItem)
				break;
			case 2:
				useTask.setVoice(currentItem)
				break;
			case 3:
				useTask.setReply(currentItem)
				break;
		}
		uni.navigateBack()
	}
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
	.content {
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  padding: 36rpx 20rpx;
	  box-sizing: border-box;
	  position: relative;
	  .list {
		   width: 100%;
		   .scrollBox{
		   		 padding-bottom: 30rpx;
		   }
		  .item{
			  width: 100%;
			  height: 100rpx;
			  background: #ffffff;
			  border-radius: 20rpx;
			  padding: 28rpx 16rpx;
			  margin-bottom: 18rpx;
			  .leftBox{
				  width: 80%;
			  }
			  .lIcon{
				  width: 40rpx;
				  height: 40rpx;
			  }
			  .name{
				  width: 80%;
				  padding: 0 20rpx;
			  }
			  .rIcon{
				  width: 32rpx;
				  height: 32rpx;
			  }
		  }
	  }
	  .btn{
		  width: 710rpx;
		  height: 88rpx;
		  background: #2281fe;
		  border-radius: 44rpx;
		  font-size: 36rpx;
		  color: #ffffff;
		  position: absolute;
		  bottom: 28rpx;
		  left: 20rpx;
	  }
	}
</style>