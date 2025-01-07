<template>
	<view class="container content">
		<view class="listBox" v-if="list.length>0">
			<scroll-view :scroll-top="0" scroll-y="true" style="height: 90vh;" class="scrollBox">
				<u-swipe-action>
						<u-swipe-action-item
						  v-for="(item,index) in list" 
						  :key="item.id"
						  :options="options1"
						  :name="index+'item1'"
						  :threshold="100"
						  class="swiperItem"
						  @click="delItem(item)"
						>
						<view class="item">
							<view class="flex-item-col-center" @click="handleItem(item)">
								<image :src="`/static/images/voices/${item.id === playDataId? 'pause': 'play'}.png`" class="sImage"></image>
								<view class="name u-line-1">{{item.title}}</view>
								
								<view class="delBox flex">
									<view class="iconBox flex-rcc" :class="{iconBox1: index<list.length-1}" @click.stop="changeSort(item,index, 1)" v-if="index>0">
										<u-icon name="arrow-upward" color="#2979ff" bold size="28"></u-icon>
									</view>
									<view class="iconBox flex-rcc" @click.stop="changeSort(item,index, 2)" v-if="index<list.length-1">
										<u-icon name="arrow-downward" color="#2979ff" bold size="28"></u-icon>
									</view>
									<!-- <image src="/static/images/voices/top.png" @click.stop="changeSort(item,index, 1)"></image>
									<image src="/static/images/voices/down.png" @click.stop="changeSort(item,index, 2)"></image> -->
								</view>
							</view>
							<view class="goodsbox fcc-sb" @click="onClick(item)">
								<view>{{item.get_goods? item.get_goods?.other?.title: '未上传商品图'}}</view>
								<view class="flex-rcc goodsImgStatus">
									<image :src="`/static/images/goods/${item.get_goods? 'edit': 'create'}.png`"></image>
									{{item.get_goods? '修改商品图': '请选择商品图'}}
									
								</view>
							</view>
						</view>
						</u-swipe-action-item>
				  </u-swipe-action>
			</scroll-view>
		</view>
		<u-empty v-else mode="data" text="暂无语音,请上传或录制!" :marginTop="160" iconSize="160" textSize="28" style="width: 100%;"></u-empty>
		<view class="footterBox fcc-sb">
			<view class="btn flex-rcc" @click="toPath(`/pagesub/voices/upload?id=${id}`)">上传</view>
			<view class="btn btn2 flex-rcc" @click="toPath(`/pagesub/voices/transcribe?type=1&id=${id}`)">录制</view>
		</view>
		
		<u-modal :show="show" title="提示" :content='content' showCancelButton @confirm="ok" @cancel="show=false"></u-modal>
		<!-- <u-picker :show="isPickerShow"
		 ref="uPicker"
		  :defaultIndex="defaultIndex" 
		  :loading="loading"  
		  keyName="name" 
		  :itemHeight="80" 
		  :visibleItemCount="5" 
		  :columns="columns"
		  immediateChange 
		  @confirm="confirm" 
		  @change="changeHandler" 
		  @cancel="isPickerShow=false">
		</u-picker> -->
		<u-popup :show="isPickerShow" @close="isPickerShow=false">
			<view class="selectBox">
				<view class="btns">
					<text @click="isPickerShow=false">取消</text>
					<text class="blue" @click="confirm">确定</text>
				</view>
				<picker-view indicator-style="height: 50px;" :value="defaultIndex" @change="bindChange" class="picker-view">
					<picker-view-column>
						<view class="item" v-for="(item,index) in columns" :key="index">{{item.name}}</view>
					</picker-view-column>
					<picker-view-column>
						<view class="item" v-for="(item,index) in columnData" :key="index">{{item.other.title}}</view>
					</picker-view-column>
				</picker-view>
			</view>
			
		</u-popup>
	</view>
</template>

