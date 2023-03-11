<template>
  <p v-if="!isServerRunning" class="server-offline-indicator">Server is offline</p>

  <button @click="sync">Synch</button>

  <div class="document-list">
    <div v-for="document in documents" :key="document.id" class="document-item">
      <div class="document-image" v-if="document.image_url">
        <img :src="'http://localhost:3000/' + document.image_url" alt="document image" />
      </div>
      <div class="document-image" v-if="!document.image_url">
        <img
          :src="'data:image/png;base64,' + JSON.parse(document.image_file_base64).file_base64"
          alt="document image"
        />
      </div>
      <div class="document-info">
        <div class="document-timestamp">{{ document.timestamp }}</div>
        <div class="document-report">
          {{ document.report ? 'Report image' : 'Not a report image' }}
        </div>
        <div class="document-description">{{ document.description }}</div>
      </div>
      <div class="document-actions">
        <div v-if="canEditDocument(document)">
          <router-link :to="{ name: 'documents.edit', params: { id: document.id } }"
            >Edit</router-link
          >
        </div>
        <span v-if="!document.uploaded" class="document-status">Pending</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useDocumentsStore } from '../stores/documents'

const isServerRunning = ref(false)
const pingInterval = 1000
let pingTimeoutId

const pingServer = () => {
  fetch('http://localhost:3000/ping')
    .then((response) => {
      isServerRunning.value = response.ok
      scheduleNextPing()
    })
    .catch(() => {
      isServerRunning.value = false
      scheduleNextPing()
    })
}

const scheduleNextPing = () => {
  clearTimeout(pingTimeoutId)
  pingTimeoutId = setTimeout(pingServer, pingInterval)
}

const documentsStore = useDocumentsStore()

const documents = computed(() => documentsStore.getDocuments)

onMounted(() => {
  pingServer()

  watch(isServerRunning, (a, b) => {
    if (a) {
      if (!documentsStore.isInitialized) {
        documentsStore.initializeStore()
      }

      if (a != b) {
        documentsStore.syncDocuments()
      }
    } else {
      // nothing to update
    }
  })
})

const canEditDocument = (document) => isServerRunning.value || !document.uploaded

const sync = () => {
  documentsStore.syncDocuments()
}
</script>

<style scoped>
.document-list {
  display: flex;
  flex-wrap: wrap;
}

.document-item {
  width: 33.33%;
  height: 400px;
  margin: 16px;
  padding-top: 32px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.document-image {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60%;
}

.document-image img {
  max-width: 100%;
  max-height: 100%;
}

.document-info {
  display: flex;
  flex-direction: column;
  height: 40%;
  padding: 16px;
}

.document-timestamp {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

.document-report {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.document-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.document-actions {
  display: flex;
  justify-content: space-between;
  padding: 8px;
  background-color: #f5f5f5;
  border-top: 1px solid #ccc;
  height: 40px;
}

.document-actions button {
  background-color: #f44336;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.document-actions button:hover {
  background-color: #d32f2f;
}

.server-offline-indicator {
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  padding: 10px;
  background-color: #e74c3c;
  color: #fff;
  text-align: center;
  animation: blink 5s ease-in-out infinite;
}

@keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.document-status {
  position: absolute;
  bottom: 5px;
  right: 5px;
  background-color: #f44336;
  color: #fff;
  font-weight: bold;
  font-size: 12px;
  padding: 2px 5px;
  border-radius: 5px;
}
</style>
