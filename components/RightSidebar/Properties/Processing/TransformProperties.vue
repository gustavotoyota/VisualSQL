<template>
  <div v-if="node.type === 'transform'">

    
    <div class="mx-5 mt-5">
      <v-switch hide-details label="Group rows"
      v-model="node.props.group.active">
      </v-switch>
    </div>


    <expand-transition
    @after-enter="rerenderInputs"
    @after-leave="rerenderInputs">

      <div v-if="node.props.group.active">


        <PropCodeEditor

        :key="`group-columns-${rerender}`"

        class="mx-5 mt-5"

        label="Group columns (GROUP BY)"
        v-model="node.props.group.columns"

        :columns="getInputColumns()"/>
        



        <PropCodeEditor

        :key="`filter-condition-${rerender}`"

        class="mx-5 mt-5"

        label="Filter condition (HAVING)"
        v-model="node.props.group.condition"

        :columns="getFilterColumns()"/>



      </div>

    </expand-transition>




    <v-divider class="mt-6"/>




    <PropCodeEditor

    :key="`output-columns-${rerender}`"

    class="mx-5 mt-5"

    label="Output columns (SELECT)"
    v-model="node.props.columns"
    
    :columns="getOutputColumns()"/>



  </div>
</template>

<script>
export default {


  props: {
    node: Object,
  },



  data() {
    return {
      rerender: 0,
    }
  },



  methods: {

    rerenderInputs() {
      this.rerender++
    },




    getInputColumns() {
      return $app.columnTracking.getInputColumns(
        $getters.currentModule, this.node)
    },
    getFilterColumns() {
      return $utils.trimItems(this.node.props.group.columns.split(','))
    },
    getOutputColumns() {
      if (this.node.props.group.active)
        return $utils.arrayUnion(this.getFilterColumns(), this.getInputColumns())
      
      return this.getInputColumns()
    },
    


  },


}
</script>

<style>

</style>