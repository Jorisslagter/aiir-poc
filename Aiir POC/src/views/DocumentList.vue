<template>
  <div>
    <h1>Documents</h1>
    <ul>
      <li v-for="document in documents" :key="document.id">
        <router-link :to="`/documents/${document.id}`">{{ document.timestamp }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDocumentsStore } from '../stores/documents'

const documentsStore = useDocumentsStore()

const documents = computed(() => documentsStore.getDocuments)
</script>
