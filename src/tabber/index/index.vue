<template>
	<component 
		:is="currentComponent" 
		:statusBar="config.statusBar"
		:app_name="config.app_name"
	>
		<u-swiper
			:list="swiperList"
			autoplay
			circular
			width="100%"
			height="100%"
		></u-swiper>
	</component>
</template>

<script setup>
import Template1 from '@/components/home/Template1'
import Template2 from '@/components/home/Template2'
import Template3 from '@/components/home/Template3'
import Template4 from '@/components/home/Template4'
import Template5 from '@/components/home/Template5'
import Template6 from '@/components/home/Template6'
import { onLoad } from '@dcloudio/uni-app'
import { useConfigStore, useLiveStore } from '@/stores'
import { getBanner } from '@/api'

const config = useConfigStore()
const live = useLiveStore()
const swiperList = ref(['/static/images/voices/banner.png'])
const currentComponent = shallowRef(null)

function comingsoon(){
	uni.showToast({title: '暂未开放', icon: 'none'})
}
function renderTem(){
	switch (config.template){
		case 1:
			return Template1
		case 2:
			return Template2
		case 3:
			return Template3
		case 4:
			return Template4
		case 5:
			return Template5
		case 6:
			return Template6
		default:
			return Template1
	}
}
onLoad(()=>{
	const oem_id = import.meta.env.VITE_OEM_ID
	// 加载对应模板
	currentComponent.value = renderTem()
	getBanner({oem_id}).then(res=>{
		if(res && res.data && res.data.length>0){
			swiperList.value = res.data.map(item=>item.upload.full_path) 
		}
	})
})
watch(()=>config.template, ()=>{
	currentComponent.value = renderTem()
})
</script>

<style lang="scss" scoped>

</style>
