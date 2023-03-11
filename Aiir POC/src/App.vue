<template>
  <button class="add-button" @click="addToHome">Add to home screen</button>
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

const addToHome = () => {}

onMounted(() => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('service-worker.js')
      .then((reg) => {
        console.log('Registration succesful, scope: ' + reg.scope)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
      // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI to notify the user they can add to home screen
    addBtn.style.display = "block";

    addBtn.addEventListener("click", (e) => {
      // hide our user interface that shows our A2HS button
      addBtn.style.display = "none";
      // Show the prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the A2HS prompt");
        } else {
          console.log("User dismissed the A2HS prompt");
        }
        deferredPrompt = null;
      });
    });

  }
})
</script>

<style></style>
