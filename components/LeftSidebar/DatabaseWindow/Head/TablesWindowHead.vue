<template>
  <v-toolbar dense style="flex: none">



    <v-toolbar-title>
      <v-icon>mdi-table</v-icon>
      <span style="position: relative; top: 1px">Tables</span>
    </v-toolbar-title>



    <v-spacer></v-spacer>



    <TableDialog v-slot="{ on: dialog }" title="New table"
    :columns="'column_1 INT NOT NULL,\ncolumn_2 VARCHAR(40) UNIQUE,\n' +
      'column_3 DATE NOT NULL,\ncolumn_4,\ncolumn_5,\ncolumn_6'"
    @submit="$store.commit('createTable', $event)">

      <v-tooltip top>

        <template v-slot:activator="{ on: tooltip }">

          <v-btn depressed rounded class="ml-2 mt-1" width="32" height="32"
          style="position: relative; left: 8px; min-width: 32px"
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