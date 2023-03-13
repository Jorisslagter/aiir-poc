import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import { useStorage } from '@vueuse/core'

export const useDocumentsStore = defineStore('documents', {
  id: 'documents',
  state: () => ({
    documents: useStorage('documents', []),
    isServerRunning: false,
    initialized: false
  }),

  getters: {
    isInitialized: (state) => state.initialized,
    getDocuments: (state) => state.documents,

    getDocument: (state) => (id) => state.documents.find((d) => d.id === id),

    getPendingDocuments: (state) => {
      return state.documents.filter((document) => !document.uploaded)
    }
  },

  actions: {
    async createDocument(document) {
      document.id = uuidv4()
      document.timestamp = new Date()
      document.uploaded = false
      document.image_local = URL.createObjectURL(document.image)

      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result.replace('data:', '').replace(/^.+,/, '')
        let imageObj = {
          name: 'tmp-' + uuidv4(),
          timestamp: Date.now(),
          file_base64: base64String.toString()
        }

        document.image_file_base64 = JSON.stringify(imageObj)

        this.documents.push(document)

        this.uploadToServer(document)
      }
      reader.readAsDataURL(document.image)

      return Promise.resolve(document)
    },

    updateDocument(document) {
      const index = this.documents.findIndex((d) => d.id === document.id)
      this.documents.splice(index, 1, document)
    },

    deleteDocument(id) {
      const index = this.documents.findIndex((document) => document.id === id)
      this.documents.splice(index, 1)
    },

    uploadToServer(document) {
      let formData = new FormData()

      formData.append('document', JSON.stringify(document))

      let tmp = JSON.parse(document.image_file_base64).file_base64
      formData.append('base64', tmp)

      fetch('http://localhost:3000/documents', {
        method: 'POST',
        body: formData
      }).then((response) => {
        if (response.status == 201) {
          let data = response.json()
          document.uploaded = true
          document.image = data.image
          this.updateDocument(document)
        }
      })
    },
    syncDocuments() {
      const notUploadedDocuments = this.getPendingDocuments
      notUploadedDocuments.forEach((document) => {
        this.uploadToServer(document)
      })
    },
    initializeStore() {
      if (!this.initialized)
        fetch('http://localhost:3000/documents', {
          method: 'GET'
        })
          .then((response) => response.json())
          .then((response) => {
            console.log(response)
            const newDocuments = response.filter(
              (doc) => !this.documents.some((d) => d.id === doc.id)
            )
            console.log(newDocuments)
            this.documents = [...this.documents, ...newDocuments]
            this.initialized = true
          })
    }
  }
})
