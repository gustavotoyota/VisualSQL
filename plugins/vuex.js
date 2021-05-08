import Vuex from 'vuex'
import { mapFields } from 'vuex-map-fields'



global._vuex = {
  mapFields: mapFields,
  
  mapState: Vuex.mapState,
  mapMutations: Vuex.mapMutations,
  mapGetters: Vuex.mapGetters,
  mapActions: Vuex.mapActions,
}