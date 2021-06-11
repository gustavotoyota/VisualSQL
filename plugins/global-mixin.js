import Vue from "vue"



if (!Vue.__global_mixin__) {
  Vue.__global_mixin__ = true

  Vue.mixin({

    computed: {

      $state: {
        get() { return this.$store.state },
        set(value) { this.$store.state = value },
      },

      $getters() {
        return this.$store.getters
      },

    },

  })
}