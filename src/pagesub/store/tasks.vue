<template>
	<view class="container content">
		<view class="headerBox">
			<view :style="{'height': `${config.statusBar}px`}"></view>
			<u-navbar 
				title="话术库" 
				bgColor="transparent" 
				:titleStyle="{'color':'#000','font-size':'36rpx'}" 
				leftIconSize="38"
				placeholder
				@leftClick="back"
			></u-navbar>
			
			<view class="categoryBox">
				<scroll-view scroll-x="true" class="scrollxBox" scroll-with-animation :scroll-left="scrollLeft">
					<view class="flex" style="padding: 0 40rpx;">
						<view class="categoryItem flex-cc" v-for="(i,index) in menusList" :id="'item'+i" :class="{'action-item': i.id===menuCurrent }" @click="cutScroll(i,index)">
							<image :src="i.icon.full_path" class="icon"></image>
							<text>{{i.name}}</text>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		
		<view class="cList">
			<template v-if="subsList.length>0">
				<view class="leftBox">
					<scroll-view scroll-y="true" class="lscrollyBox" show-scrollbar scroll-with-animation :scroll-into-view="'menu'+subsCurrent">
						<view class="l-item" v-for="(item,index) in subsList" :class="{'actionM': subsCurrent===item.id}" :id="'menu'+item.id" @click="subClick(item)">
							{{item.name}}
						</view>
					</scroll-view>
				</view>
				<view class="rightBox">
					<scroll-view scroll-y="true" class="lscrollyBox" show-scrollbar scroll-with-animation :scroll-into-view="'menu'+awCurrent?.id" v-if="answersList.length>0">
						<view class="wBox" v-for="(item,index) in answersList" :class="{'actionT': awCurrent?.id===item.id}" :id="'menu'+item.id" @click="awCurrent=item">
							<view class="r-item">
								<text class="title u-line-1">{{item.title}}</text>
								<text class="des u-line-1">{{item.content}}</text>
							</view>
						</view>
					</scroll-view>
					<u-empty v-else mode="data" text="暂无话术!" :marginTop="160" iconSize="160" textSize="28" style="width: 100%;"></u-empty>
				</view>
			</template>
			<u-empty v-else mode="data" text="暂无话术!" :marginTop="160" iconSize="160" textSize="28" style="width: 100%;"></u-empty>
		</view>
		
		<view class="btn-box" v-if="menusList.length>0 && subsList.length>0">
			<u-button type="primary" shape="circle" size="large" text="导入" @click="add"></u-button>
		</view>
	</view>
	<u-picker title="选择语音库" :show="showPop" :columns="columns" keyName="title" @confirm="confirm" @cancel="showPop = false" itemHeight="60"></u-picker>
</template>

<script setup>
	import { onLoad, onReady } from '@dcloudio/uni-app'
	import { getAnswerScript, getSubAnswer, getAwScript, voiceIndex } from '@/api'
	import { useConfigStore, useTaskStore } from '@/stores'
	
	const useTask = useTaskStore()
	const config = useConfigStore()
	
	const showPop = ref(false)
	const columns = reactive([]);
	const menusList = ref([])
	const subsList = ref([])
	const answersList = ref([])
	const menuCurrent = ref() // 菜单选择id
	const subsCurrent = ref() // 二级分类选择id
	const awCurrent = ref({}) // 选择话术
	onLoad(()=>{
		getMenusList()
		voiceIndex({page:1, size: 200}).then(res=>{
			if(res&&res.data){
				columns[0] = res.data.list
			}
		})
	})
	
	// 顶部菜单列表
	function getMenusList(){
		getAnswerScript({page:1,size: 9999}).then(res=>{
			menusList.value = res.data
			if(menusList.value.length>0) {
				menuCurrent.value = menusList.value[0].id
				getSubList(menuCurrent.value)
			}
		})
	}
	
	// 二级分类列表
	function getSubList(category_id){
		getSubAnswer({page:1,size: 9999,category_id}).then(res=>{
			subsList.value = res.data
			if(subsList.value.length>0) {
				subsCurrent.value = subsList.value[0].id
				getAwList(subsCurrent.value)
			}
		})
	}
	
	// 话术列表
	function getAwList(subcategory_id){
		getAwScript({page:1,size: 9999,subcategory_id}).then(res=>{
			answersList.value = res.data
			// if(answersList.value.length>0) {
			// 	subsCurrent.value = subsList.value[0].id
			// }
		})
	}
	
	
	
	const title = ref('')
	const form = ref({
		sort_type:1,
		title: ''
	})
	
	const scrollLeft = ref(0) //滚动条位置
	
	function cutScroll(i,index){
		menuCurrent.value = i.id
		getSubList(menuCurrent.value)
		answersList.value = []
		awCurrent.value = {}
		scrollLeft.value =  index*64 - 118
	}
	
	function subClick(item){
		subsCurrent.value = item.id
		awCurrent.value = {}
		getAwList(subsCurrent.value)
	}
	
	function add(){
		console.log('点击')
		if(!awCurrent.value?.id) return uni.$u.toast('请选择要导入的话术!')
		showPop.value = true
	}
	
	function confirm(e){
		useTask.setTask(awCurrent.value)
		uni.navigateTo({
			url:`/pagesub/voices/transcribe?id=${e.value[0].id}&type=1`,
			complete: ()=>{
				showPop.value = false
			}
		})
		
		// const { name, upload_id } = currentItem.value
		// const { id: voice_id } = e.value[0]
		// voiceReaCreate({title: name, upload_id, voice_id}).then(res=>{
		// 	if(res){
		// 		uni.showToast({title: '导入到语音库成功', icon: 'success', duration: 1000});
		// 	}
		// }).finally(()=>showPop.value = false)
	}
	
	
	function back() {
		uni.navigateBack()
	}
