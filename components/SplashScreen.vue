<template>

  <transition name="fade">
    <div v-if="!$state.loaded"
    style="position: absolute; background-color: #181818;
    left: 0; right: 0; top: 0; bottom: 0; z-index:10000;
    display: flex; justify-content: center; align-items: center">
      <img src="/logo/192x192.png"/>
    </div>
  </transition>

</template>

<script>
export default {

}
</script>

<style scoped>
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-leave-to {
  opacity: 0;
}
</style>