<script setup>
	import { onLoad,onShow, onHide, onUnload } from '@dcloudio/uni-app'
	import { voiceReaIndex, voiceReaDestory, voiceRelationSort, goodsCategoryIndex, voiceGoods, checkNewJob } from '@/api'
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
	const isPickerShow = ref(false)
	const columns = ref([]);
	const columnData = ref([]);
	const defaultIndex = ref([0,0])
	const loading = ref(false);
	const content = ref('请确认删除该语音?')
	const id = ref(null)
	let innerAudioContext = null
	onLoad((option)=>{
		config.getQnToken()
		id.value = option.id
		getList()
		getShopList()
	})
	
	onShow(()=>{
		if(id.value){
			getList()
		}
	})
	
	// 获取语音库语音列表
	const getList =()=>{
		voiceReaIndex({voice_id: id.value}).then(res=>{
			list.value = res.data
			const arr = list.value.filter(v=> v.job_id && !v.upload.full_path)
			if(arr.length>0) checkJob(arr)
			else clearInterval(timmer)
			
		})
	}
	
	let timmer = null
	
	// 刷新任务
	const checkJob = (list) =>{
		clearInterval(timmer)
		const oemid = import.meta.env.VITE_OEM_ID
		console.log('list', list)
		timmer = setInterval(()=>{
			list.map(v =>{
				checkNewJob({job_id: v.job_id, oem_id: oemid}).then(res =>{
					console.log(1111111, res)
					if(res.data){
						clearInterval(timmer)
						getList()
					}
				})
			})
		},2500)
	}
	const currentId = ref(null)
	const delItem = item =>{
		currentId.value = item.id
		show.value = true
	}
	
	const changeSort = (item,index,type) =>{
		const length = list.value.length
		if(type===1){
			//向上
			if(index!==0){
				let temp = list.value[index]
				list.value[index] = list.value[index-1]
				list.value[index-1] = temp
				voiceRelationSort({id1: list.value[index].id, id2: list.value[index-1].id})
			}
		}else{
			if(index!==length-1){
				let temp = list.value[index]
				list.value[index] = list.value[index+1]
				list.value[index+1] = temp
				voiceRelationSort({id1: list.value[index].id, id2: list.value[index+1].id})
			}
		}
	}
	
	// 播放中数据
	const playDataId = ref(null) 
	
	const handleItem = item =>{
		if(!item.upload.full_path) return uni.showToast({title: 'AI语音正在生成中,请稍后!',icon: 'none',duration: 2000});
		if(!innerAudioContext){
			innerAudioContext = uni.createInnerAudioContext();
			innerAudioContext.autoplay = true;
			innerAudioContext.onEnded(()=>{
				playDataId.value = null
			})
		}
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
			// getList()
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
		if(innerAudioContext){
			innerAudioContext.destroy()
			innerAudioContext = null
		}
		if(timmer){
			clearInterval(timmer)
		}
	})
	
	// 获取商品库列表
	function getShopList(){
		goodsCategoryIndex({page:1, size: 1000}).then(res=>{
			// 过滤掉项目内没有实际内容的
			const list = res.data.filter(item=>item.get_goods&&item.get_goods.length!==0)
			columns.value = list
			if(list.length) {
				columnData.value = list[0].get_goods
			}
		})
	}
	const selectItem = ref([0,0])
	function bindChange(e) {
		const val = e.detail.value
		selectItem.value = val
		columnData.value = columns.value[val[0]].get_goods
		if(columnData.value.length-1<val[1]){
			defaultIndex.value = [val[0],0]
			selectItem.value = [val[0],0]
		}
	}
	
	const voiceId = ref(null)
	
	function onClick(item){
		selectItem.value = [0,0]
		defaultIndex.value = [0,0]
		getShopList()
		isPickerShow.value = true
		voiceId.value = item.id
	}
	
	// 语音关联图片
	function confirm(){
		const goods_id = columnData.value[selectItem.value[1]].id
		const title = columnData.value[selectItem.value[1]].other.title
		voiceGoods({id: voiceId.value, goods_id}).then(res =>{
			uni.showToast({title: '关联商品成功!',icon: 'none',duration: 2000});
			const index = list.value.findIndex(v=>{return v.id===voiceId.value})
			list.value[index].get_goods = {other:{title}} 
			isPickerShow.value = false
		})
	}
	
	onUnload(()=>{
		playDataId.value = null
		if(innerAudioContext){
			innerAudioContext.destroy()
			innerAudioContext = null
		} 	
		if(timmer){
			clearInterval(timmer)
		}
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
			   margin-bottom: 20rpx;
			   border-radius: 20rpx;
		  }
		  .item{
			  width: 100%;
			  min-height: 100rpx;
			  font-size: 30rpx;
			  background: #ffffff;
			  color: #333333;
			  font-weight: bold;
			  padding: 0 18rpx;
			  padding-top: 16rpx;
			  position: relative;
			  .goodsbox{
				  margin:15rpx 6rpx;
				  // margin-top: 16rpx;
				  height: 45rpx;
				  background: #f9f9f9;
				  border-radius: 10rpx;
				  padding: 0 16rpx;
				  align-items: center;
				  font-size: 20rpx;
				  font-family: Microsoft YaHei, Microsoft YaHei-Regular;
				  color: #666666;
				  .goodsImgStatus{
					  color: #2281fe;
					  image{
						  width: 18rpx;
						  height: 18rpx;
						  margin-right: 8rpx;
					  }
				  }
				  
			  }
			  .sImage{
				  width: 36rpx;
				  height: 36rpx;
				  margin-right: 22rpx;
			  }
			  .name{
				  width: 80%;
			  }
			  .delBox{
				  width: 18%;
				  height: 50%;
				  position: absolute;
				  top: 0;
				  right: 25rpx;
				  align-items: center;
				  justify-content: flex-end;
				  .iconBox{
					  width: 40rpx;
					  height: 40rpx;
					  box-shadow: 0rpx 0rpx 5rpx #2281fe;
					  border-radius: 50%;
					  font-weight: bold;  
				  }
				  .iconBox1{
					  margin-right: 10rpx;
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
	.selectBox{
		.btns{
			width: 100%;
			display: flex;
			align-items: center;
			padding: 30rpx;
			box-sizing: border-box;
			justify-content: space-between;
			color: #666;
			.blue{
				color: #2281fe;
			}
		}
		.picker-view {
			width: 750rpx;
			height: 600rpx;
			margin-top: 20rpx;
			.item {
				line-height: 100rpx;
				text-align: center;
			}
		}
	}
	
		
</style>