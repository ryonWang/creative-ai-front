import { useUserStore } from '@/stores'
import { last, shuffle, nth } from 'lodash-es'
import { routeGuard } from './auth'

export const goTo = async (url, cb) => {
	const complete = cb ? cb : () => {};
	
	// Check authentication and route protection
	const canNavigate = await routeGuard(url)
	if (!canNavigate) {
		complete()
		return
	}
	
	// Proceed with navigation
	uni.navigateTo({
		url, 
		success: () => {
			console.log('Navigation successful')
			complete()
		},
		fail: (err) => {
			console.error('Navigation failed:', err)
			complete()
		}
	})
}

// 随机播放函数
export function randomArr(data){
	// 先获取最后一个元素
	const lastOne = last(data)
	// 创建新的随机数组
	let newArr = shuffle(data)
	const first = nth(newArr, 0)
	if(first===lastOne){
		const second = nth(newArr, 1)
		newArr[0] = second
		newArr[1] = first
	}
	return newArr
}

// 同时下载多文件
export function downLoadAudio(mediaArr, callBack){
	uni.showLoading({title: '预下载音频资源', mask: true}) 
	let progress = 0;
	// 下载文件
	const downloadList = mediaArr.map(item => {
	  return new Promise((resolve, reject) => {
	    uni.downloadFile({
	      url: item.full_path,
	      success(res) {
	        // 下载成功
			const { apFilePath, tempFilePath, statusCode } = res
	        resolve({...item, tempFilePath});
	      },
	      fail(err) {
	        // 下载失败
			// reject(err);
			resolve(item);
	      },
	      complete() {
	        // 每个文件下载完成后更新进度
	        progress++;
	      }
	    });
	  });
	});
	// 判断所有文件是否下载成功
	Promise.all(downloadList).then(results => {
		// console.log('All files downloaded successfully:', results);
		callBack(results)
	}).catch(error => {
		uni.showToast({title: '部分音频资源下载失败', icon: 'none'})
	}).finally(()=>{
		uni.hideLoading()
	});
}

// 检测小程序权限
export function checkPermissions(permiss, callback){
	uni.getSetting({
		success: (res) => {
			if(!res.authSetting[`scope.${permiss}`]){
				// 无权限先获取授权
				uni.authorize({
					scope: `scope.${permiss}`,
					success () {
					  console.log('授权成功')
					  callback()
					},
					fail () {
						uni.showToast({title: '授权失败', icon: 'error'})
					}
				})
			}else{
				// 有权限直接执行回调函数
				callback()
			}
		}
	})
}

// 检测APP权限
export function checkAppPermissions(permiss, callback){
	const appAuthSetting = uni.getAppAuthorizeSetting()
	if(appAuthSetting[permiss]==='authorized'){
		if(callback) callback()
	}else{
		// 没有相关权限
		uni.showModal({
			title: '获取权限失败', 
			content: '没有对应的APP权限,是否跳转到权限设置？',
			success: function (res) {
				if (res.confirm) {
					uni.openAppAuthorizeSetting({
						success (res) {
							console.log(res)
						}
					})
				} else if (res.cancel) {
					console.log('用户点击取消');
				}
			},
		})
	}
}