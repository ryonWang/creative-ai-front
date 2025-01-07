<template>
	<view class="container content">
		<view class="cbox">
			<view class="title">{{texts[type-1]}}图片</view>
			<view class="uploadBox">
				<u-upload
					:fileList="fileList1"
					@afterRead="afterRead"
					@delete="deletePic"
					capture="album"
					:width="128"
					:height="128"
					multiple
					:maxCount="1"
				></u-upload>
			</view>
			
			<view class="sub">*图片大小小于1M，建议尺寸157*157（方图），最多上传一张</view>
			<view class="line"></view>
			<view class="title">{{texts[type-1]}}名称</view>
			<view class="inputBox">
				<u--input
			    :placeholder="`请填写${texts[type-1]}名称`"
				v-model="form.other.title"
			    border="none"
			    clearable
			  ></u--input>
			</view>
			
			<view class="line"></view>
			<template v-if="type!==2">
				<view class="title">{{type===1? '商品价格': '优惠券规格'}}</view>
				<view class="inputBox">
					<u--input
					placeholder="例：19.9"
					v-model="form.other.price"
					showWordLimit
					border="none"
					:maxlength="5"
					clearable
				  ></u--input>
				</view>
				<view class="line"></view>
			</template>
			<view class="title">图片位置</view>
			<view class="exampleBox">
				<image src="/static/images/goods/example.png" class="example" @click="show=true"></image>
				<view class="sub">*任选一处为商品图片弹出位置</view>
			</view>
			<view class="listBox">
				<view class="itemBox" v-for="(item,index) in locations" :key="index" :class="{'actionItem': form.location===item.value}" @click="form.location=item.value">
					{{item.label}}
					<image src="/static/images/goods/selected.png" class="selected" v-if="form.location===item.value"></image>
				</view>
			</view>
		</view>
		<u-popup :show="show" @close="show=false" mode="center">
			<view class="bbox">
				<u-icon name="close" color="#000" bold size="48" class="close" @click="show=false"></u-icon>
				<image src="/static/images/goods/example.png" class="bexample" @click="show=false"></image>
			</view>
		</u-popup>
		<view class="btnBox">
			<view class="btn flex-rcc" @click="save">确定{{form.id? '编辑': '添加'}}</view>
		</view>
	</view>
</template>

