<template>
  <div>
    <h1>Create New Document</h1>
    <Camera :resolution="{ width: 375, height: 812 }" ref="camera" autoplay>
      <button @click="onCaptureSnapshot">Capture snapshot</button>
    </Camera>
    <form @submit.prevent="onSubmit">
      <div>
        <label for="report">Report:</label>
        <input type="checkbox" name="report" id="report" v-model="report" />
      </div>
      <div>
        <label for="description">Description:</label>
        <input type="text" name="description" id="description" v-model="description" />
      </div>
      <div>
        <label for="image">Image:</label>
        <div>
          <img :src="state.image" :alt="state.description" width="100" height="100" />
        </div>
        <input type="file" name="image" id="image" @change="onImageChange" />
      </div>
      <button type="submit">Create Document</button>
    </form>
    <router-link to="/documents">Back to Documents</router-link>
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
  image: null
})

const camera = ref('camera')

const onCaptureSnapshot = async (e) => {
  const blob = await camera.value.snapshot()
  const url = URL.createObjectURL(blob)

  state.image = url

  console.log(url, blob)
}

const onSubmit = () => {
  const document = {
    report: state.report,
    description: state.description,
    image: state.image
  }

  documentsStore.createDocument(document).then(() => {
    router.push('/documents')
  })
}

const onImageChange = (e) => {
  let files = e.target.files || e.dataTransfer.files
  if (!files.length) {
    return
  }
  createImage(files[0])
}

const createImage = (file) => {
  var reader = new FileReader()

  reader.onload = (e) => {
    state.image = e.target.result
  }
  reader.readAsDataURL(file)
}
</script>
