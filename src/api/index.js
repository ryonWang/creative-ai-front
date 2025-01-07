import request from '@/utils/request'
import { useUserStore } from '@/stores'

// login
export function login(data) {
	return request({
		loading: true,
		url: '/module/user/userinfo/login',
		method: 'post',
		data,
		headers: {
			'Content-Type': 'application/json'
		}
	})
}

// 注册
export function register(data) {
	return request({
		url: '/v1/register',
		method: 'post',
		data
	})
}
// 七牛云token
export function qiniuToken(params){
	return request({
		url: '/v1/common/qiniu/token',
		method: 'get',
		params
	})
}
// 卡密激活
export function activateCode(params){
	return request({
		loading: true,
		url: '/v1/admin/activate/code',
		method: 'get',
		params
	})
}
// change password
export function changePwd(id, data) {
	return request({
		loading: true,
		url: `/v1/admin/${id}`,
		method: 'patch',
		data
	})
}

// userinfo
export function getUserInfo(params) {
	return request({
		url: '/v1/common/info',
		method: 'get',
		params
	})
}

// 创建回复分类
export function crtReplyClass(data) {
	return request({
		loading: true,
		url: '/v1/answer',
		method: 'post',
		data
	})
}

// 添加关键词
export function addKeyword(data){
	return request({
		loading: true,
		url: '/v1/ans/add/title',
		method: 'post',
		data
	})
}
// 编辑关键词
export function editKeyword(id, data){
	return request({
		loading: true,
		url: `/v1/ans/edit/keyword/${id}`,
		method: 'put',
		data
	})
}
// 回复分类表
export function replyClassList(params){
	return request({
		url: '/v1/answer',
		method: 'get',
		params
	})
}

// 回复列表
export function replyList(id, params){
	return request({
		url: `/v1/answer/keywords/${id}`,
		method: 'get',
		params
	})
}
// 回复添加语音
export function addVoiceAtReply(id, data){
	return request({
		loading: true,
		url: `v1/add/media/${id}`,
		method: 'post',
		data
	})
}
// 删除回复分类
export function deleReplyClass(id){
	return request({
		url: `/v1/answer/${id}`,
		method: 'delete',
	})
}

// 删除回复列表
export function deleReply(id){
	return request({
		url: `/v1/destory/keywords/${id}`,
		method: 'delete',
	})
}

// 删除回复内得语音
export function deleReplyVoice(id){
	return request({
		url: `/v1/del/media/${id}`,
		method: 'delete',
	})
}

// 语音库列表
export function voiceIndex(params) {
	return request({
		url: '/v1/voice',
		method: 'get',
		params
	})
}

// 创建Ai语音库
export function voiceStore(data) {
	return request({
		url: '/v1/voice',
		method: 'post',
		data
	})
}

// 删除Ai语音库
export function voiceDestory(params) {
	return request({
		url: '/v1/voice/'+ params.id,
		method: 'delete'
	})
}

// 编辑Ai语音库
export function voiceUpdate(data) {
	return request({
		url: '/v1/voice/'+data.id,
		method: 'put',
		data
	})
}

// 语音库内语音列表
export function voiceReaIndex(params) {
	return request({
		url: '/v1/voice/rea',
		method: 'get',
		params
	})
}

// 语音库内语音创建
export function voiceReaCreate(data) {
	return request({
		url: '/v1/voice/rea',
		method: 'post',
		data
	})
}

// 语音库内语音列表
export function voiceReaDestory(params) {
	return request({
		url: '/v1/voice/rea/'+params.id,
		method: 'delete',
	})
}

// ai生成话术语音
export function voiceAliJob(data) {
	return request({
		url: '/v1/ali/new/job',
		method: 'post',
		data
	})
}

// 刷新任务
export function checkNewJob(params) {
	return request({
		url: 'v1/check/new/job',
		method: 'get',
		params
	})
}

// 检测oem是否开始ai转语音
export function oemInfo(params) {
	return request({
		url: 'v1/get/oem/info',
		method: 'get',
		params
	})
}


// 话术库
export function scriptIndex() {
	return request({
		url: '/v1/script/library',
		method: 'get'
	})
}

// 语音库内语音-排序
export function voiceRelationSort(data) {
	return request({
		url: '/v1/voice/relation/sort',
		method: 'post',
		data
	})
}

// 获取直播间标题
export function getLiveTit(data){
	return request({
		loading: true,
		url: '/v1/get/live/title',
		method: 'post',
		data
	})
}

// 开启直播间
export function createLiveRoom(data){
	return request({
		loading: true,
		url: '/v1/store/live',
		method: 'post',
		data
	})
}

// 获取直播间信息
export function getLiveRoom(params){
	return request({
		loading: true,
		url: '/v1/get/live',
		method: 'get',
		params
	})
}

