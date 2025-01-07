<template>
    <view v-if="show" class="verify-mask">
      <view class="verify-box">
        <view class="verify-header">
          <text>请完成安全验证</text>
          <view class="verify-close" @tap="closeVerify">×</view>
        </view>
        <view class="verify-content">
          <!-- 点选验证码 -->
          <template v-if="captchaType === 'clickWord'">
            <view class="verify-canvas-area">
              <view 
                class="verify-img-panel"
                :style="{
                  width: setSize.imgWidth,
                  height: setSize.imgHeight,
                  'margin-bottom': vSpace + 'px'
                }"
              >
                <image 
                  ref="canvas"
                  :src="pointBackImgBase ? ('data:image/png;base64,' + pointBackImgBase) : ''" 
                  style="width:100%;height:100%;display:block"
                  @tap="canvasClick"
                  @error="handleImageError"
                />
                <view v-show="showRefresh" class="verify-refresh" @tap="refresh">
                  <text class="verify-refresh-icon">↻</text>
                </view>
                <view
                  v-for="(tempPoint, index) in tempPoints"
                  :key="index"
                  class="point-area"
                  :style="{
                    'background-color': '#1abd6c',
                    color: '#fff',
                    'z-index': 9999,
                    width: '20px',
                    height: '20px',
                    'text-align': 'center',
                    'line-height': '20px',
                    'border-radius': '50%',
                    position: 'absolute',
                    top: parseInt(tempPoint.y-10) + 'px',
                    left: parseInt(tempPoint.x-10) + 'px'
                  }"
                >
                  {{ index + 1 }}
                </view>
              </view>
            </view>
            <view class="verify-bar-area" :style="{width: setSize.imgWidth, height: barSize.height, 'line-height': barSize.height}">
              <text class="verify-msg">{{ text }}</text>
            </view>
          </template>

          <!-- 滑块验证码 -->
          <template v-else>
            <view class="verify-canvas-area">
              <view 
                class="verify-img-panel"
                :style="{
                  width: setSize.imgWidth,
                  height: setSize.imgHeight,
                }"
              >
                <image 
                  :src="backImgBase ? ('data:image/png;base64,' + backImgBase) : ''" 
                  style="width:100%;height:100%;display:block"
                  @error="handleImageError"
                  @load="handleImageLoad"
                />
                <view v-show="showRefresh" class="verify-refresh" @tap="refresh">
                  <text class="verify-refresh-icon">↻</text>
                </view>
                <transition name="tips">
                  <text v-if="tipWords" class="verify-tips" :class="passFlag ? 'suc-bg' : 'err-bg'">{{ tipWords }}</text>
                </transition>
              </view>
            </view>
            <view class="verify-bar-area" :style="{width: setSize.imgWidth, height: barSize.height, 'line-height': barSize.height}">
              <text class="verify-msg">{{ text }}</text>
              <view 
                class="verify-left-bar"
                :style="{
                  width: leftBarWidth !== undefined ? leftBarWidth : barSize.height, 
                  height: barSize.height, 
                  'border-color': leftBarBorderColor,
                  transition: transitionWidth
                }"
              >
                <text class="verify-msg">{{ finishText }}</text>
                <view
                  class="verify-move-block"
                  :style="{
                    width: barSize.height,
                    height: barSize.height,
                    'background-color': moveBlockBackgroundColor,
                    left: moveBlockLeft,
                    transition: transitionLeft
                  }"
                  @touchstart="start"
                  @touchmove.stop.prevent="move"
                  @touchend="end"
                >
                  <text class="verify-icon" :style="{color: iconColor}">→</text>
                  <view
                    class="verify-sub-block"
                    :style="{
                      width: Math.floor(parseInt(setSize.imgWidth) * 47/310) + 'px',
                      height: setSize.imgHeight,
                      top: '-' + (parseInt(setSize.imgHeight) + vSpace) + 'px',
                    }"
                  >
                    <image 
                      :src="blockBackImgBase ? ('data:image/png;base64,' + blockBackImgBase) : ''" 
                      style="width:100%;height:100%;display:block"/>
                  </view>
                </view>
              </view>
            </view>
          </template>
        </view>
      </view>
    </view>
  </template>
  
  <script>
  import { getVerify, checkVerify } from '@/api/verify'
  import CryptoJS from 'crypto-js'
  
  export default {
    name: 'Verify',
    props: {
      captchaType: {
        type: String,
        default: 'blockPuzzle' // blockPuzzle-滑块 clickWord-点选
      },
      imgSize: {
        type: Object,
        default() {
          return {
            width: '310px',
            height: '155px'
          }
        }
      },
      barSize: {
        type: Object,
        default() {
          return {
            width: '310px',
            height: '40px'
          }
        }
      },
      vSpace: {
        type: Number,
        default: 5
      }
    },
    data() {
      return {
        show: false,
        backImgBase: '', // 滑块-验证码背景图片
        blockBackImgBase: '', // 滑块-验证滑块图片
        pointBackImgBase: '', // 点选-验证码背景图片
        backToken: '', // 后端返回的token
        secretKey: '', // 加密key
        passFlag: '',
        tipWords: '',
        setSize: {
          imgHeight: 0,
          imgWidth: 0,
          barHeight: 0,
          barWidth: 0
        },
        moveBlockLeft: undefined,
        leftBarWidth: undefined,
        status: false,
        isEnd: false,
        showRefresh: true,
        transitionLeft: '',
        transitionWidth: '',
        startLeft: 0,
        moveBlockBackgroundColor: '#fff',
        leftBarBorderColor: '#ddd',
        iconColor: '#000',
        text: '',
        finishText: '',
        startMoveTime: '',
        endMovetime: '',
        tempPoints: [], // 点选-临时点
        checkNum: 3, // 点选-需要点击的字数
        num: 1, // 点选-点击记数
        poinTextList: [], // 点选-文字
        checkPosArr: [] // 点选-坐标
      }
    },
    watch: {
      captchaType: {
        immediate: true,
        handler(val) {
          this.text = val === 'blockPuzzle' ? '向右滑动完成验证' : ''
        }
      }
    },
    mounted() {
      // 禁止拖拽
      this.$el.onselectstart = function() {
        return false
      }
      
      // 初始尺寸
      this.setSize = {
        imgWidth: this.imgSize.width,
        imgHeight: this.imgSize.height,
        barWidth: this.barSize.width,
        barHeight: this.barSize.height
      }
      
      // 注册移动事件 - 修改为uni-app的事件监听方式
      uni.$on('touchmove', (e) => {
        this.move(e)
      })
      uni.$on('touchend', () => {
        this.end()
      })
    },
    beforeDestroy() {
      // 组件销毁时移除事件监听
      uni.$off('touchmove')
      uni.$off('touchend')
    },
    methods: {
      showVerify() {
        console.log('显示验证码弹窗')
        this.show = true
        // 确保DOM更新后再获取图片
        this.$nextTick(() => {
          this.getPictrue()
        })
      },
      closeVerify() {
        this.show = false
        this.refresh()
      },
      // 获取验证图片
      getPictrue() {
        console.log('开始获取验证码图片')
        const storageKey = this.captchaType === 'blockPuzzle' ? 'slider' : 'point'
        const clientUid = uni.getStorageSync(storageKey)
        const uuid = clientUid || this.createUUID()
        if (!clientUid) {
          uni.setStorageSync(storageKey, uuid)
        }
        
        const data = {
          captchaType: this.captchaType,
          clientUid: uuid,
          ts: Date.now()
        }

        getVerify(data)
          .then(response => {            
            // 如果返回成功
            if (response.repCode === '0000' && response.success) {
              if(this.captchaType === 'blockPuzzle') {
                const originalImage = response.repData.originalImageBase64
                const jigsawImage = response.repData.jigsawImageBase64
                
                if (!originalImage || !jigsawImage) {
                  throw new Error('图片数据为空')
                }

                // 先清空现有图片
                this.backImgBase = ''
                this.blockBackImgBase = ''
                
                // 确保DOM更新后再设置新图片
                this.$nextTick(() => {
                  // 如果base64字符串没有data:image前缀，添加它
                  this.backImgBase = originalImage
                  this.blockBackImgBase = jigsawImage
                  
                  console.log('图片数据设置完成')
                })
              } else {
                console.log('设置点选验证码图片')
                this.pointBackImgBase = response.repData.originalImageBase64
                this.poinTextList = response.repData.wordList
                this.text = '请依次点击【' + this.poinTextList.join(',') + '】'
              }
              this.backToken = response.repData.token
              this.secretKey = response.repData.secretKey
            } else {
              throw new Error(response.repMsg || '获取验证码失败')
            }
          })
          .catch(error => {
            console.error('获取验证码失败:', error.message || error)
            this.tipWords = error.message || '获取验证码失败'
            setTimeout(() => {
              this.tipWords = ''
            }, 3000)
          })
      },
      refresh() {
        console.log('刷新验证码')
        this.showRefresh = true
        this.finishText = ''
        
        if(this.captchaType === 'blockPuzzle') {
          this.transitionLeft = 'left .3s'
          this.moveBlockLeft = 0
          
          this.leftBarWidth = undefined
          this.transitionWidth = 'width .3s'
          
          this.leftBarBorderColor = '#ddd'
          this.moveBlockBackgroundColor = '#fff'
          this.iconColor = '#000'
        } else {
          this.tempPoints = []
          this.checkPosArr = []
          this.num = 1
        }
        
        this.isEnd = false
        this.getPictrue()
        
        setTimeout(() => {
          this.transitionWidth = ''
          this.transitionLeft = ''
          if(this.captchaType === 'blockPuzzle') {
            this.text = '向右滑动完成验证'
          }
        }, 300)
      },
      // 滑块-开始
      start(e) {
        if(this.isEnd) return
        
        this.startMoveTime = +new Date()
        if (e.touches && e.touches[0]) {
          this.startLeft = e.touches[0].clientX
        }
        this.status = true
        this.text = ''
        this.moveBlockBackgroundColor = '#337ab7'
        this.leftBarBorderColor = '#337AB7'
        this.iconColor = '#fff'
      },
      // 滑块-移动
      move(e) {
        if(this.status && !this.isEnd) {
          let moveX = 0
          if (e.touches && e.touches[0]) {
            moveX = e.touches[0].clientX - this.startLeft
          }
          
          if(moveX < 0) moveX = 0
          if(moveX > parseInt(this.setSize.imgWidth) - parseInt(this.barSize.height)) {
            moveX = parseInt(this.setSize.imgWidth) - parseInt(this.barSize.height)
          }
          
          this.moveBlockLeft = moveX + 'px'
          this.leftBarWidth = moveX + 'px'
        }
      },
      // 滑块-结束
      end() {
        if(this.status && !this.isEnd) {
          this.endMovetime = +new Date()
          
          const moveLeftDistance = parseInt((this.moveBlockLeft || '').replace('px', ''))
          // 转换坐标
          const moveDistance = Math.round(310 * moveLeftDistance / parseInt(this.setSize.imgWidth))
          
          const data = {
            captchaType: this.captchaType,
            pointJson: this.secretKey ? 
              this.aesEncrypt(JSON.stringify({ x: moveDistance, y: 5.0 }), this.secretKey) : 
              JSON.stringify({ x: moveDistance, y: 5.0 }),
            token: this.backToken
          }
          
          checkVerify(data).then(res => {
            if(res.repCode === '0000') {
              this.validateSuccess(moveLeftDistance)
            } else {
              this.validateFail()
            }
          }).catch(() => {
            this.validateFail()
          })
        }
      },
      // 点选-点击
      canvasClick(e) {
        if(this.isEnd) return
        
        const rect = e.target.getBoundingClientRect()
        const x = e.touches[0].clientX - rect.left
        const y = e.touches[0].clientY - rect.top
        
        this.checkPosArr.push({x, y})
        this.tempPoints.push({x, y})
        
        if(this.num === this.checkNum) {
          this.isEnd = true
          
          const data = {
            captchaType: this.captchaType,
            pointJson: this.secretKey ? 
              this.aesEncrypt(JSON.stringify(this.checkPosArr), this.secretKey) : 
              JSON.stringify(this.checkPosArr),
            token: this.backToken
          }
          
          checkVerify(data).then(res => {
            if(res.repCode === '0000') {
              this.validateSuccess()
            } else {
              this.validateFail()
            }
          }).catch(() => {
            this.validateFail()
          })
        }
        
        if(this.num < this.checkNum) {
          this.num++
        }
      },
      // 验证成功
      validateSuccess(moveLeftDistance) {
        this.isEnd = true
        this.passFlag = true
        this.tipWords = `${((this.endMovetime - this.startMoveTime) / 1000).toFixed(2)}s验证成功`
        
        try {
          // 转换坐标
          const moveDistance = Math.round(310 * moveLeftDistance / parseInt(this.setSize.imgWidth))
          const verifyData = {
            x: moveDistance,
            y: 5.0
          }
          
          const token = this.backToken
          const verifyString = token + '---' + JSON.stringify(verifyData)
          
          const captchaVerification = this.secretKey ? 
            this.aesEncrypt(verifyString, this.secretKey) : 
            verifyString
          
          setTimeout(() => {
            this.tipWords = ''
            this.show = false
            this.$emit('success', { captchaVerification })
          }, 1000)
        } catch (error) {
          console.error('验证数据处理失败:', error)
          this.validateFail()
        }
      },
      // 验证失败
      validateFail() {
        this.moveBlockBackgroundColor = '#d9534f'
        this.leftBarBorderColor = '#d9534f'
        this.iconColor = '#fff'
        this.passFlag = false
        this.tipWords = '验证失败'
        setTimeout(() => {
          this.tipWords = ''
          this.refresh()
        }, 1000)
        this.$emit('error', this)
      },
      // AES加密
      aesEncrypt(word, key) {
        const keyParsed = CryptoJS.enc.Utf8.parse(key)
        const srcs = CryptoJS.enc.Utf8.parse(word)
        const encrypted = CryptoJS.AES.encrypt(srcs, keyParsed, {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7
        })
        return encrypted.toString()
      },
      // 生成UUID
      createUUID() {
        let d = new Date().getTime()
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = (d + Math.random() * 16) % 16 | 0
          d = Math.floor(d / 16)
          return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
        })
      },
      // 添加图片错误处理方法
      handleImageError(e) {
        console.error('图片加载失败:', e)
        this.tipWords = '图片加载失败，请刷新重试'
        setTimeout(() => {
          this.tipWords = ''
          this.refresh()
        }, 2000)
      },
      // 添加图片加载成功处理方法
      handleImageLoad() {
        console.log('图片加载成功')
      },
      // 添加坐标转换方法
      pointTransfrom(point) {
        const x = Math.round(310 * point.x / parseInt(this.setSize.imgWidth))
        const y = Math.round(155 * point.y / parseInt(this.setSize.imgHeight))
        return { x, y }
      }
    }
  }
  </script>
  
  <style>
  .verify-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .verify-box {
    width: 320px;
    background: #fff;
    border-radius: 2px;
  }
  .verify-header {
    height: 50px;
    line-height: 50px;
    text-align: center;
    position: relative;
  }
  .verify-close {
    position: absolute;
    right: 0;
    top: 0;
    width: 50px;
    height: 50px;
    text-align: center;
    cursor: pointer;
    font-size: 20px;
  }
  .verify-content {
    padding: 15px;
  }
  .verify-img-panel {
    margin: 0 auto;
    position: relative;
    box-sizing: content-box;
    border: 1px solid #ddd;
    background: #f7f9fa;
  }
  .verify-img-panel img {
    width: 100%;
    height: 100%;
    display: block;
  }
  .verify-refresh {
    position: absolute;
    right: 5px;
    top: 5px;
    width: 30px;
    height: 30px;
    cursor: pointer;
    background: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
  }
  .verify-refresh-icon {
    font-size: 20px;
  }
  .verify-bar-area {
    position: relative;
    background: #f5f5f5;
    text-align: center;
    box-sizing: content-box;
    border: 1px solid #ddd;
  }
  .verify-msg {
    color: #999;
  }
  .verify-left-bar {
    position: absolute;
    top: -1px;
    left: -1px;
    background: #f5f5f5;
    height: 100%;
    border: 1px solid #ddd;
    box-sizing: content-box;
  }
  .verify-move-block {
    position: absolute;
    top: 0;
    left: 0;
    width: 40px;
    height: 100%;
    background: #fff;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
    cursor: pointer;
    transition: background .2s linear;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
  }
  .verify-sub-block {
    position: absolute;
    box-sizing: border-box;
    cursor: pointer;
    background-size: 100% 100%;
    z-index: 9999;
  }
  .verify-tips {
    position: absolute;
    left: 0;
    bottom: -22px;
    width: 100%;
    height: 22px;
    line-height: 22px;
    text-align: center;
    color: #fff;
    font-size: 12px;
    transition: all .4s;
  }
  .suc-bg {
    background-color: rgba(92, 184, 92, 0.5);
  }
  .err-bg {
    background-color: rgba(217, 83, 79, 0.5);
  }
  .point-area {
    position: absolute;
    background-color: #1abd6c;
    z-index: 9999;
  }
  </style>