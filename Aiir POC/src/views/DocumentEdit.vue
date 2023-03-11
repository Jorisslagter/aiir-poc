<template>
  <form @submit.prevent="onSubmit">
    <div>
      <label for="image">Image:</label>
      <div>
        <img :src="state.image" :alt="state.description" width="100" height="100" />
      </div>
      <input type="file" id="image" ref="imageInput" accept="image/*" @change="onImageChange" />
    </div>
    <div>
      <label for="report">Report:</label>
      <input type="checkbox" id="report" v-model="state.report" />
    </div>
    <div>
      <label for="description">Description:</label>
      <textarea id="description" v-model="state.description"></textarea>
    </div>
    <button type="submit">Save</button>
  </form>
</template>

<script setup>
import { reactive } from 'vue'
import { useDocumentsStore } from '../stores/documents'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const state = reactive({
  report: false,
  description: '',
  image: null
})

const store = useDocumentsStore()
const router = useRouter()
const route = useRoute()

const documentId = route.params.id

const document = store.getDocument(documentId)

state.report = ref(document.report)
state.description = ref(document.description)
state.image = ref(document.image)

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

const onSubmit = () => {
  const updatedDocument = {
    ...document,
    report: state.report,
    description: state.description,
    image: state.image
  }

  store.updateDocument(updatedDocument)

  router.push('/documents')
}
</script>
