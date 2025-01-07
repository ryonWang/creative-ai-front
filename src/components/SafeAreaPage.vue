<template>
	<view class="safeAreaPage">
		<slot></slot>
		<view class="sa_placeholder"></view>
	</view>
</template>

<script>
</script>

<style lang="scss" scoped>
.sa_placeholder{
	height: constant(safe-area-inset-bottom); /* 兼容iOS < 11.2 */
	height: env(safe-area-inset-bottom); /* 兼容iOS >= 11.2 */
}
</style>