<template>
	<view class="container content">
		<view class="listBox" v-if="list.length>0">
			
				<scroll-view :scroll-top="0" scroll-y="true" style="height: 90vh;" class="scrollBox">
					
						<u-swipe-action autoClose>
							<movable-area style="width: 100%; height: 500px; border: 1px solid red;">
								<movable-view v-for="(item,index) in list" class="movableItem" :y="item.y" direction="vertical" inertia  :key="index"
								 @change="changeItem" @touchend="handleTouchEnd($event,index, item)">
										
									<u-swipe-action-item
									  :options="options1"
									  :name="index"
									  class="swiperItem"
									  @click="delItem(item)"
									>
										<view class="item flex-item-col-center" @click="handleItem(item)">
											<image :src="`/static/images/voices/${item.id === playDataId? 'pause': 'play'}.png`" class="sImage"></image>
											<view class="name u-line-1">{{item.title}}</view>
										</view>
									</u-swipe-action-item>
										
							</movable-view>
							 </movable-area>
						  </u-swipe-action>
					 
				</scroll-view>
			
		</view>
		<u-empty v-else mode="data" text="暂无语音,请上传或录制!" :marginTop="160" iconSize="160" textSize="28" style="width: 100%;"></u-empty>
		<view class="footterBox fcc-sb">
			<view class="btn flex-rcc" @click="toPath(`/pagesub/voices/upload?id=${id}`)">上传</view>
			<view class="btn btn2 flex-rcc" @click="toPath(`/pagesub/voices/transcribe?type=1&id=${id}`)">录制</view>
		</view>
		
		<u-modal :show="show" title="提示" :content='content' showCancelButton @confirm="ok" @cancel="show=false"></u-modal>
	</view>
</template>

<script setup>
	import { onLoad,onShow, onHide } from '@dcloudio/uni-app'
	import { voiceReaIndex, voiceReaDestory } from '@/api'
	import { useConfigStore } from '@/stores'
	
	const list = ref([])
	const config = useConfigStore()
	const options1=ref([{
                    text: '删除',
					style: {
						backgroundColor: '#fa3534'
					}
                }]) 
	
	const show = ref(false)
	const content = ref('请确认删除该语音?')
	const id = ref(null)
	onLoad((option)=>{
		config.getQnToken()
		id.value = option.id
		getList()
		innerAudioContext.onEnded(()=>{
			playDataId.value = null
		})
	})
	
	onShow(()=>{
		if(id.value){
			getList()
		}
	})
	
	const changeItem = event=>{
		// console.log('event', event.detail.y)
	}
	
	const handleTouchEnd = (e,index,item) => {
		const { x, y } = item
		const goIndex = Math.floor(y/50)
		if(goIndex>0){
			let nearestIndex = index
			let minDistance = Infinity
			for (let i = 0; i < list.value.length; i++) {
				if (i !== index) {
					const dx = list.value[i].x - x
					const dy = list.value[i].y - y
					const distance = Math.sqrt(dx ** 2 + dy ** 2)
					if (distance < minDistance) {
						nearestIndex = i
						minDistance = distance
					}
				}
			}
			
			const temp = list.value[index]
			list.value[index] = list.value[nearestIndex]
			list.value[nearestIndex] = temp
		}
		
		// 自动归位到最近的元素位置
		// let nearestIndex = index
		// let minDistance = Infinity
		// for (let i = 0; i < list.value.length; i++) {
		// 	if (i !== index) {
		// 		const dx = list.value[i].x - x
		// 		const dy = list.value[i].y - y
		// 		const distance = Math.sqrt(dx ** 2 + dy ** 2)
		// 		if (distance < minDistance) {
		// 			nearestIndex = i
		// 			minDistance = distance
		// 		}
		// 	}
		// }
		// 交换拖拽元素和最近元素的位置
		// const temp = list.value[index]
		// list.value[index] = list.value[nearestIndex]
		// list.value[nearestIndex] = temp
		// 更新元素位置
		list.value.forEach((item, index) => {
			item.x = 0
			item.y = index * 50
		})
	}
	
	// 获取语音库语音列表
	const getList =()=>{
		voiceReaIndex({voice_id: id.value}).then(res=>{
			const data = [...res.data]
			if(data.length>0){
				data.map((v,index)=>{
					v.x = 0
					v.y = index * 50
				})
				
			}
			list.value = data
		})
	}
	const currentId = ref(null)
	const delItem = item =>{
		currentId.value = item.id
		show.value = true
	}
	
	// 播放中数据
	const playDataId = ref(null) 
	
	const innerAudioContext = uni.createInnerAudioContext();
	innerAudioContext.autoplay = true;
	
	const handleItem = item =>{
		if(playDataId.value === null){
			playDataId.value = item.id
			// 播放
			innerAudioContext.src = item.upload.full_path;
			innerAudioContext.play();
		}else{
			if(playDataId.value === item.id){
				// 当前播放暂停
				innerAudioContext.stop();
				playDataId.value = null	
				
			}else{
				innerAudioContext.stop();
				playDataId.value = item.id
				innerAudioContext.src = item.upload.full_path;
				// 播放
				innerAudioContext.play();
			}
		}
		
	}
	
	const ok = ()=>{
		voiceReaDestory({id: currentId.value}).then(res=>{
			uni.showToast({title: '删除成功!',icon: 'success',duration: 2000});
			show.value = false
			const index = list.value.findIndex(v=> {return v.id===currentId.value})
			if(index>-1) list.value.splice(index, 1)
		})
	}
	
	const toPath = url =>{
		uni.navigateTo({
			url
		})
	}
	
	onHide(()=>{
		playDataId.value = null
		innerAudioContext.stop()
	})
	
