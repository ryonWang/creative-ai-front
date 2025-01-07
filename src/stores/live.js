import { defineStore } from 'pinia'
import { dropRight, sample } from 'lodash-es'
import { connectWebsocket, sendDateByChannel } from '../utils/socket'
import { useUserStore } from '@/stores'
import { aliJob, checkJob } from '@/api/index'

export const useLiveStore = defineStore('live', {
	persist: {
	    enabled: true,
		detached: true, // 设置订阅与组件分离
		strategies: [
		  { paths: ['title'] }
		],
	},
	state: () => ({
		title: '',
		wsObj: null, // websocket对象
		innerAudioContext: null, // 音频对象
		isplay: false, // 回复音频是否在播放
		current: 0, // 当前播放的第几个直播音频
		vRef: [],
		msgList: [],
		currentMsg: '', // 当前正在回复的评论消息
		replyVoice: '', // 当前正在回复的音频的名称
		liveInfo: null,
		liveRoomStick: null, // 直播间贴图地址对象
		liveRoomVideo: null, // 直播间视频贴图对象
		// live_url: '',
		// autoplay: false, // 当前的片段是否自动播放
		isManualClose: false, // 是否手动关闭WS
		synthesizing: false, // 欢迎语合成状态
		wlcPlaying: false, // 欢迎语是否再播报中
		wlcObj: null, // 欢迎的音频对象
		request_type: 1, //区分抖音抓取方式
		timer: null, //3分钟定时自动回复
	}),
	actions: {
		// setPartAutoPlay(bool){
		// 	this.autoplay = bool
		// },
		// setLiveUrl(url){
		// 	this.live_url = url
		// },
		setRequestType(value){
			this.request_type = Number(value)
		},
		setSynthesiStatus(bool){
			this.synthesizing = bool
		},
		setIsManualClose(data){
			this.isManualClose = data
		},
		setLiveRoomStick(obj){
			this.liveRoomStick = obj
		},
		setLiveRoomVideo(obj){
			this.liveRoomVideo = obj
		},
		setTitle(tit){
			// 开播前设置title,清除wsObj
			this.title = tit
			this.wsObj = null
		},
		setCurrent(i){
			this.current = i
		},
		setLiveDom(vRef){
			this.vRef = vRef
		},
		setLiveInfo(info){
			this.liveInfo = info
		},
		addMsg(data){
			const len = this.msgList.length
			if(len<20){
				this.msgList.unshift(data)
			}else{
				const list = dropRight(this.msgList, 1)
				list.unshift(data)
				this.msgList = list
			}
		},
		setCurrentReply(file, msg){
			this.replyVoice = file
			this.currentMsg = msg
		},
		openLonglink(live_url, useself, ws_url, type) {
			// 打开长连接
			if(this.wsObj) return
			const user = useUserStore()
			if (!user.isLogin) return
			if(useself){
				// 使用自己的抓包地址
				console.log('ws_url', ws_url)
				console.log('live_url', live_url)
				switch(type){
					case 1:
						// 抖音
						this.request_type === 1? connectWebsocket(1,ws_url||'wss://mars.lytklw.cn/socket.io', {live_url}, this.globelMessage, () => {}) : connectWebsocket(1,ws_url||'wss://mars.lytklw.cn/socket.io', {path:live_url,type: 0}, this.globelMessage, () => {})
						break;
					case 2:
						// 快手直播
						connectWebsocket(2,ws_url||'wss://mars.lytklw.cn/socket.io', {path:live_url,type: 1}, this.globelMessage3, () => {})
						break;
					case 3:
						// 视频号直播
						connectWebsocket(3,ws_url||'wss://mars.lytklw.cn/socket.io', {cookie:live_url,type: 5}, this.globelMessage4, () => {})
						break;
					case 4:
						// 美团直播
						connectWebsocket(4,ws_url||'wss://mars.lytklw.cn/socket.io', {path:live_url,type: 2}, this.globelMessage5, () => {})
						break;
				}
				// if(type===2){
				// 	// 快手直播
				// 	connectWebsocket(2,ws_url||'wss://mars.lytklw.cn/socket.io', {path:live_url,type: 1}, this.globelMessage3, () => {})
				// }else{
				// 	// 抖音
				// 	connectWebsocket(1,ws_url||'wss://mars.lytklw.cn/socket.io', {live_url}, this.globelMessage, () => {})
				// }
			}else{
				// 使用第三方
				connectWebsocket(1,ws_url||'ws://42.193.254.253:3000/dy', {url: live_url}, this.globelMessage2, () => {})
			}
		},
		replyEnd(){
			this.innerAudioContext.destroy()
			this.innerAudioContext = null
			if(this.vRef.length>0){
				this.vRef[this.current].play()
			}
			this.isplay = false
			this.setCurrentReply('', '')
		},
		startReply(msg, cb){
			if(!this.isplay&&!this.wlcPlaying){
				// 匹配关键词，播放答案语音
				// replyList 回复列表, msg 评论的内容
				const { reply: replyList } = this.liveInfo
				const findObj = replyList.find(opt=>opt.keywords&&msg.match(new RegExp(opt.keywords.join('|'), 'g')))
				if(findObj){
					// 从匹配结果的录音中随机选取一个播放
					const randomItem = sample(findObj.media)
					if(randomItem&&!this.wlcPlaying){
						if(!this.innerAudioContext){
							// 初次创建音频对象
							this.innerAudioContext = uni.createInnerAudioContext();
							this.innerAudioContext.autoplay = true;
							this.innerAudioContext.volume = 1;
							this.innerAudioContext.onCanplay(()=>{
								// 先降低直播音频声音
								this.isplay = true
								this.vRef[this.current].pause()
								this.innerAudioContext.play();
							})
							this.innerAudioContext.onEnded(this.replyEnd);
							if(plus.os.name!=='iOS'){
								this.innerAudioContext.onError(this.replyEnd);
							}
						}
						this.innerAudioContext.src = randomItem.full_path;
						// 显示当前正在回复的内容
						this.setCurrentReply(randomItem.title, msg)
					}
				}else{
					if(cb) cb()
				}
			}
		},
		
		// 三分钟自动随机回复
		AutoRecover(){
			console.log('开始进入')
			const threeMinutes = 3 * 60 * 1000; // 三分钟的毫秒数
			this.timer = setInterval(() => {
				if(!this.isplay&&!this.wlcPlaying&&this.liveInfo){
					const { reply: replyList } = this.liveInfo
					if(!replyList.length) return;
					const randomInt = Math.floor(Math.random() * replyList.length);
					console.log('randomInt', randomInt)
					// 从匹配结果的录音中随机选取一个播放
					const msg = replyList[randomInt].keywords[0]
					const randomItem = sample(replyList[randomInt].media)
					if(randomItem&&!this.wlcPlaying){
						if(!this.innerAudioContext){
							// 初次创建音频对象
							this.innerAudioContext = uni.createInnerAudioContext();
							this.innerAudioContext.autoplay = true;
							this.innerAudioContext.volume = 1;
							this.innerAudioContext.onCanplay(()=>{
								// 先降低直播音频声音
								this.isplay = true
								this.vRef[this.current].pause()
								this.innerAudioContext.play();
							})
							this.innerAudioContext.onEnded(this.replyEnd);
							if(plus.os.name!=='iOS'){
								this.innerAudioContext.onError(this.replyEnd);
							}
						}
						this.innerAudioContext.src = randomItem.full_path;
						// 显示当前正在回复的内容
						this.setCurrentReply(randomItem.title, msg)
					}
				}	
			  console.log('执行任务！', new Date().toLocaleTimeString());
			}, threeMinutes);
		},
		// 关闭定时任务
		closeAutoRecover(){
			console.log('关闭定时任务')
			if(this.timer) clearInterval(this.timer)
			
		},
		
		globelMessage(data) {
			console.log('data', data)
			// 评论
			if(data.content){
				if(this.liveInfo){
					this.addMsg(data.content); // 添加用户评论信息到列表
					this.startReply(data.content); // 自动回复
				}
			}
			
			// 进入直播间
			if(data.common && data.common.method === 'WebcastMemberMessage'){
				if(this.liveInfo){
					const { is_welcome, id, name_before, name_after } = this.liveInfo
					if(is_welcome==1 && !this.synthesizing){
						const text = name_before + data.user.nickname.replace(/[^\u4E00-\u9FA5\w\s\d]/g, '').replace(/\s/g, '') + name_after
						console.log('text', text)
						this.setSynthesiStatus(true)
						// 先发起请求告诉服务器开始合成音频
						aliJob({room_id: id, content: text, type:1}).then((res)=>{
							if(res){
								// 轮询接口查看音频合成状态
								this.checkTaskJob(id)
							}else{
								this.setSynthesiStatus(false)
							}
						}).catch((err)=>{
							// console.log(111, err)
							this.setSynthesiStatus(false)
						})
					}
				}
			}
			
			// 礼物
			if(data.giftId && data.giftId!=='like' && data.user.nickname){
				if(this.liveInfo){
					const { is_gift, id } = this.liveInfo
					if(is_gift==1 && !this.synthesizing){
						this.setSynthesiStatus(true)
						// 先发起请求告诉服务器开始合成音频
						const text = '感谢' + data.user.nickname.replace(/[^\u4E00-\u9FA5\w\s\d]/g, '').replace(/\s/g, '') + '送来的礼物'
						console.log('text', text)
						aliJob({room_id: id, content: text,type:1}).then((res)=>{
							if(res){
								// 轮询接口查看音频合成状态
								this.checkTaskJob(id)
							}else{
								this.setSynthesiStatus(false)
							}
						}).catch((err)=>{
							// console.log(111, err)
							this.setSynthesiStatus(false)
						})
					}
				}
			}
			
			// 点赞
			if(data.giftId === 'like' && data.user.nickname){
				if(this.liveInfo){
					const { is_like, id } = this.liveInfo
					if(is_like==1 && !this.synthesizing){
						this.setSynthesiStatus(true)
						// 先发起请求告诉服务器开始合成音频
						const text = '感谢' + data.user.nickname.replace(/[^\u4E00-\u9FA5\w\s\d]/g, '').replace(/\s/g, '') + '的点赞'
						console.log('text', text)
						aliJob({room_id: id, content: text,type:1}).then((res)=>{
							if(res){
								// 轮询接口查看音频合成状态
								this.checkTaskJob(id)
							}else{
								this.setSynthesiStatus(false)
							}
						}).catch((err)=>{
							// console.log(111, err)
							this.setSynthesiStatus(false)
						})
					}
				}
			}
			
			// 关注 
			if(data.giftId === 'social' && data.user.nickname){
				if(this.liveInfo){
					const { is_social, id } = this.liveInfo
					if(is_social==1 && !this.synthesizing){
						this.setSynthesiStatus(true)
						// 先发起请求告诉服务器开始合成音频
						const text = '感谢' + data.user.nickname.replace(/[^\u4E00-\u9FA5\w\s\d]/g, '').replace(/\s/g, '') + '的关注'
						console.log('text', text)
						aliJob({room_id: id, content: text,type:1}).then((res)=>{
							if(res){
								// 轮询接口查看音频合成状态
								this.checkTaskJob(id)
							}else{
								this.setSynthesiStatus(false)
							}
						}).catch((err)=>{
							// console.log(111, err)
							this.setSynthesiStatus(false)
						})
					}
				}
			}
			// switch (type) {
			// 	case 'live': // 评论
			// 		if(this.liveInfo){
			// 			this.addMsg(info); // 添加用户评论信息到列表
			// 			this.startReply(info); // 自动回复
			// 		}
			// 		break;
			// 	case 'enter': // 进入直播间
			// 		if(this.liveInfo){
			// 			const { is_welcome, id, name_before, name_after } = this.liveInfo
			// 			if(is_welcome==1 && !this.synthesizing){
			// 				const text = name_before + info + name_after
			// 				console.log('text', text)
			// 				this.setSynthesiStatus(true)
			// 				// 先发起请求告诉服务器开始合成音频
			// 				aliJob({room_id: id, content: text, type:1}).then((res)=>{
			// 					if(res){
			// 						// 轮询接口查看音频合成状态
			// 						this.checkTaskJob(id)
			// 					}else{
			// 						this.setSynthesiStatus(false)
			// 					}
			// 				}).catch((err)=>{
			// 					// console.log(111, err)
			// 					this.setSynthesiStatus(false)
			// 				})
			// 			}
			// 		}
			// 		break;
			// 	case 'gift': // 收到礼物
			// 		if(this.liveInfo){
			// 			const { is_gift, id } = this.liveInfo
			// 			if(is_gift==1 && !this.synthesizing){
			// 				this.setSynthesiStatus(true)
			// 				// 先发起请求告诉服务器开始合成音频
			// 				const text = info.replace(/[^\u4E00-\u9FA5\w\s\d]/g, '').replace(/\s/g, '')
			// 				aliJob({room_id: id, content: text,type:1}).then((res)=>{
			// 					if(res){
			// 						// 轮询接口查看音频合成状态
			// 						this.checkTaskJob(id)
			// 					}else{
			// 						this.setSynthesiStatus(false)
			// 					}
			// 				}).catch((err)=>{
			// 					// console.log(111, err)
			// 					this.setSynthesiStatus(false)
			// 				})
			// 			}
			// 		}
			// 		break;
			// }
		},
		globelMessage3(data){
			// console.log('data', data)
			if(this.liveInfo){
				if(data.commentFeeds){
					// 评论
					this.addMsg(data.commentFeeds[0].content); // 添加用户评论信息到列表
					this.startReply(data.commentFeeds[0].content); // 自动回复
				}else if(data.giftFeeds){
					const username = data.giftFeeds[0].user.userName
					// 礼物
					const { is_gift, id } = this.liveInfo
					if(is_gift==1 && !this.synthesizing){
						this.setSynthesiStatus(true)
						// 先发起请求告诉服务器开始合成音频
						const text = username.replace(/[^\u4E00-\u9FA5\w\s\d]/g, '').replace(/\s/g, '')
						aliJob({room_id: id, content: `感谢${text}送来的礼物`,type:1}).then((res)=>{
							if(res){
								// 轮询接口查看音频合成状态
								this.checkTaskJob(id)
							}else{
								this.setSynthesiStatus(false)
							}
						}).catch((err)=>{
							// console.log(111, err)
							this.setSynthesiStatus(false)
						})
					}
				}
			}
		},
		globelMessage4(data){
			if(data.msgList.length>0){
				const msg = data.msgList[0]
				switch(msg.type){
					case 1:
						// 评论
						this.addMsg(msg.content); // 添加用户评论信息到列表
						this.startReply(msg.content); // 自动回复
						console.log('回复:', msg.content)
						break;
					case 10005:
						// 进入直播间
						if(this.liveInfo){
							const { is_welcome, id, name_before, name_after } = this.liveInfo
							if(is_welcome==1 && !this.synthesizing){
								const text = name_before + msg.nickname + name_after
								console.log('text', text)
								this.setSynthesiStatus(true)
								// 先发起请求告诉服务器开始合成音频
								aliJob({room_id: id, content: text, type:1}).then((res)=>{
									if(res){
										// 轮询接口查看音频合成状态
										this.checkTaskJob(id)
									}else{
										this.setSynthesiStatus(false)
									}
								}).catch((err)=>{
									// console.log(111, err)
									this.setSynthesiStatus(false)
								})
							}
						}
						break;
				}
				
			}
		},
		// 美团
		globelMessage5(data){
			if(data.ms.length>3){
				const msg = JSON.parse(data.ms[3].c) //.c
				switch(msg.msgType){
					case 2:
						// 评论
						if(msg.imMsgDTO){
							this.addMsg(msg.imMsgDTO.content); // 添加用户评论信息到列表
							this.startReply(msg.imMsgDTO.content); // 自动回复
							console.log('回复:', msg.imMsgDTO.content)
						}
						break;
					case 101:
						// 进入直播间
						if(this.liveInfo){
							const { is_welcome, id, name_before, name_after } = this.liveInfo
							if(is_welcome==1 && !this.synthesizing){
								let text = ""
								if(msg.imUserDTO){
									text = name_before + msg.imUserDTO.userName + name_after
									console.log('text', text)
								}else{
									return;
								}
								
								this.setSynthesiStatus(true)
								// 先发起请求告诉服务器开始合成音频
								aliJob({room_id: id, content: text, type:1}).then((res)=>{
									if(res){
										// 轮询接口查看音频合成状态
										this.checkTaskJob(id)
									}else{
										this.setSynthesiStatus(false)
									}
								}).catch((err)=>{
									// console.log(111, err)
									this.setSynthesiStatus(false)
								})
							}
						}
						break;
				}
			}
		},
		welcomeEnd(){
			this.wlcPlaying = false
			const interval = this.liveInfo.welcome_interval*1000||30000
			// if(this.innerAudioContext.currentTime>0 && this.innerAudioContext.currentTime<this.innerAudioContext.duration) {
			if(this.innerAudioContext && this.innerAudioContext.paused && this.isplay) {
				// 被暂停的回复继续播放
				this.innerAudioContext.play()
			}else if(this.vRef.length>0){
				this.vRef[this.current].play()
			}
			setTimeout(()=>this.setSynthesiStatus(false), interval)
			this.wlcObj.destroy()
			this.wlcObj = null
		},
		playWelcomeWord(url){
			this.wlcObj = uni.createInnerAudioContext();
			// 然后再播放欢迎语
			this.wlcObj.src = url
			this.wlcObj.autoplay = true
			this.wlcObj.volume = 1
			this.wlcObj.onCanplay(()=>{
				this.wlcPlaying = true
				// 先暂停当前其他正在播放的声音
				if(this.innerAudioContext && !this.innerAudioContext.paused){
					this.innerAudioContext.pause()
				}else{
					this.vRef[this.current].pause()
				}
				this.wlcObj.play();
			})
			this.wlcObj.onEnded(this.welcomeEnd)
			if(plus.os.name!=='iOS'){
				this.wlcObj.onError(this.welcomeEnd)
			}
		},
		checkTaskJob(room_id){
			if(!this.liveInfo) return
			checkJob({room_id}).then(res=>{
				if(res&&res.data&&res.data.length>0){
					// 播放欢迎语
					const url = res.data[0]
					this.playWelcomeWord(url)
					return
				}else{
					this.checkTaskJob(room_id)
				}
			}).catch((err)=>{
				// console.log(4444, err)
				// this.checkTaskJob(room_id)
				this.setSynthesiStatus(false)
			})
		},
		globelMessage2(data){
			const { content } = data
			if(content){
				this.addMsg(content); // 添加用户评论信息到列表
				this.startReply(content); // 自动回复
			}
		},
		
		cancelSub(channel) {
			// 取消通道的订阅
			if(!this.wsObj) return
			const user = useUserStore()
			sendDateByChannel({ uid: user.info.userId, channel, sub: false })
		},
		subscribe(channel, data) {
			// 订阅某个通道的数据
			const user = useUserStore()
			sendDateByChannel({
				uid: user.info.userId,
				channel,
				sub: true,
				data
			})
		},
	}
})