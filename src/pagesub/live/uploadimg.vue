<template>
<view class="page">
	<view class="panel">
		<view class="h2">直播贴图</view>
		<view class="con">
			<view v-for="(item, key) in fileList" class="box">
				<u-upload
					:fileList="fileList[key]"
					capture="album"
					@afterRead="afterRead($event, key)"
					@delete="deletePic($event, key)"
					:maxCount="1"
					width="128rpx"
					height="128rpx"
				>
					<image :src="`/static/images/live/${key}.png`" class="noUp"></image>
				</u-upload>
				<view v-if="fileList[key].length>0" class="bottomTip">{{ transLocation(key) }}贴图</view>
			</view>
		</view>
		<u-gap height="2rpx" bgColor="#d7d8d9" marginTop="20rpx" marginBottom="30rpx"></u-gap>
		<view class="h2">图片位置</view>
		<view class="example flex-rcc" @click="showExample = true">贴图位置示例图</view>
		<!-- <u-album :urls="urls1"></u-album> -->
		<view class="mask" v-show="showExample" @click="showExample = false">
			<image src="/static/images/live/example.png" class="exampleImg" mode="widthFix"></image>
		</view>
	</view>
	<view class="placeholder"></view>
	<view class="fixedArea">
		<u-button type="primary" text="确定" shape="circle" class="submit" @click="submit"></u-button>
	</view>
</view>
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app'
import { useConfigStore, useLiveStore } from '@/stores';

const config = useConfigStore()
const live = useLiveStore()
const fileList = reactive({
	top: [],
	left: [],
	right: [],
	bottom: [],
})
const urls1 = ref(['https://cdn.uviewui.com/uview/album/1.jpg'])
const showExample = ref(false)
onLoad((option)=>{
	config.getQnToken('img')
	if(live.liveRoomStick){
		fileList.top = live.liveRoomStick.top
		fileList.left = live.liveRoomStick.left
		fileList.right = live.liveRoomStick.right
		fileList.bottom = live.liveRoomStick.bottom
	}
})
async function afterRead(event, key){
	// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
	const { file } = event
	fileList[key].push({
		...file,
		status: 'uploading',
		message: '上传中',
	});
	const {id, path} = await uploadFilePromise(file.url);
	if(path){
		fileList[key][0] = {...file, status: 'success', message: '', url: path, id}
	}
}
function deletePic(event, key){
	// console.log(1111, event.index, key)
	fileList[key] = []
}

function uploadFilePromise(url){
	return new Promise((resolve, reject) => {
		let a = uni.uploadFile({
			url: 'https://upload-z1.qiniup.com',
			filePath: url,
			name: 'file',
			formData: {
				"token": config.qnToken,
				"x:type": 15,
			},
			success: (res) => {
				const data = JSON.parse(res.data)
				resolve(data.data);
				// resolve(data.data.path);
			},
			fail: (err) => {
				reject(err)
			}
		});
	});
}
function transLocation(key){
	switch (key){
		case 'top':
			return '顶部'
		case 'left':
			return '左边'
		case 'right':
			return '右边'
		case 'bottom':
			return '底部'
	}
}
function submit(){
	const data = Object.values(fileList).some(arr=>arr.length>0) ? fileList : null
	live.setLiveRoomStick(data)
	uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.page{
	min-height: 100vh;
	padding: 36rpx 20rpx;
	background: #f8f8f8;
	display: flex;
	flex-direction: column;
	align-items: center;
	.panel{
		width: 710rpx;
		min-height: 510rpx;
		background: #ffffff;
		border-radius: 20rpx;
		margin: 0 auto;
		padding: 34rpx 30rpx;
	}
	.h2{
		font-size: 28rpx;
		color: #333;
		line-height: 28rpx;
		margin-bottom: 16rpx;
	}
	.con{
		display: flex;
		justify-content: space-between;
	}
	.box{
		position: relative;
		width: 128rpx;
		height: 128rpx;
	}
	.bottomTip{
		width: 128rpx;
		height: 42rpx;
		line-height: 42rpx;
		text-align: center;
		background-color: rgba(0,0,0, .6);
		position: absolute;
		bottom: 0;
		left: 0;
		font-size: 22rpx;
		color: #fff;
	}
	.noUp{
		width: 128rpx;
		height: 128rpx;
	}
	.example{
		width: 64px;
		height: 64.5px;
		background: rgba(0,0,0,0.40);
		border-radius: 5rpx;
		color: #fff;
		font-size: 22rpx;
		text-align: center;
	}
	.mask{
		width: 100%;
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #000;
		z-index: 10;
	}
	.exampleImg{
		width: 100%;
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
		background-color: #f8f8f8;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}
	.placeholder{
		box-sizing: content-box;
		width: 710rpx;
		height: 168rpx;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}
	.submit{
		height: 88rpx;
		background: #2281fe;
		font-size: 36rpx;
	}
}
</style>
