<template>
  <TableDialog v-slot="{ on }" title="Edit table"
  :name="table.name" :columns="table.columns"
  @submit="Object.assign(table, $event)">

    <v-list-item v-on="on">



      <v-list-item-icon>
        <v-icon>mdi-table</v-icon>
      </v-list-item-icon>
          
      <v-list-item-content>
        <v-list-item-title class="body-2"
        style="word-break: break-all; white-space: normal">
          {{ table.name }}
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

          <DeleteTable :table="table"/>
          
        </v-list>

      </v-menu>




    </v-list-item>

  </TableDialog>

</template>

<script>
export default {

  
  props: {
    table: { type: Object },
  },


}
</script>

<style>

</style>