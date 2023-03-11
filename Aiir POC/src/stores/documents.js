import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import { useStorage } from '@vueuse/core'

export const useDocumentsStore = defineStore('documents', {
  id: 'documents',
  state: () => ({
    documents: useStorage('documents', [])
  }),

  getters: {
    getDocuments: (state) => state.documents,

    getDocument: (state) => (id) => state.documents.find((d) => d.id === id),

    getPendingDocuments: (state) => {
      return state.documents.filter((document) => !document.uploaded)
    }
  },

  actions: {
    createDocument(document) {
      document.id = uuidv4()
      document.timestamp = new Date()
      document.uploaded = false
      // Add the document to the state
      this.documents.push(document)

      return Promise.resolve(document)
    },

    updateDocument(document) {
      const index = this.documents.findIndex((d) => d.id === document.id)
      this.documents.splice(index, 1, document)
    },

    deleteDocument(id) {
      const index = this.documents.findIndex((document) => document.id === id)
      this.documents.splice(index, 1)
    }
  }
})
