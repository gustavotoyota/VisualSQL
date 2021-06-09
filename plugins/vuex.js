import Vuex from 'vuex'
import { mapFields } from 'vuex-map-fields'



global._vuex = {

  mapStates: Vuex.mapState,
  mapMutations: Vuex.mapMutations,
  mapGetters: Vuex.mapGetters,
  mapActions: Vuex.mapActions,
  mapFields: mapFields,

  mapState: (name) => Object.values(Vuex.mapState([name]))[0],
  mapMutation: (name) => Object.values(Vuex.mapMutations([name]))[0],
  mapGetter: (name) => Object.values(Vuex.mapGetters([name]))[0],
  mapAction: (name) => Object.values(Vuex.mapActions([name]))[0],
  mapField: (path) => Object.values(mapFields([path]))[0],
  
}