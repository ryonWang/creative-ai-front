import uviewPlus from 'uview-plus'
import { createSSRApp } from "vue";
import * as Pinia from 'pinia';
import App from "./App.vue";
import piniaPersist from 'pinia-plugin-persist-uni'
import '@/styles/main.scss'

export function createApp() {
	const app = createSSRApp(App);
	app.use(Pinia.createPinia().use(piniaPersist)).use(uviewPlus)
	uni.$u.setConfig({
		// 修改$u.config对象的属性
		config: {
			// 修改默认单位为rpx，相当于执行 uni.$u.config.unit = 'rpx'
			unit: 'rpx'
		},
		// 修改$u.props对象的属性
		props: {
			// 修改radio组件的size参数的默认值，相当于执行 uni.$u.props.radio.size = 30
			loadmore: {
				fontSize: 28,
				iconSize: 30
			}
			// 其他组件属性配置
			// ......
		}
	})
	return {
		app,
		Pinia,
	};
}
