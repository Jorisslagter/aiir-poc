<template>
  <section>
    <h1>Aiir Poc</h1>
    <router-link to="/documents">View Documents</router-link>
    <router-link to="/documents/new">Create New Document</router-link>
  </section>
  <section>
    <RouterView />
  </section>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref, onMounted } from 'vue'

// const addToHome = () => {}

onMounted(() => {
  // if ('serviceWorker' in navigator) {
  //   navigator.serviceWorker
  //     .register('service-worker.js')
  //     .then((reg) => {
  //       console.log('Registration succesful, scope: ' + reg.scope)
  //     })
  //     .catch((err) => {
  //       console.log(err)
  //     })
  // }
})
</script>

<style></style>
