Object.defineProperties(global, {

  $store: {
    get() { return $nuxt.$store },
  },
  
  $state: {
    get() { return $nuxt.$store.state },
    set(value) { $nuxt.$store.state = value },
  },

  $getters: {
    get() { return $nuxt.$store.getters },
  },

})