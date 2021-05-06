<template>
  <div v-if="node.type === 'transform'">

    
    <div class="mx-5 mt-5">
      <v-switch hide-details label="Group rows"
      v-model="node.props.group.active">
      </v-switch>
    </div>


    <v-expand-transition>
      <div v-if="node.props.group.active">
        <div class="mx-5 mt-5">
          <div class="body-2 grey--text text--lighten-1">
            Columns to group by:
          </div>

          <CodeEditor class="mt-1" style="height: 100px"
          v-model="node.props.group.columns"/>
        </div>
        


        <div class="mx-5 mt-5" v-if="node.props.group.active">
          <div class="body-2 grey--text text--lighten-1">
            Filter condition for grouped rows:
          </div>

          <CodeEditor class="mt-1" style="height: 100px"
          v-model="node.props.group.condition"/>
        </div>
      </div>
    </v-expand-transition>




    <v-divider class="mt-6"></v-divider>




    <div class="mx-5 my-5">
      <div class="body-2 grey--text text--lighten-1">
        Output columns:
      </div>

      <CodeEditor class="mt-1" style="height: 100px"
      v-model="node.props.columns"/>
    </div>



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