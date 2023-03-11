<template>
  <form class="document-form" @submit.prevent="onSubmit">
    <div class="form-row">
      <DocumentImage :document="document" />
    </div>
    <div class="form-row">
      <label for="report">Report:</label>
      <input class="report-input" type="checkbox" id="report" v-model="state.report" />
    </div>
    <div class="form-row">
      <label for="description">Description:</label>
      <textarea class="description-input" id="description" v-model="state.description"></textarea>
    </div>
    <button class="submit-button" type="submit">Save</button>
  </form>
</template>

<script setup>
import { reactive } from 'vue'
import { useDocumentsStore } from '../stores/documents'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DocumentImage from '../components/DocumentImage.vue'

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

const onSubmit = () => {
  const updatedDocument = {
    ...document,
    report: state.report,
    description: state.description
  }

  store.updateDocument(updatedDocument)

  router.push('/documents')
}
</script>

<style>
.document-form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
}

.image-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  margin-right: 10px;
  width: 100px;
  height: 100px;
  overflow: hidden;
}

.image-preview img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.image-input {
  display: none;
}

.report-input {
  margin-right: 10px;
}

.description-input {
  width: 100%;
  height: 100px;
}

.submit-button {
  margin-top: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #3e8e41;
}
</style>