</script>

<style lang="scss" scoped>
	.content{
		width: 100%;
		// padding: 20rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		overflow: hidden;
		.headerBox{
			width: 100%;
			min-height: 309rpx;
			background: linear-gradient(180deg,#e1f2ff 27%, #ffffff 99%);
			flex-shrink: 0;
		}
		.categoryBox{
			width: 100%;
			height: 140rpx;
			.categoryItem{
				width: 112rpx;
				height: 140rpx;
				background: #ffffff;
				border-radius: 15rpx;
				margin-right: 16rpx;
				flex-shrink: 0;
				font-size: 23rpx;
				font-weight: bold;
				color: #333333;
				justify-content: center;
				.icon{
					width: 50rpx;
					height: 50rpx;
					margin-bottom: 13rpx;
				}
			}
			.action-item{
				border: 2rpx solid #2281FE;
				color: #2276E4;
			}
		}
		
		.cList{
			width: 100%;
			margin-top: 20rpx;
			display: flex;
			flex: 1;
			.leftBox{
				width: 210rpx;
				flex-shrink: 0;
				.lscrollyBox{
					// height: 792rpx;
					white-space: nowrap;
					.l-item{
						width: 100%;
						height: 96rpx;
						background: #f9f9f9;
						font-size: 30rpx;
						font-family: Microsoft YaHei, Microsoft YaHei-Regular;
						font-weight: bold;
						color: #333333;
						display: flex;
						align-items: center;
						justify-content: center;
					}
					.actionM{
						background: #FFFFFF;
						color: #2281FE;
						position: relative;
					}
					.actionM::after{
						content: '';
						width: 6rpx;
						height: 48rpx;
						background: #207efe;
						border-radius: 3rpx;
						position: absolute;
						left: 0;
						top: 50%;
						margin-top: -24rpx;
					}
				}
			}
			.rightBox{
				flex: 1;
				flex-shrink: 0;
				.lscrollyBox{
					// height: 792rpx;
					white-space: nowrap;
					background: #FFFFFF;
					.wBox{
						width: 100%;
						padding-left: 34rpx;
					}
					.r-item{
						width: 100%;
						height: 125rpx;
						border-bottom: 1rpx solid #eeeeee;
						display: flex;
						flex-direction: column;
						justify-content: center;
						.title{
							font-size: 28rpx;
							font-family: Microsoft YaHei, Microsoft YaHei-Regular;
							font-weight: bold;
							color: #333333;
							margin-bottom: 16rpx;
							width: 80%;
						}
						.des{
							font-size: 22rpx;
							font-family: Microsoft YaHei, Microsoft YaHei-Regular;
							font-weight: bold;
							color: #666666;
							width: 90%;
						}
					}
					.actionT{
						background-color: #F3F8FF;
					}
				}
			}
			.lscrollyBox{
				height: calc(100vh - 510rpx - 20px);
			}
		}
		.btn-box{
			width: 100%;
			height: 150rpx;
			padding: 0 40rpx;
			display: flex;
			align-items: center;
			flex-shrink: 0;
		}
		.btn{
			font-size: 18px;
			color: red;
			height: 88rpx;
		}
	}
</style>