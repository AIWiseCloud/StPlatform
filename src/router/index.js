import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  }
]

export const mallRoutes = [

]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/settings',
    component: Layout,
    meta: { title: '商城配置', icon: 'settings' },
    children: [
      {
        path: 'resourcesettings',
        name: 'resourcesettings',
        component: () => import('@/views/settings/resourcesettings'),
        meta: { title: '资源配置', icon: 'settings' }
      },
      {
        path: 'submessage',
        component: () => import('@/views/settings/submessage'),
        name: 'submessage',
        meta: { title: '辅助资料', icon: 'tree-table', noCache: true }
      },
      {
        path: 'shop',
        component: () => import('@/views/settings/shop'),
        name: 'shop',
        meta: { title: '店铺设置', icon: 'shop', noCache: true }
      },
      {
        path: 'version',
        component: () => import('@/views/settings/version'),
        name: 'version',
        meta: { title: '版本管理', icon: 'table' }
      },
      {
        path: 'news',
        name: 'news',
        component: () => import('@/views/settings/news'),
        meta: { title: '新闻动态', icon: 'list' }
      },
      {
        name: 'newsDetails',
        path: 'newsDetails/:isnew/:newsid',
        component: () => import('@/views/settings/newsDetails'),
        meta: { title: '编辑新闻动态', icon: 'table' },
        hidden: true
      },
      {
        name:'projectcase',
        path:'projectcase',
        component:()=>import('@/views/settings/projectcase'),
        meta:{title:'工程案例',icon:'international'}
      }
    ]
  },
  {
    path: '/goods',
    component: Layout,
    meta: { title: '商品管理', icon: 'goods' },
    children: [
      {
        path: 'goodsCategory',
        component: () => import('@/views/goods/goodsCategory'),
        name: 'goodsCategory',
        meta: { title: '商品分类', icon: 'tree-table', noCache: true }
      },
      {
        path: 'goods',
        component: () => import('@/views/goods/goodsList'),
        name: 'goodslist', // 这个name必须和vue页面中的name一致,keep-alive才有效
        meta: { title: '商品管理', icon: 'goods' }
      },
      {
        path: 'goodsInfo/:isNew/:goodsId',
        component: () => import('@/views/goods/goodsInfo'),
        name: 'goodsInfo',
        meta: { title: '商品信息', icon: 'goods', noCache: true },
        hidden: true
      },
      {
        path: 'stockBill',
        name: 'stockBill',
        component: () => import('@/views/goods/stockBill'),
        meta: { title: '出入库', icon: 'stock' }
      },
      {
        path: 'stockBillDetail/:isNew/:billId',
        name: 'stockBillDetail',
        component: () => import('@/views/goods/stockBillDetail'),
        meta: { title: '单据编辑', icon: 'stock' },
        hidden: true
      },
      {
        path: 'inventory',
        name: 'inventory',
        component: () => import('@/views/goods/inventory'),
        meta: { title: '库存管理', icon: 'inventory' }
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    meta: { title: '售后服务', icon: 'documentation' },
    children: [
      {
        path: 'advancemoney',
        name: 'advancemoney',
        component: () => import('@/views/order/advancemoney'), // 若用反引号会报错：TypeError: Cannot read property 'range' of null
        meta: { title: '定金管理', icon: 'documentation' }
      },
      {
        path: 'order',
        name: 'orders',
        component: () => import('@/views/order/index'), // 若用反引号会报错：TypeError: Cannot read property 'range' of null
        meta: { title: '订单管理', icon: 'documentation' }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    meta: { title: '用户管理', icon: 'peoples' },
    children: [
      {
        path:'salesman',
        name:'salesman',
        component:()=>import('@/views/user/salesman'),
        meta:{title:'业务员',icon:'user'}
      },
      {
        path: 'user', name: 'users',
        component: () => import('@/views/user/index'),
        meta: { title: '用户查询', icon: 'user' }
      },
      {
        path: 'certification',
        name: 'certification',
        component: () => import('@/views/user/certification'),
        meta: { title: '认证管理', icon: 'people' }
      }
    ]
  },
  {
    path: '/error',
    component: Layout,
    redirect: 'noRedirect',
    name: 'ErrorPages',
    hidden: true, // 不在主界面显示roy
    meta: {
      title: 'Error Pages',
      icon: '404'
    },
    children: [
      {
        path: '401',
        component: () => import('@/views/error-page/401'),
        name: 'Page401',
        meta: { title: '401', noCache: true }
      },
      {
        path: '404',
        component: () => import('@/views/error-page/404'),
        name: 'Page404',
        meta: { title: '404', noCache: true }
      }
    ]
  },

  {
    path: '/error-log',
    component: Layout,
    hidden: true, // 不在主界面显示roy
    children: [
      {
        path: 'log',
        component: () => import('@/views/error-log/index'),
        name: 'ErrorLog',
        meta: { title: 'Error Log', icon: 'bug' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
