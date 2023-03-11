<template>
  <div class="create-document">
    <h1>Create New Document</h1>

    <form class="document-form" @submit.prevent="onSubmit">
      <div class="form-row" v-if="!state.image">
        <Camera :resolution="{ width: 375, height: 812 }" ref="camera" autoplay>
          <div class="capture" @click="onCaptureSnapshot">Capture snapshot</div>
        </Camera>
      </div>
      <div class="form-row" v-if="state.image">
        <label for="image">Image:</label>
        <div>
          <img :src="state.image" :alt="state.description" width="100" height="100" />
        </div>
      </div>

      <div class="form-row">
        <label for="report">Report:</label>
        <input type="checkbox" name="report" id="report" v-model="state.report" />
      </div>
      <div class="form-row">
        <label for="description">Description:</label>
        <input type="text" name="description" id="description" v-model="state.description" />
      </div>

      <button type="submit">Create Document</button>
    </form>
    <router-link class="back-link" to="/documents">Back to Documents</router-link>
    <!-- <p v-if="!isServerRunning" class="server-status">Server is offline</p> -->
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useDocumentsStore } from '../stores/documents'
import { useRouter } from 'vue-router'
import Camera from 'simple-vue-camera'

const documentsStore = useDocumentsStore()
const router = useRouter()

const state = reactive({
  report: false,
  description: '',
  image: null,
  blob: null,
  isServerRunning: false
})

const camera = ref('camera')

const onCaptureSnapshot = async (e) => {
  const blob = await camera.value.snapshot()
  const url = URL.createObjectURL(blob)

  state.image = url
  state.blob = blob
}

const onSubmit = () => {
  const document = {
    report: state.report,
    description: state.description,
    image: state.blob
  }

  documentsStore.createDocument(document).then(() => {
    router.push('/documents')
  })
}
</script>

<style scoped>
.create-document {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}

h1 {
  font-size: 2rem;
  margin-bottom: 2rem;
}

.capture {
  padding: 16px;
  background: #fff;
  width: 50%;
  margin: 15px;
  cursor: pointer;
}
.document-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 400px;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.form-row {
  display: flex;
  gap: 1rem;
  align-items: center;
}

label {
  font-weight: bold;
}

button[type='submit'] {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #0d6efd;
  border: none;
  border-radius: 5px;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

button[type='submit']:hover {
  background-color: #0b5ed7;
}

.back-link {
  margin-top: 1rem;
  font-size: 1rem;
  color: #0d6efd;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.back-link:hover {
  color: #0b5ed7;
}

.server-status {
  margin-top: 1rem;
  font-size: 1rem;
  color: #dc3545;
  animation: blinker 1s linear infinite;
}

@keyframes blinker {
  50% {
    opacity: 0;
  }
}
</style>
