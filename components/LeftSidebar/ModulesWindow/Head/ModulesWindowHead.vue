<template>
  <v-toolbar dense style="flex: none">



    <v-toolbar-title>

      <v-icon>mdi-cube-outline</v-icon>

      <span style="position: relative; top: 2px">Modules</span>

    </v-toolbar-title>



    <v-spacer></v-spacer>




    <ModuleDialog title="New module" v-slot="{ on: dialog }"
    @submit="$store.commit('createModule', $event.name)">

      <v-tooltip top>

        <template v-slot:activator="{ on: tooltip }">

          <v-btn depressed rounded class="mt-1" width="0" height="32"
          style="position: relative; left: 8px; min-width: 32px"
          v-on="{ ...dialog, ...tooltip }">
            <v-icon dense>mdi-plus-thick</v-icon>
          </v-btn>

        </template>

        <span>New module</span>

      </v-tooltip>

    </ModuleDialog>


    
  </v-toolbar>
</template>

<script>
export default {
}
</script>

<style>

</style>