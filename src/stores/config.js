import { defineStore } from 'pinia'
import { qiniuToken } from '@/api/index'

export const useConfigStore = defineStore('config', {
	persist: {
	    enabled: true,
		detached: true, // 设置订阅与组件分离
	},
	state: () => ({
		account: '',
		password: '',
		remeberPwd: false,
		statusBar: 24, // 状态栏的高度
		winHeight: 0,
		qnToken: null,
		app_name: import.meta.env.VITE_APP_NAME,
		app_version: null,
		template: 6, // 首页模板
	}),
	actions: {
		setRemeberPwd(val) {
		  this.remeberPwd = val
		},
		savePwd(form) {
		  this.password = form.password
		  this.account = form.account
		},
		setStatusBar(height){
			this.statusBar = height
		},
		setWinHeight(height){
			this.winHeight = height
		},
		setAPPVersion(info){
			this.app_version = info
		},
		setHomeTem(num){
			this.template = num
		},
		async getQnToken(type){
			try{
				const file_type = type ? type : 'audio'
				const res = await qiniuToken({file_type})
				if(res&&res.data){
					this.qnToken = res.data.qiniuToken
				}
			}catch(e){
				throw error
			}
		}
	}
})