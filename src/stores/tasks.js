import { defineStore } from 'pinia'

export const useTaskStore = defineStore('task', {
	state: () => ({
		task: {},
		selectVoice: null,
		selectReply: null,
		default_voice:{
			voice: 'zhimao',
			type: '普通话女声'
		}
	}),
	actions: {
		setTask(data){
			this.task = data
		},
		setVoice(data){
			this.selectVoice = data
		},
		setReply(data){
			this.selectReply = data
		},
		setDefaultVoice(data){
			this.default_voice = data
		}
	}
})