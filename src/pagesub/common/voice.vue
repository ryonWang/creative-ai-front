<template>
<view class="page">
	<u-sticky bgColor="#fff">
		<u-tabs 
			:list="tabs" 
			lineWidth="38rpx"
			lineHeight="6rpx"
			Color="#207EFE"
			:activeStyle="{color: '#000',fontWeight: 'bold',transform: 'scale(1.05)',fontSize: '30rpx'}"
			:inactiveStyle="{color: '#333',transform: 'scale(1)',fontSize: '30rpx'}"
			itemStyle="padding-left: 30rpx; padding-right: 30rpx; height: 68rpx;"
			@click="changeTab"
		></u-tabs>
	</u-sticky>
	<view class="content">
		<template v-if="voiceList.length>0">
			<view :class="['panel',{'act': currentItem&&currentItem.id===item.id}]" v-for="item in voiceList" @click="selectItem(item)">
				<view @click.stop.prevent class="leftIcon">
					<u-icon :name="isplay&&playId==item.id?'pause-circle-fill':'play-circle-fill'" size="40rpx" color="#1E64FE" @click="togglePlay($event, item)"></u-icon>
				</view>
				<u--text :text="item.name" :lines="1" size="30rpx" color="#333"></u--text>
			</view>
			<!-- <view class="panel">
				<u-icon :name="isplay&&playId==item.id?'pause-circle-fill':'play-circle-fill'" size="37rpx" color="#1E64FE" @click="togglePlay(item)" class="leftIcon"></u-icon>
				<u--text text="开播第一段" :lines="1" size="30rpx" color="#333"></u--text>
			</view> -->
		</template>
		<u-empty v-else mode="data" textSize="28rpx" marginTop="50" text="暂无公共语音"></u-empty>
	</view>
	<view class="fixedArea">
		<u-button type="primary" text="确定" shape="circle" class="submit" @click="importVoice"></u-button>
	</view>
	<u-picker title="选择语音库" :show="showPop" :columns="columns" keyName="title" @confirm="confirm" @cancel="showPop = false" itemHeight="60"></u-picker>
</view>
</template>

<script setup>
import { onLoad, onShow, onReachBottom, onPullDownRefresh } from '@dcloudio/uni-app'
import { commonVoiceList, commonVoiceCategory, voiceIndex, voiceReaCreate } from '@/api'
const isplay = ref(false)
const playId = ref(null)
const tabs = ref([])
const voiceList = ref([])
const listStatus = ref('loadmore')
const cid = ref('')
const currentItem = ref(null)
const showPop = ref(false)
const columns = reactive([]);
let page = 1, last = 0, innerAudioContext = null;
const size = 20;


function togglePlay(e, item){
	console.log(1111, JSON.stringify(e))
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
function selectItem(item){
	if(currentItem.value&&currentItem.value.id===item.id){
		currentItem.value = null
	}else{
		currentItem.value = item
	}
}
function changeTab(item){
	cid.value = item.id
	page = 1
	queryList(true)
}
function importVoice(){
	// 导入语音库
	if(!currentItem.value) return uni.showToast({title: '未选择语音', icon: 'error', duration: 1000});
	showPop.value = true
}
function confirm(e){
	const { name, upload_id } = currentItem.value
	const { id: voice_id } = e.value[0]
	voiceReaCreate({title: name, upload_id, voice_id}).then(res=>{
		if(res){
			uni.showToast({title: '导入到语音库成功', icon: 'success', duration: 1000});
		}
	}).finally(()=>showPop.value = false)
}
function queryList(init){
	const category_id = cid.value || undefined;
	commonVoiceList({page, size, category_id}).then(res=>{
		const {data, meta} = res
		if(data){
			voiceList.value = init ? data : voiceList.value.concat(data);
		}
		if(meta){
			last = meta.last_page
			if(page >= last) listStatus.value = 'nomore';
		}
	})
}
onLoad(()=>{
	// 获取分组
	commonVoiceCategory({page: 1, size: 200}).then(res=>{
		if(res&&Array.isArray(res.data)){
			tabs.value = res.data
			if(res.data.length>0){
				cid.value = res.data[0].id
				queryList(true)
			}
		}
	})
	// 获取语音库（用于导入）
	voiceIndex({page:1, size: 200}).then(res=>{
		if(res&&res.data){
			columns[0] = res.data.list
		}
	})
})
onReachBottom(()=>{
	if(page >= last) return;
	listStatus.value = 'loading'
	if(page < last){
		page++
		queryList()
	}
})
onBeforeUnmount(()=>{
	if(innerAudioContext) innerAudioContext.destroy();
})
</script>

<style lang="scss" scoped>
.page{
	background: #f9f9f9;
	min-height: 100vh;
	.content{
		padding: 0 20rpx 150rpx;
	}
	.panel{
		width: 710rpx;
		height: 100rpx;
		background: #ffffff;
		border-radius: 20rpx;
		display: flex;
		align-items: center;
		margin: 20rpx 0;
		padding: 0 16rpx;
		font-size: 30rpx;
		color: #333;
		font-weight: bold;
		box-sizing: border-box;
		&.act{
			border: 2rpx solid #207efe;
		}
		.leftIcon{
			margin-right: 20rpx;
		}
	}
	.fixedArea{
		box-sizing: content-box;
		height: 128rpx;
		width: 710rpx;
		padding-top: 40rpx;
		padding-left: 20rpx;
		padding-right: 20rpx;
		position: fixed;
		bottom: 0;
		left: 0;
		background-color: #f9f9f9;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		.submit{
			height: 88rpx;
			background: #2281fe;
			font-size: 36rpx;
		}
	}
}
</style>
