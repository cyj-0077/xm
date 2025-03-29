import { createRouter, createWebHistory } from 'vue-router'
import userLogin from '@/views/user/Login.vue'
import userRegister from '@/views/user/Register.vue'
import userResetPassword from '@/views/user/resetPassword.vue'
import userMain from '@/views/user/Main.vue'
import userProfile from '@/views/user/Profile.vue'
import userSendMessage from '@/views/user/SendMessage.vue'
import userViewMessages from '@/views/user/ViewMessages.vue'
import adminLogin from '@/views/admin/Login.vue'
import adminRegister from '@/views/admin/Register.vue'
import adminMain from '@/views/admin/Main.vue'
import adminDashboard from '@/views/admin/Dashboard.vue'
import adminAddUser from '@/views/admin/AddUser.vue'
import adminViewUser from '@/views/admin/ViewUser.vue'
import visitorLogin from '@/views/visitor/Login.vue'
import visitorRegister from '@/views/visitor/Register.vue'
import visitorMain from '@/views/visitor/Main.vue'
import visitorReserve from '@/views/visitor/Reserve.vue'
import { useUserStore,useAdminStore,useVisitorStore } from '@/router/store'

const routes = [
  // 重定 向
  {
    path: '/',
    redirect: '/user/login'
  },
  // 普通用户路由
  {
    path: '/user',
    redirect: '/user/login',
    children: [
      {
        path: 'login',
        component: userLogin
      },
      {
        path: 'register',
        component: userRegister
      },
      {
        path: 'resetPassword',
        component: userResetPassword
      },
      {
        path: '/user/main',
        component: userMain,
        children: [
          {
            path: 'profile',
            component: userProfile
          },
          {
            path: 'send-message',
            component: userSendMessage
          },
          {
            path: 'view-messages',
            component: userViewMessages
          }
        ]
      },
    ]
  },

  // 管理员路由组
  {
      path: '/admin',
      redirect: '/admin/login',
      children: [
        {
          path: '/admin/login',
          component: adminLogin
        },
        {
          path: '/admin/register',
          component: adminRegister
        },
      ]
  },
  {
    path: '/admin/main',
    component: adminMain,
    children: [
      {
        path: "/:pathMatch(.*)*", // 必备
        component: adminMain
      },
      {
        path: 'dashboard',
        component: adminDashboard
      },
      {
        path: 'users',
        children: [
          {
            path: 'add',
            component: adminAddUser
          },
          {
            path: 'view',
            component: adminViewUser
          }
        ]
      }
    ]
  },

  // 游客路由组
  {
    path: '/visitor',
    redirect: '/visitor/login',
    children: [
      {
        path: 'login',
        component: visitorLogin
      },
      {
        path:'register',
        component: visitorRegister
      }
    ]
  },
  {
    path: '/visitor/main',
    component: visitorMain,
    children: [
      {
        path: 'reserve',
        component: visitorReserve
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const adminStore = useAdminStore()

  // 管理员路由验证
  if (to.path.startsWith('/admin')) {
    if (to.meta.requiresAuth && !adminStore.adminInfo) {
      next('/admin/login')
    } else if (to.path === '/admin/login' && adminStore.adminInfo) {
      next('/admin/main')
    } else {
      next()
    }
    return
  }

  // 普通用户路由验证
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    next('/login') // 如果需要认证且未认证，重定向到登录页
  } else {
    next() // 否则继续导航
  }
  // 游客路由验证
  if (to.meta.requiresAuth && !visitorStore.visitorInfo) {
    next('/visitor/login')
  }
})

export default router
