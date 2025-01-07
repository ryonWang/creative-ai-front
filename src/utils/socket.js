import { useLiveStore } from '@/stores'
// websocket实例
let wsObj = null
// ws连接地址
let wsUrl = null
// 平台类型
let platform = 1 // 1抖音 2 快手
// let userId = null;
// 是否执行重连 true/不执行 ； false/执行
let lockReconnect = false
// 重连定时器
let wsCreateHandler = null
// 连接成功，执行回调函数
let messageCallback = null
// 连接失败，执行回调函数
let errorCallback = null
// 发送给后台的数据
let sendDatas = {}
// 重连定时器
let reconnect_timer = null 

/**
 * 发起websocket请求函数
 * @param {string} url ws连接地址
 * @param {string} type 平台类型
 * @param {Object} agentData 传给后台的参数
 * @param {function} successCallback 接收到ws数据，对数据进行处理的回调函数
 * @param {function} errCallback ws连接错误的回调函数
 */
export const connectWebsocket = (type, url, agentData, successCallback, errCallback) => {
  const live = useLiveStore()
  live.setIsManualClose(false)
  switch(type){
	  case 1:
		wsUrl = live.request_type===1 ? url : `${url}?path=${agentData.path}&type=${agentData.type}`
		break;
	  case 3:
		wsUrl = `${url}?cookie=${agentData.cookie}&type=5`
		break;
	  default:
		wsUrl = `${url}?path=${agentData.path}&type=${agentData.type}`
   }
  console.log('wsUrl111', wsUrl)
  platform = type
  createWebSoket()
  messageCallback = successCallback
  errorCallback = errCallback
  sendDatas = agentData
}

// 手动关闭websocket （这里手动关闭会执行onclose事件）
export const closeWebsocket = () => {
	writeToScreen('手动关闭websocket')
	if (wsObj) {
		wsObj.close() // 关闭websocket
	}
	wsObj = null
	// 不需要重连 则 关闭重连
	lockReconnect = true
	const live = useLiveStore()
	live.setIsManualClose(true)
	if(wsCreateHandler) clearTimeout(wsCreateHandler)
	if(reconnect_timer){
		reconnect_timer = clearInterval(reconnect_timer)
	}
	// 关闭心跳检查
	heartCheck.stop()
}

// 向服务器发送对应通道到请求参数
export const sendDateByChannel = (data) => {
  // const reqData = { channel: channel || 'odd', ...data }
  wsObj.send({data: JSON.stringify(data)})
}

// 创建ws函数
const createWebSoket = () => {
	// const live = useLiveStore()
	// if(live.isManualClose) return
	if(wsObj){
		wsObj.close()
	}

	try {
		wsObj = uni.connectSocket({url: wsUrl, complete: ()=> {}})
		initWsEventHandle()
	} catch (e) {
		writeToScreen('连接异常，开始重连')
		reconnect()
	}
}

const initWsEventHandle = () => {
  try {
    lockReconnect = false
    // 连接成功
	wsObj.onOpen(event => {
      useLiveStore().$patch({ wsObj })
      onWsOpen(event)
      // heartCheck.start()
    })

    // 监听服务器端返回的信息
    wsObj.onMessage(event => {
      onWsMessage(event)
      // heartCheck.start()
    })

    wsObj.onClose(event => {
      useLiveStore().$patch({ wsObj: null })
      writeToScreen('onclose执行关闭事件')
      onWsClose(event)
    })

    wsObj.onError(event => {
      writeToScreen('onerror执行error事件，开始重连')
      onWsError(event)
      reconnect()
    })
  } catch (err) {
    writeToScreen('绑定事件没有成功，开始重连')
    reconnect()
  }
}

const onWsOpen = (event) => {
  writeToScreen('CONNECT')
  // // 客户端与服务器端通信
  // wsObj.send('我发送消息给服务端');
  // 添加状态判断，当为OPEN时，发送消息
  if (wsObj.readyState === wsObj.OPEN) { // wsObj.OPEN = 1
	if(reconnect_timer) clearInterval(reconnect_timer)
    // 发给后端的数据需要字符串化
    if(platform!==2) wsObj.send({data: JSON.stringify(sendDatas)})
	// 7分钟定时重连
	reconnect_timer = setInterval(reconnect, 420000)
  }
  if (wsObj.readyState === wsObj.CLOSED) { // wsObj.CLOSED = 3
    writeToScreen('wsObj.readyState=3, ws连接异常，开始重连')
    reconnect()
    errorCallback()
  }
}
const onWsMessage = (event) => {
  const jsonStr = event.data
  const data = JSON.parse(jsonStr)
  // writeToScreen('onWsMessage back data: ',  jsonStr)
  messageCallback(data)
}
const onWsClose = (event) => {
  // e.code === 1000  表示正常关闭。 无论为何目的而创建, 该链接都已成功完成任务。
  // e.code !== 1000  表示非正常关闭。
  console.log('DISCONNECT: ', event)
  if (event && event.code !== 1000) {
    writeToScreen('非正常关闭')
    errorCallback()
    // 如果不是手动关闭，这里的重连会执行；如果调用了手动关闭函数，这里重连不会执行
    reconnect()
  }
}
const onWsError = (event) => {
  writeToScreen('onWsError: ', event.errMsg)
  errorCallback()
}

const writeToScreen = (massage) => {
  console.log(massage)
}

// 重连函数
const reconnect = () => {
  const live = useLiveStore()
  if (lockReconnect || live.isManualClose) {
    return
  }
  writeToScreen('1秒后重连')
  lockReconnect = true
  // 没连接上会一直重连，设置延迟避免请求过多
  wsCreateHandler && clearTimeout(wsCreateHandler)
  wsCreateHandler = setTimeout(() => {
	if(live.isManualClose) return
    writeToScreen('重连...' + wsUrl)
    createWebSoket()
    lockReconnect = false
    writeToScreen('重连完成')
  }, 1000)
}

// 从浏览器地址中获取对应参数
// eslint-disable-next-line no-unused-vars
/*const GetQueryString = (name) => {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  // 获取url中 ? 符后的字符串并正则匹配
  let r = window.location.search.substr(1).match(reg)
  let context = ''
  r && (context = r[2])
  reg = null
  r = null
  return context
}*/

// 心跳检查（看看websocket是否还在正常连接中）
const heartCheck = {
  // timeout: 60000,
  timeout: 10000,
  timeoutObj: null,
  serverTimeoutObj: null,
  // 重启
  reset() {
    this.timeoutObj && clearInterval(this.timeoutObj)
    this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj)
    this.start()
  },
  // 停止
  stop() {
    this.timeoutObj && clearInterval(this.timeoutObj)
    this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj)
  },
  // 开启定时器
  start() {
    this.timeoutObj && setInterval(this.timeoutObj)
    this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj)
    // 15s之内如果没有收到后台的消息，则认为是连接断开了，需要重连
    this.timeoutObj = setInterval(() => {
      try {
		// writeToScreen('send ping')
		// wsObj.send({data: 'ping'})
      } catch (err) {
        writeToScreen('发送ping异常')
      }
      // console.log('内嵌定时器this.serverTimeoutObj: ', this.serverTimeoutObj)
      // 内嵌定时器检测服务器是否挂掉
      // this.serverTimeoutObj = setTimeout(() => {
      //   writeToScreen('没有收到后台的数据，重新连接')
      //   reconnect()
      // }, 100)
    }, this.timeout)
  }
}