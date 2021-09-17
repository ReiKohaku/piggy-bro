import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/:id',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      {
        path: 'wiki',
        component: () => import('pages/Wiki/Index.vue'),
        children: [
          { path: ':name', component: () => import('pages/Wiki/Wiki.vue') }
        ]
      },
      { path: 'status', component: () => import('pages/Status.vue') }
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
