import { defineStore } from 'pinia'

// 用户 Store
export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: JSON.parse(localStorage.getItem('userInfo')) || null,
    isAuthenticated: false,
    lastUpdated: Date.now()
  }),
  actions: {
    setUserInfo(userInfo) {
      this.userInfo = userInfo
      this.isAuthenticated = !!userInfo
      this.lastUpdated = Date.now()
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
    },
    clearUserInfo() {
      this.userInfo = null
      this.isAuthenticated = false
      localStorage.removeItem('userInfo')
    },
    checkExpiration() {
      const now = Date.now()
      const expirationTime = 3 * 60 * 1000 // 3分钟
      if (now - this.lastUpdated > expirationTime) {
        this.clearUserInfo()
      }
    }
  }
})

// 管理员 Store
export const useAdminStore = defineStore('admin', {
  state: () => ({
    adminInfo: JSON.parse(localStorage.getItem('adminInfo')) || null,
    lastUpdated: Date.now()
  }),
  actions: {
    setAdminInfo(info) {
      this.adminInfo = info
      this.lastUpdated = Date.now()
      localStorage.setItem('adminInfo', JSON.stringify(info))
    },
    clearAdminInfo() {
      this.adminInfo = null
      localStorage.removeItem('adminInfo')
    },
    checkExpiration() {
      const now = Date.now()
      const expirationTime = 3 * 60 * 1000 // 3分钟
      if (now - this.lastUpdated > expirationTime) {
        this.clearAdminInfo()
      }
    }
  }
})

// 游客 Store
export const useVisitorStore = defineStore('visitor', {
  state: () => ({
    visitorInfo: JSON.parse(localStorage.getItem('visitorInfo')) || null,
    isAuthenticated: false,
    lastUpdated: Date.now()
  }),
  actions: {
    setVisitorInfo(info) {
      this.visitorInfo = info
      this.isAuthenticated = !!info
      this.lastUpdated = Date.now()
      localStorage.setItem('visitorInfo', JSON.stringify(info))
    },
    clearVisitorInfo() {
      this.visitorInfo = null
      this.isAuthenticated = false
      localStorage.removeItem('visitorInfo')
    },
    checkExpiration() {
      const now = Date.now()
      const expirationTime = 3 * 60 * 1000 // 3分钟
      if (now - this.lastUpdated > expirationTime) {
        this.clearVisitorInfo()
      }
    }
  }
})
