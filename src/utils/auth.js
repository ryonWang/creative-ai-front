import { useUserStore } from '@/stores'

// Token key in storage
const TokenKey = 'token'

// White list of routes that don't require authentication
const whiteList = [
  '/pagesub/login/index',
  '/pages/index/index'
]

// Get token from storage
export function getToken() {
  return uni.getStorageSync(TokenKey)
}

// Set token to storage
export function setToken(token) {
  return uni.setStorageSync(TokenKey, token)
}

// Remove token from storage
export function removeToken() {
  return uni.removeStorageSync(TokenKey)
}

// Check if route requires authentication
export function needAuth(url) {
  return !whiteList.some(path => url.startsWith(path))
}

// Validate token by checking user info
export async function validateToken() {
  const userStore = useUserStore()
  try {
    await userStore.GetInfo()
    return true
  } catch (error) {
    console.error('Token validation failed:', error)
    return false
  }
}

// Route guard function
export async function routeGuard(url) {
  const userStore = useUserStore()
  const token = getToken()
  
  // Check if route needs authentication
  if (needAuth(url)) {
    if (!token) {
      // No token, redirect to login
      uni.redirectTo({ url: '/pagesub/login/index' })
      return false
    }
    
    // Validate token by getting user info
    const isValid = await validateToken()
    if (!isValid) {
      userStore.logOut()
      uni.showToast({
        title: '登录已过期，请重新登录',
        icon: 'none',
        duration: 2000
      })
      return false
    }
  }
  
  // Allow navigation
  return true
} 