// 获取最新APP版本
export function getAppVersion(){
	return request({
		url: '/version',
		method: 'get',
	})
}

// 反馈
export function sendFeedBack(data){
	return request({
		loading: true,
		url: '/v1/feedback',
		method: 'post',
		data
	})
}
// 错误统计
export function errorStatistics(data){
	return request({
		url: '/max',
		method: 'post',
		data
	})
}

// 轮播图
export function getBanner(params){
	return request({
		url: '/v1/oem/config',
		method: 'get',
		params
	})
}

// 公共语音库分类
export function commonVoiceCategory(params){
	return request({
		url: '/v1/voice/category',
		method: 'get',
		params
	})
}

// 公共语音库列表
export function commonVoiceList(params){
	return request({
		url: '/v1/public/voice',
		method: 'get',
		params
	})
}

// AI创作
export function chatGPT(params){
	return request({
		url: '/v1/chat',
		method: 'get',
		params
	})
}

// 话术库分类列表
export function getAnswerScript(params){
	return request({
		url: '/v1/answer/script',
		method: 'get',
		params
	})
}

// 话术库子分类列表
export function getSubAnswer(params){
	return request({
		url: '/v1/sub/answer/script',
		method: 'get',
		params
	})
}

// 话术库子分类列表
export function getAwScript(params){
	return request({
		url: '/v1/aw/script',
		method: 'get',
		params
	})
}

// 创建商品库
export function goodsCategoryStore(data) {
	return request({
		url: '/v1/goods/category',
		method: 'post',
		data
	})
}

// 删除商品库
export function goodsCategoryDestory(params) {
	return request({
		url: '/v1/goods/category/'+ params.id,
		method: 'delete'
	})
}

// 编辑商品库
export function goodsCategoryUpdate(data) {
	return request({
		url: '/v1/goods/category/'+data.id,
		method: 'put',
		data
	})
}

// 商品库列表
export function goodsCategoryIndex(params) {
	return request({
		url: '/v1/goods/category',
		method: 'get',
		params
	})
}

// 创建商品
export function goodsStore(data) {
	return request({
		url: '/v1/goods',
		method: 'post',
		data
	})
}

// 删除商品
export function goodsDestory(params) {
	return request({
		url: '/v1/goods/'+ params.id,
		method: 'delete'
	})
}

// 编辑商品
export function goodsUpdate(data) {
	return request({
		url: '/v1/goods/'+data.id,
		method: 'put',
		data
	})
}

// 商品列表
export function goodsIndex(params) {
	return request({
		url: '/v1/goods',
		method: 'get',
		params
	})
}

// 语音商品关联
export function voiceGoods(data) {
	return request({
		url: '/v1/voice/goods',
		method: 'post',
		data
	})
}

// 检测敏感词
export function checkWords(data) {
	return request({
		url: '/v1/check/words',
		method: 'post',
		data
	})
}
// 获取直播间描述
export function getLiveDesc() {
	return request({
		url: '/live/desc',
		method: 'get',
	})
}

// 创建合成任务
export function aliJob(data) {
	return request({
		url: '/v1/ali/job',
		method: 'post',
		data
	})
}

// 检查合成任务的状态
export function checkJob(params) {
	return request({
		url: '/v1/check/job',
		method: 'get',
		params
	})
}

// 直播历史记录
export function liveHistory(params) {
	return request({
		url: '/v1/get/history',
		method: 'get',
		params
	})
}

export function getLiveById(params) {
	return request({
		url: '/v1/get/live/id',
		method: 'get',
		params
	})
}

// 获取视频号二维码
export function getLoginCode(params) {
	return request({
		url: '/v1/get/login/code',
		method: 'get',
		params
	})
}

// 获取视频号二维码
export function checkSphStatus(params) {
	return request({
		url: '/v1/check/sph/status',
		method: 'get',
		params
	})
}

// 获取公告
export function getNotice(){
	return request({
		url: 'module/business/noticeclient/getLastNotice',
		method: 'get'
		})
}

// 上传图片
export function uploadImg({ filePath, formData = {} }) {
	return new Promise((resolve, reject) => {
		const userStore = useUserStore()
		uni.uploadFile({
			url: 'http://localhost:7100/module/synthesis/outfit/uploadFitImg',
			filePath,
			name: 'file',
			header: {
				'Authorization': 'Bearer ' + userStore.token
			},
			formData,
			success: (uploadRes) => {
				try {
					const result = JSON.parse(uploadRes.data)
					resolve(result)
				} catch (e) {
					reject(new Error('上传响应格式错误'))
				}
			},
			fail: (error) => {
				reject(error)
			}
		})
	})
}