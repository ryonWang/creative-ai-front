<template>
	<view class="container content">
		<view class="box">
			<view class="title">新项目名称</view>
			<u--input
			    placeholder="请输入项目名称"
				v-model="form.title"
			    border="bottom"
			    clearable
			  ></u--input>
			  
		</view>
		
		<view class="selectBox">
			<u-radio-group v-model="form.sort_type" :size="34" :iconSize="28" >
				<u-radio 
				  :labelSize="28"
				  inactiveColor="#666666"
				  v-for="(item, index) in radiolist1"
				  :key="index"
				  :label="item.name"
				  :name="item.value"
				  style="margin-right: 20rpx;">
				</u-radio>
			</u-radio-group>
		</view>
		
		
		<u-button type="primary" shape="circle" size="large" :text="`确定${form.id? '修改': '添加'}`" @click="add"></u-button>
	</view>
</template>

<script setup>
	import { onLoad, onReady } from '@dcloudio/uni-app'
	import { goTo } from '@/utils/helper.js'
	import { voiceStore, voiceUpdate } from '@/api'
	
	const customStyle = {
		fontSize: '18px'
	}
	
	const radiolist1 = ref([
	  {
	    name: '顺序播放',
	    value: 1,
	  },
	  {
	    name: '随机播放',
	    value: 2,
	  }
	]);
	
	const title = ref('')
	const form = ref({
		sort_type:1,
		title: ''
	})
	
	onLoad((option)=>{
		if(Object.keys(option).length>0){
			const obj = JSON.parse(option.item)
			form.value = obj
		}
	})
	
	onReady(()=>{
		uni.setNavigationBarTitle({
			title: form.value.id? '修改项目': '添加新项目'
		})
	})
	
	const add = async()=>{
		if(!form.value.title) return uni.showToast({title: '项目名称不能为空!',icon: 'none',duration: 2000});
		const response = form.value.id? await voiceUpdate(form.value) : await voiceStore(form.value)
		if(response){
			uni.showToast({title: '操作成功!',icon: 'success',duration: 1000});
			setTimeout(uni.navigateBack, 1000)
			// uni.redirectTo({url: '/pagesub/voices/index'})
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		width: 100%;
		padding: 20rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		.box{
			width: 100%;
			padding: 34rpx 40rpx;
			box-sizing: border-box;
			background: #ffffff;
			// margin-bottom: 122rpx;
			.title{
				font-size: 32rpx;
				font-weight: bold;
				color: #333333;
			}
		}
		.selectBox{
			width: 100%;
			padding-left: 40rpx;
			font-size: 34rpx;
			margin-top: 30rpx;
			margin-bottom: 100rpx;
		}
		.btn{
			font-size: 18px;
			color: red;
			height: 88rpx;
		}
	}
</style>