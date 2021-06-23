<template>
  <v-list-item @click="$commit('createTab', module.id)">


    <v-list-item-icon>
      <v-icon>mdi-cube-outline</v-icon>
    </v-list-item-icon>
        
    <v-list-item-content>
      <v-list-item-title class="body-2"
      style="word-break: break-all; white-space: normal">
        {{ module.name }}
      </v-list-item-title>
    </v-list-item-content>
        
        
    
    <v-menu offset-y>

      <template v-slot:activator="{ on, attrs }">

        <v-btn icon class="ml-1"
        style="position: relative; left: 6px;
        min-width: 0; width: 28px; height: 28px"
        v-bind="attrs" v-on="on">
          <v-icon dense>mdi-dots-horizontal</v-icon>
        </v-btn>

      </template>
      
      <v-list dense width="150">


        <!-- Rename module -->

        <ModuleDialog title="Rename module"
        v-slot="{ on }" :name="module.name"
        @submit="$commit('editModule', {
          moduleId: module.id,
          data: $event,
        })">

          <v-list-item v-on="on">

            <v-list-item-icon style="margin-right: 10px">
                <v-icon>mdi-square-edit-outline</v-icon>
            </v-list-item-icon>

            <v-list-item-title>Rename</v-list-item-title>

          </v-list-item>

        </ModuleDialog>



        <!-- Delete module -->

        <DeleteModule :module="module"/>

        
      </v-list>

    </v-menu>


  </v-list-item>
</template>

<script>
export default {

  props: {
    module: { type: Object },
  },

}
</script>

<style>

</style>