<template>
  <v-list-item @click="$emit('click')">



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

        <v-btn icon class="ml-1" width="0" height="28"
        style="position: relative; left: 6px; min-width: 28px"
        v-bind="attrs" v-on="on">
          <v-icon dense>mdi-dots-horizontal</v-icon>
        </v-btn>

      </template>
      
      <v-list dense width="150">

        <EditTable :table="table">
        </EditTable>

        <DeleteTable :table="table">
        </DeleteTable>
        
      </v-list>

    </v-menu>

  </v-list-item>
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