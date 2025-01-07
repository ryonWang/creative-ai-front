<template>
	<view class="container content">
		<view class="addBox flex-rcc" @click="goTo(`/pagesub/goods/create?type=${type}&category_id=${params.category_id}`)">
			<view class="img-box flex-rcc"><image src="/static/images/goods/addimg.png"></image></view> <text>添加新商品</text>
		</view>
		
		<view class="listBox">
			<template v-if="data.length">
				<view class="itemBox" v-for="(item, index) in data" :key="index">
					<image :src="item.get_img.full_path" class="goodsImg"></image>
					<view class="infoBox">
						<view class="u-line-1 goodsTitle">商品名称：{{item.other.title}}</view>
						<view class="price"><text v-if="item.other?.price">价格：￥{{item.other.price}}</text></view>
						<view class="fcc-sb"><view>图片位置：{{locations[item.location-1]}}</view><view class="tbtn" @click="edit(item)">修改商品信息</view></view>
					</view>
					<!-- <view class="delBox flex-rcc" @click.stop="handleDel(item)">
						<image src="/static/images/voices/del.png"></image>
					</view> -->
				</view>
			</template>
			<u-empty v-else mode="data" text="暂无项目,请新建项目!" :marginTop="160" iconSize="160" textSize="28" style="width: 100%;"></u-empty>
		</view>
		<u-modal :show="show" title="提示" :content='content' showCancelButton @confirm="ok" @cancel="show=false"></u-modal>
	</view>
</template>

<script setup>
	import { onLoad, onReachBottom, onShow } from '@dcloudio/uni-app'
	import { goTo } from '@/utils/helper.js'
	
	import { goodsIndex, goodsDestory } from '@/api'
	
	const data = ref([])
	const status = ref('loadmore')
	const show = ref(false)
	const content = ref('请确认删除该商品?')
	
	onLoad((option)=>{
		params.value.category_id = option.id
		type.value = option.type
	})
	
	onShow(()=>{
		init()
		getList()
	})
	
	const locations = ['右上','右中','右下','左上','左中','左下']
	const type = ref(1)
	
	const params = ref({
		page: 1,
		size: 10,
		category_id: null
	})
	const total = ref(0)
	// 获取语音库列表
	const getList =()=>{
		goodsIndex(params.value).then(res=>{
			data.value = data.value.concat(res.data) 
			total.value = res.meta.total
			if(data.value.length>=res.meta.total) status.value = 'nomore'
		})
	}
	
	function init(){
		params.value.page = 1
		data.value = []
		status.value = 'loadmore'
	}
	
	const edit = (item)=>{
		const obj = {
			id: item.id,
			other: item.other,
			location: item.location,
			img: item.img,
			type: item.type,
			category_id: item.category_id,
			path: item.get_img.full_path
		}
		uni.navigateTo({
			url: `/pagesub/goods/create?item=${JSON.stringify(obj)}&type=${type.value}`
		})
	}
	
	// 删除
	const currentId = ref(null)
	const handleDel = item =>{
		currentId.value = item.id
		show.value = true
	}
	
	
	// 确认删除
	const ok = ()=>{
		goodsDestory({id: currentId.value}).then(res=>{
			uni.showToast({title: '删除成功!',icon: 'success',duration: 2000});
			show.value = false
			const index = data.value.findIndex(v=> {return v.id===currentId.value})
			if(index>-1) data.value.splice(index, 1)
		})
	}
	
	// 页面触底加载下一页
	onReachBottom(()=>{
		if(data.value.length<total.value){
			params.value.page++
			getList()
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
  .addBox{
	  width: 100%;
	  height: 82rpx !important;
	  background: #ffffff;
	  border-radius: 10rpx;
	  font-size: 30rpx;
	  color: #333333;
	  line-height: 82rpx;
	  margin-bottom: 30rpx;
	  .img-box{
		  width: 40rpx;
		  height: 40rpx;
		  background: #2281fe;
		  border-radius: 50%;
		  margin-right: 15rpx;
	  }
	  image{
		  width: 22rpx;
		  height: 20rpx;
		  
	  }
  }
  .listBox{
	  width: 100%;
	  padding: 26rpx 0rpx;
	  box-sizing: border-box;
	  margin-bottom: 24rpx;
	  .itemBox{
		  width: 100%;
		  height: 200rpx;
		  background: #ffffff;
		  border-radius: 10rpx;
		  display: flex;
		  padding: 20rpx;
		  margin-bottom: 20rpx;
		  position: relative;
		  .delBox{
		  		  width: 53rpx;
		  		  height: 53rpx;
		  		  background: #2281fe;
		  		  border-radius: 0px 20rpx 0px 20rpx;
		  		  image{
		  			  width: 27rpx;
		  			  height: 29rpx;
		  		  }
		  		  position: absolute;
		  		  top: 0;
		  		  right: 0;
		  }
		  .goodsImg{
			  width: 160rpx;
			  height: 160rpx;
			  background: #ffffff;
			  border-radius: 10rpx;
		  }
		  .infoBox{
			  padding-left: 30rpx;
			  font-size: 30rpx;
			  font-family: Microsoft YaHei, Microsoft YaHei-Regular;
			  font-weight: 400;
			  color: #333333;
			  line-height: 55rpx;
			  flex: 1;
			  .goodsTitle{
				  padding-right: 20rpx;
			  }
			  .price{
				  height: 45rpx;
				  line-height: 45rpx;
			  }
			  .tbtn{
				  font-size: 24rpx;
				  font-family: Microsoft YaHei, Microsoft YaHei-Regular;
				  color: #2281fe;
			  }
		  }
	  }
  }
}
</style>