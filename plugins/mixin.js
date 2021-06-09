import Vue from "vue"



if (!Vue.__my_mixin__) {
  Vue.__my_mixin__ = true

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