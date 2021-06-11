global._store = {}




Object.defineProperties(_store, {
  
  state: {
    get() { return $nuxt.$store.state },
    set(value) { $nuxt.$store.state = value },
  },

  getters: {
    get() { return $nuxt.$store.getters },
  },

})




_store.commit = (mutation, payload) => {
  $nuxt.$store.commit(mutation, payload)
}