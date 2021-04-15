<template>
  <v-list-item @click="() => {}">



    <v-list-item-icon>
      <v-icon>mdi-table</v-icon>
    </v-list-item-icon>
        
    <v-list-item-content>
      <v-list-item-title class="body-2"
      style="word-break: break-all; white-space: normal">
        {{ table.name }}
      </v-list-item-title>
    </v-list-item-content>
        


    <DeleteTable :table="table">
    </DeleteTable>



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