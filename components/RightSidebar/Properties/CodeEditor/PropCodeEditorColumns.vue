<template>
  <v-menu offset-y left max-height="200">

    <template v-slot:activator="{ on: menu }">

      <v-tooltip top>

        <template v-slot:activator="{ on: tooltip }">

          <v-btn v-on="{ ...menu, ...tooltip }"
          style="min-width: 0; min-height: 0; padding: 0"
          :style="small ? 'width: 24px; height: 24px' : 'width: 32px; height: 32px'">
            <v-icon :style="small ? 'font-size: 15px' : ''">mdi-format-list-bulleted</v-icon>
          </v-btn>

        </template>

        <span>Columns</span>

      </v-tooltip>

    </template>
    
    <v-list dense width="175">

      <v-list-item @click.stop="">
        <v-list-item-title>table1.column1</v-list-item-title>
      </v-list-item>

      <v-list-item @click.stop="">
        <v-list-item-title>table1.column2</v-list-item-title>
      </v-list-item>

      <v-list-item @click.stop="">
        <v-list-item-title>table2.column1</v-list-item-title>
      </v-list-item>

      <v-list-item @click.stop="">
        <v-list-item-title>table2.column2</v-list-item-title>
      </v-list-item>

      <v-list-item @click.stop="">
        <v-list-item-title>table3.column1</v-list-item-title>
      </v-list-item>

      <v-list-item @click.stop="">
        <v-list-item-title>table3.column2</v-list-item-title>
      </v-list-item>
      
    </v-list>

  </v-menu>
  
</template>

<script>
export default {

  props: {
    small: { type: Boolean },
  },

}
</script>

<style scoped>
.v-list {
  padding: 4px !important
}

.v-list-item {
  border-radius: 3px;
  overflow: hidden;

  min-height: 20px;

  padding: 0;
}

.v-list-item__title {
  font-family: Consolas;
  font-size: 13px !important;
  font-weight: normal !important;
  
  color: #e0e0e0;
}
</style>