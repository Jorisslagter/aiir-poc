<template>
  <div>
    <h1>Document Details</h1>
    <div>
      <img :src="document.image" :alt="document.description" width="100" height="100" />
    </div>
    <div><strong>Report:</strong> {{ document.report ? 'Yes' : 'No' }}</div>
    <div><strong>Description:</strong> {{ document.description }}</div>
    <div><strong>Timestamp:</strong> {{ document.timestamp }}</div>
    <div>
      <button @click="onEdit">Edit Document</button>
      <router-link to="/documents">Back to Documents</router-link>
    </div>
  </div>
</template>

<script setup>
import { useDocumentsStore } from '../stores/documents'
import { useRoute, useRouter } from 'vue-router'

const documentsStore = useDocumentsStore()
const router = useRouter()
const route = useRoute()

const documentId = route.params.id
const document = documentsStore.getDocument(documentId)

const onEdit = () => {
  router.push(`/documents/${document.id}/edit`)
}
</script>
