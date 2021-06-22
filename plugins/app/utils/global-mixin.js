import Vue from "vue"



if (!Vue.__global_mixin__) {
  Vue.__global_mixin__ = true

  Vue.mixin({

    computed: {

      $state() { return $state },
      $getters() { return $getters },

    },

  })
}