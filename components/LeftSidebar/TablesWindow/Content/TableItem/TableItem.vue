<template>
  <v-list-item @click.prevent="">



    <v-list-item-icon @mousedown="onNodeCreation">
      <v-icon>mdi-table</v-icon>
    </v-list-item-icon>
        

        
    <TableDialog v-slot="{ on }" title="Edit table"
    :name="table.name" :columns="table.columns"
    @submit="$commit('editTable', {
      tableId: table.id,
      data: $event,
    })">

      <v-list-item-content v-on="on" class="handle">
        <v-list-item-title class="body-2"
        style="word-break: break-all; white-space: normal">
          {{ table.name }}
        </v-list-item-title>
      </v-list-item-content>

    </TableDialog>
        



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

</template>

<script>
export default {

  
  props: {
    table: { type: Object },
  },


  methods: {

    onNodeCreation() {
      $state.nodeCreation.active = true

      $state.nodeCreation.nodeType = 'table'
      $state.nodeCreation.props = { tableName: this.table.name }

      $state.nodeCreation.dragStartPos = $utils.shallowCopy($state.pointer.pagePos)
      $state.nodeCreation.visible = false
    },

  },


}
</script>

<style>

</style>