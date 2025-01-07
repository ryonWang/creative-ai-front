import { defineStore } from 'pinia'

export const useReplyStore = defineStore('reply', {
	state: () => ({
		replyTemp: null,
	}),
	actions: {
		saveReplyTemp(data){
			this.replyTemp = data
		}
	}
})