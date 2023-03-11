<template>
  <div class="document-image">
    <img
      v-if="document.image_url"
      :src="'http://192.168.178.42:3000/' + document.image_url"
      alt="document image"
    />
    <img
      v-else
      :src="'data:image/png;base64,' + JSON.parse(document.image_file_base64).file_base64"
      alt="document image"
    />
  </div>
</template>

<script>
export default {
  props: {
    document: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
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
</style>