<script setup>
	import { onLoad, onReady } from '@dcloudio/uni-app'
	import { useConfigStore } from '@/stores'
	import { goodsStore, goodsUpdate } from '@/api'
	
	onLoad((option)=>{
		type.value = Number(option.type)
		form.value.type = type.value
		form.value.category_id = option.category_id
		if(option.item){
			form.value = JSON.parse(option.item)
			fileList1.value[0] = {status: 'success', message: '',url: form.value.path, id: form.value.img}
			delete form.value.path
		}
		// 获取七牛token
		config.getQnToken('img')
	})
	
	const config = useConfigStore()
	const show = ref(false)
	const fileList1 = ref([])
	const form = ref({
		img: null,
		category_id: null,
		type: null,
		other: {
			title: null,
			price: null
		},
		location: 1, //1:右上2：右中3右下4左上5左中 6左下
	})
	
	const type = ref(1)
	const texts = ['商品', '预约', '优惠券']
	const locations = [
		{label: '右上', value: 1},
		{label: '右中', value: 2},
		{label: '右下', value: 3},
		{label: '左上', value: 4},
		{label: '左中', value: 5},
		{label: '左下', value: 6}
	]
	
	
	function deletePic(event){
		fileList1.value=[]
		form.value.img = null
	}
	
	function afterRead(event){
		const { file } = event
		fileList1.value.push({
			...file,
			status: 'uploading',
			message: '上传中',
		});
		uni.uploadFile({
			url: 'https://upload-z1.qiniup.com',
			filePath: file[0].url,
			name: 'file',
			formData: {
				"token": config.qnToken,
				"x:type": 15,
			},
			success: (res) => { 
				const data = JSON.parse(res.data)
				const {id, path} = data.data
				form.value.img = id
				fileList1.value[0] = {...file, status: 'success', message: '', url: path, id}
				uni.showToast({title: '上传成功!', icon: 'success', duration: 1000});
			},
			fail: (err) => {
				uni.showToast({title: '上传失败', icon: 'error', duration: 2000});
			}
		})
	}
	
	async function save(){
		if(!form.value.img) return uni.showToast({title: '请上传图片!',icon: 'none',duration: 2000});
		if(!form.value.other.title) return uni.showToast({title: `请填写${texts[type.value-1]}图片!`,icon: 'none',duration: 2000});
		if([1,3].includes(type.value) && !form.value.other.price) return uni.showToast({title: '请填写价格!',icon: 'none',duration: 2000});
		const response = (form.value.id)? await goodsUpdate(form.value) : goodsStore(form.value)
		if(response){
			uni.showToast({title: '操作成功!', icon: 'success', duration: 1000});
			init()
			uni.navigateBack()
		}
	}
	
	function init(){
		form.value = {
			img: null,
			category_id: null,
			other: {
				title: null,
				price: null
			},
			type: null,
			location: 1, //1:右上2：右中3右下4左上5左中 6左下
		}
	}
	
	onReady(()=>{
		uni.setNavigationBarTitle({
			title: type.value===1? '添加商品':type.value===2? '预约表单': '优惠券'
		})
	})
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx;
  box-sizing: border-box;
  .cbox{
	  width: 100%;
	  min-height: 300rpx;
	  background: #ffffff;
	  border-radius: 20rpx;
	  padding: 38rpx 34rpx;
	  .uploadBox{
		  padding: 14rpx 0;
		  :deep(.uicon-camera-fill){
		  	  font-size: 50rpx !important;
		  }
		  :deep(.uicon-close){
			 font-size: 30rpx !important; 
		  }
	  }
	  .inputBox{
		  padding-top: 10rpx;
	  }
	  .title{
		  font-size: 28rpx;
		  font-family: Microsoft YaHei, Microsoft YaHei-Regular;
		  color: #333333;
	  }
	  .sub{
		  font-size: 22rpx;
		  color: #999999;
	  }
	  .line{
		  width: 100%;
		  height: 1rpx;
		  background: #d7d8d9;
		  margin: 26rpx 0;
	  }
	  .exampleBox{
		  display: flex;
		  align-items: flex-end;
		  padding: 16rpx 0;
		  .example{
			  width: 128rpx;
			  height: 128rpx;
			  margin-right: 20rpx;
		  }
	  }
	  .listBox{
		  width: 100%;
		  display: flex;
		  flex-wrap: wrap;
		  .itemBox{
			  width: 125rpx;
			  height: 55rpx;
			  background: #f9f9f9;
			  border: 1rpx solid #666666;
			  border-radius: 5rpx;
			  display: flex;
			  align-items: center;
			  justify-content: center;
			  font-size: 30rpx;
			  color: #666666;
			  margin: 0 30rpx 26rpx 0;
			  position: relative;
			  .selected{
				  width: 28rpx;
				  height: 28rpx;
				  position: absolute;
				  bottom: 0;
				  right: 0;
			  }
		  }
		  .actionItem{
			  background: #edf4fd;
			  color: #2281fe;
			  border-color: #2281fe;
		  }
	  }
  }
  .bbox{
	  position: relative;
	  // width: 90%;
	  // height: 80vh;
	  .close{
		  position: absolute;
		  top: 0;
		  right: 0;
		  font-weight: bolder;
		  z-index: 9;
	  }
	  .bexample{
		  width: 90vw;
		  height: 80vh;
	  }
  }
  .btnBox{
	  width: 100%;
	  height: 142rpx;
	  background: #f9f9f9;
	  .btn{
		  width: 100%;
		  height: 88rpx;
		  background: #2281fe;
		  border-radius: 44rpx;
		  font-size: 36rpx;
		  font-family: Microsoft YaHei, Microsoft YaHei-Regular;
		  color: #ffffff;
	  }
  }
}
</style>