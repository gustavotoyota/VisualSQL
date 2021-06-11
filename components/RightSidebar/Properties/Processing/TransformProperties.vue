<template>
  <div v-if="node.type === 'transform'">

    
    <div class="mx-5 mt-5">
      <v-switch hide-details label="Group rows"
      v-model="node.props.group.active">
      </v-switch>
    </div>


    <v-expand-transition>
      <div v-if="node.props.group.active">


        <PropCodeEditor

        class="mx-5 mt-5"

        label="Group columns (GROUP BY)"
        v-model="node.props.group.columns"/>
        



        <PropCodeEditor

        class="mx-5 mt-5"

        label="Filter condition (HAVING)"
        v-model="node.props.group.condition"/>



      </div>
    </v-expand-transition>




    <v-divider class="mt-6"/>




    <PropCodeEditor

    class="mx-5 mt-5"

    label="Output columns (SELECT)"
    v-model="node.props.columns"/>



  </div>
</template>

<script>
export default {

  props: {
    node: Object,
  },

}
</script>

<style>

</style>