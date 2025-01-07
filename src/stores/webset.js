import { defineStore } from 'pinia'
import request from '@/utils/request'

export const useWebsetStore = defineStore('webset', {
  state: () => {
    // 从本地存储加载配置
    const staticWebsite = uni.getStorageSync('webset_staticWebsite') || ''
    console.log('初始化 staticWebsite:', staticWebsite)
    
    return {
      website: uni.getStorageSync('webset_website') || '',
      staticWebsite,
      websocketUrl: uni.getStorageSync('webset_websocketUrl') || '',
      proxyHost: uni.getStorageSync('webset_proxyHost') || '',
      proxyPort: uni.getStorageSync('webset_proxyPort') || '',
      fileSaveStrategy: uni.getStorageSync('webset_fileSaveStrategy') || '',
      streamResponseType: uni.getStorageSync('webset_streamResponseType') || '',
      webIssueTime: uni.getStorageSync('webset_webIssueTime') || '',
      maxUserLogin: uni.getStorageSync('webset_maxUserLogin') || '',
      defaultUserImgUrl: uni.getStorageSync('webset_defaultUserImgUrl') || '',
      defaultUserTouristImgUrl: uni.getStorageSync('webset_defaultUserTouristImgUrl') || '',
      projectVersion: uni.getStorageSync('webset_projectVersion') || ''
    }
  },

  getters: {
    getStaticUrl: (state) => (path) => {
      if (!path) return ''
      if (path.startsWith('http')) return path
      return `${state.staticWebsite}${path}`
    }
  },

  actions: {
    async initWebset() {
      try {
        const res = await request({
          url: '/module/system/baseresourceconfig/configMain',
          method: 'get',
        })
        if (res.status && res.data) {
          console.log('res.data:', res.data)
          const config = JSON.parse(res.data.resourceValue)
          Object.keys(this.$state).forEach(key => {
            if (config.hasOwnProperty(key)) {
              this.$state[key] = config[key]
              uni.setStorageSync(`webset_${key}`, config[key])
            }
          })
        }
      } catch (error) {
        console.error('Failed to initialize webset:', error)
      }
    },

    clearWebset() {
      Object.keys(this.$state).forEach(key => {
        this.$state[key] = ''
        uni.removeStorageSync(`webset_${key}`)
      })
    }
  }
}) 