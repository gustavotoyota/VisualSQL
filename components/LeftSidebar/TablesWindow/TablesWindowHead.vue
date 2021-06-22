<template>
  <v-toolbar dense style="flex: none">



    <v-toolbar-title>
      <v-icon>mdi-table</v-icon>
      <span style="position: relative; top: 1px">Tables</span>
    </v-toolbar-title>



    <v-spacer></v-spacer>



    <TableDialog v-slot="{ on: dialog }" title="New table"
    :columns="'column1 INT NOT NULL,\ncolumn2 VARCHAR(40) UNIQUE,\n' +
      'column3,\ncolumn4'"
    @submit="$commit('createTable', $event)">

      <v-tooltip top>

        <template v-slot:activator="{ on: tooltip }">

          <v-btn icon class="ml-2 mt-1"
          style="position: relative; left: -4px;
          min-width: 0; width: 32px; height: 32px"
          v-on="{ ...dialog, ...tooltip }">
            <v-icon dense>mdi-plus-thick</v-icon>
          </v-btn>

        </template>

        <span>New table</span>

      </v-tooltip>

    </TableDialog>



  </v-toolbar>
</template>

<script>
export default {

}
</script>

<style>

</style>