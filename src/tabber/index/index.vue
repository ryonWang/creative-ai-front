<template>
	<template1 v-if="config.template === 1"
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
	</template1>
	<template2 v-else-if="config.template === 2"
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
	</template2>
	<template3 v-else-if="config.template === 3"
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
	</template3>
	<template4 v-else-if="config.template === 4"
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
	</template4>
	<template5 v-else-if="config.template === 5"
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
	</template5>
	<template6 v-else-if="config.template === 6"
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
	</template6>
	<template6 v-else
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
	</template6>
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

const config = useConfigStore()
const live = useLiveStore()

function comingsoon(){
	uni.showToast({title: '暂未开放', icon: 'none'})
}

onLoad(()=>{
	// Remove the getBanner call from here since it will be handled in Template6
})
</script>

<style lang="scss" scoped>

</style>