</script>

<style lang="scss" scoped>
	.content {
	  display: flex;
	  width: 100%;
	  height: 100vh;
	  flex-direction: column;
	  align-items: center;
	  padding: 36rpx 20rpx;
	  position: relative;
	  box-sizing: border-box;
	  .listBox{
		  width: 100%;
		  box-sizing: border-box;
		  .scrollBox{
			  padding-bottom: 50rpx;
			  background-color: #f9f9f9;
		  }
		  .swiperItem{
			  // border: 1px solid red;
			   // margin-bottom: 20rpx;
			   // border-radius: 20rpx;
		  }
		  .movableItem{
			 width: 100%;
			 height: 100rpx; 
			 box-sizing: border-box;
			 border: 1px solid red;
		  }
		  .item{
			  width: 100%;
			  height: 100rpx;
			  font-size: 30rpx;
			  background: #ffffff;
			  color: #333333;
			  font-weight: bold;
			  padding: 0 18rpx;
			  position: relative;
			  .sImage{
				  width: 36rpx;
				  height: 36rpx;
				  margin-right: 22rpx;
			  }
			  .name{
				  width: 80%;
			  }
			  .delBox{
				  width: 53rpx;
				  height: 53rpx;
				  background: #2281fe;
				  border-radius: 0px 20rpx 0px 20rpx;
				  position: absolute;
				  top: 0;
				  right: 0;
				  image{
					  width: 27rpx;
					  height: 29rpx;
				  }
			  }
		  }
	  }
	  
	  
	  
	  .footterBox{
		  width: 100%;
		  min-height: 130rpx;
		  background: #ffffff;
		  position: absolute;
		  padding: 0 25rpx;
		  padding-bottom:30rpx;
		  bottom: 0 !important;
		  left: 0;
		  .btn{
			  width: 336rpx;
			  height: 98rpx;
			  background: #e8f2ff;
			  border: 1rpx solid #2281fe;
			  border-radius: 10rpx;
			  font-size: 36rpx;
			  color: #333333;
		  }
		  .btn2{
			  background: #2281fe;
			  color: #ffffff;
		  }
	  }
	}
</style>