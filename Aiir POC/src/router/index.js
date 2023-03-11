import { createRouter, createWebHistory } from 'vue-router'
import DocumentList from '../views/DocumentList.vue'
import DocumentCreate from '../views/DocumentCreate.vue'
import DocumentDetail from '../views/DocumentDetail.vue'
import DocumentEdit from '../views/DocumentEdit.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: DocumentList
    },
    {
      path: '/documents',
      name: 'documents',
      component: DocumentList
    },
    {
      path: '/documents/new',
      name: 'documents.create',
      component: DocumentCreate
    },
    {
      path: '/documents/:id',
      name: 'documents.details',
      component: DocumentDetail
    },
    {
      path: '/documents/:id/edit',
      name: 'documents.edit',
      component: DocumentEdit
    }
  ]
})

export default router
