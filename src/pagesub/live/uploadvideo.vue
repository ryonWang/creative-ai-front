<template>
<view class="page">
	<view class="panel">
		<view class="h2 fcc-sb">
			<text>视频位置</text>
			<text class="tip">*最多可上传1段视频</text>
		</view>
		<view class="con">
			<view :class="['imgBox',{'act': mode==1}]" @click="mode=1"><image src="/static/images/live/horizontal.png" class="example"></image></view>
			<view :class="['imgBox',{'act': mode==2}]" @click="mode=2"><image src="/static/images/live/vertical.png" class="example"></image></view>
			<view :class="['imgBox',{'act': mode==3}]" @click="mode=3"><image src="/static/images/live/full.png" class="example"></image></view>
		</view>
		<text class="tip">*请先选择视频比例</text>
		<u-gap height="2rpx" bgColor="#d7d8d9" marginTop="20rpx" marginBottom="30rpx"></u-gap>
		<view class="h2">宣传视频</view>
		<!-- 上传区域 -->
		<u-upload
			:fileList="video"
			:compressed="false"
			capture="album"
			@afterRead="videoAfterRead"
			@delete="deleteVideo"
			:maxCount="1"
			accept="video"
			:width="650"
			:height="260"
			class="uploadVideo"
		>
			<view class="goToBtn">
				<view class="upBox">
					<u-icon name="plus" color="#999999" size="36rpx"></u-icon>
					<view class="text">上传视频</view>
				</view>
			</view>
		</u-upload>
		<text class="tip r">*上传的视频最好小于60秒，不大于100M</text>
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
const video = ref([])
const mode = ref(1)
onLoad((option)=>{
	config.getQnToken('video')
	if(live.liveRoomVideo){
		video.value[0] = live.liveRoomVideo
		mode.value = live.liveRoomVideo.video_model
	}
})

async function videoAfterRead(event){
	const { file } = event
	video.value.push({
		...file,
		status: 'uploading',
		message: '上传中',
	});
	const {id, path} = await uploadFilePromise(file.url);
	if(path){
		video.value[0] = {...file, status: 'success', message: '', url: path, id}
	}
}
function deleteVideo(event){
	video.value = []
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
			},
			fail: (err) => {
				reject(err)
			}
		});
	});
}
function submit(){
	const data = video.value.length>0 ? {...video.value[0], video_model: mode.value} : null
	live.setLiveRoomVideo(data)
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
		padding: 0 0rpx 20rpx;
		.imgBox{
			padding: 8rpx;
			border-radius: 10rpx;
			border: 2rpx solid transparent;
		}
		.example{
			width: 200rpx;
			height: 356rpx;
		}
		.act{
			border-color: #2281fe;
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
	.tip{
		font-size: 22rpx;
		color: #999999;
	}
	.goToBtn{
		width: 650rpx;
		height: 260rpx;
		background: #ffffff;
		border: 2rpx dashed #2281fe;
		border-radius: 10rpx;
		margin-top: 22rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 24rpx;
		color: #999999;
		.pic{
			margin: 0 7rpx;
		}
		.upBox{
			width: 140rpx;
			height: 140rpx;
			margin: 0 7rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}
		.bor{
			border: 2rpx dashed #999999;
		}
	}
}
</style>
<style lang="scss">
.uploadVideo{
	.u-upload__wrap__preview__other{
		width: 650rpx!important;
		height: 260rpx!important;
	}
	.u-upload__deletable, .u-upload__success{
		height: 40rpx!important;
		width: 40rpx!important;
		.u-icon__icon{
			font-size: 30rpx!important;
			line-height: 30rpx!important;
		}
	}
	.u-upload__success{
		border-width: 22rpx!important;
	}
	.u-upload__success__icon{
		bottom: -24rpx!important;
		right: -24rpx!important;
	}
}
</style>
