export default {
  path: 'dashboard',
  name: 'dashboard',
  meta: {
    isVerificationL: false,
    title: '概览',
    iconName: 'icon-dashboard'
  },
  component: (resolve) => require(['../page/dashboard/dashboard'], resolve),
  //redirect: '/dashboard/dispatchDashboard',
  children: [{
    path: 'dispatchDashboard',
    name: 'dispatchDashboard',
    meta: {
      isVerificationL: false,
      title: '车辆调度概览',
    },
    component: (resolve) => require(['../page/dashboard/dispatchDashboard'], resolve),
  }, {
    path: 'importStatisticsDashboard',
    name: 'importStatisticsDashboard',
    meta: {
      isVerificationL: false,
      title: '数据统计概览',
    },
    component: (resolve) => require(['../page/dashboard/importStatisticsDashboard'], resolve),
  }]
}
