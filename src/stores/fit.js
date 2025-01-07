import { defineStore } from 'pinia'

export const useFitStore = defineStore('fit', {
  state: () => ({
    modelImage: '', // 人物照片
    topImage: '',   // 上装照片
    bottomImage: '', // 下装照片
    isUploading: false
  }),

  getters: {
    // 检查是否所有必需的图片都已选择
    isReadyToGenerate: (state) => {
      return state.modelImage && (state.topImage || state.bottomImage)
    }
  },

  actions: {
    // 设置模特照片
    setModelImage(path) {
      this.modelImage = path
    },

    // 设置上装照片
    setTopImage(path) {
      this.topImage = path
    },

    // 设置下装照片
    setBottomImage(path) {
      this.bottomImage = path
    },

    // 清空所有数据
    clearAll() {
      this.modelImage = ''
      this.topImage = ''
      this.bottomImage = ''
      this.isUploading = false
    },

    // 开始上传
    async startGenerate() {
      if (!this.isReadyToGenerate) {
        uni.showToast({
          title: '请确保已选择模特照片和至少一件衣物',
          icon: 'none'
        })
        return false
      }

      try {
        this.isUploading = true
        uni.showLoading({
          title: '正在生成...',
          mask: true
        })

        // 准备上传的图片数组
        const uploadTasks = []
        
        // 添加模特照片
        if (this.modelImage) {
          uploadTasks.push({
            filePath: this.modelImage,
            type: 'model'
          })
        }
        
        // 添加上装照片
        if (this.topImage) {
          uploadTasks.push({
            filePath: this.topImage,
            type: 'top'
          })
        }
        
        // 添加下装照片
        if (this.bottomImage) {
          uploadTasks.push({
            filePath: this.bottomImage,
            type: 'bottom'
          })
        }

        // 返回上传任务数组，实际上传将在组件中处理
        return uploadTasks
      } catch (error) {
        uni.showToast({
          title: error.message || '准备上传失败',
          icon: 'none'
        })
        return false
      } finally {
        this.isUploading = false
        uni.hideLoading()
      }
    }
  }
}) 