<template>
<view class="page">
	<view class="h1">一、专注</view>
	<view class="desc">专注于互联网营销产品研发10年，自成立以来，主营业务涵盖微信公众号APP开发、区块链技术开发、物联网技术开发、小程序开发、超级分销系统开发、新微商系统开发、公司自创立以来，已成功为2000多家企事业及政府机关单位提供过高端互联网服务。</view>
	<view class="h1">二、项目介绍</view>
	<view class="desc">{{config.app_name}}是一款只需要放在商家店内就开自动直播软件，全无人的形式，只需要一部手机，就可以形成为门店曝光，销售卖券单的效果!不需要请达人!不需要招主播不需要被抽点!不需要拍视频!</view>
</view>
</template>

<script setup>
import { useConfigStore } from '@/stores'
const config = useConfigStore()
</script>

<style lang="scss" scoped>
.page{
	padding: 36rpx 30rpx;
	background: #f8f8f8;
	min-height: 100vh;
	.h1{
		font-size: 32rpx;
		font-weight: 700;
	}
	.desc{
		font-size: 28rpx;
		margin: 30rpx 0;
		text-indent: 54rpx;
	}
}
</style>