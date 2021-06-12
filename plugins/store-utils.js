Object.defineProperties(global, {
  
  $state: {
    get() { return $nuxt.$store.state },
    set(value) { $nuxt.$store.state = value },
  },

  $getters: {
    get() { return $nuxt.$store.getters },
  },

})




global.$store = {}

$store.commit = (mutation, payload) => {
  $nuxt.$store.commit(mutation, payload)
}