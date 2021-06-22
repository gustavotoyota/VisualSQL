<template>
  <v-dialog max-width="360" v-model="active">


    <template v-slot:activator="{ on }">

      <slot :on="on">
      </slot>

    </template>



    <v-form @submit.prevent="active = false; $emit('submit', fields)">
    
      <v-card>

        <v-card-title>
          {{ title }}
        </v-card-title>

        <v-card-text>

          <v-text-field ref="name"
          label="Table name"
          v-model="fields.name">
          </v-text-field>

          
          <div>
            Columns:
            
            <CodeEditor :key="`columns-${active}`"
            class="mt-1" style="height: 220px"
            v-model="fields.columns"/>
              
            <div class="caption">
              Note: Columns can be either in SQL or comma-separated
            </div>
          </div>

        </v-card-text>

        <v-divider/>

        <v-card-actions>

          <v-spacer></v-spacer>

          <v-btn color="primary" text type="submit">
            Ok
          </v-btn>

          <v-btn color="primary" text @click="active = false">
            Cancel
          </v-btn>

        </v-card-actions>

      </v-card>

    </v-form>



  </v-dialog>
</template>

<script>
export default {


  props: {
    title: String,

    name: String,
    columns: String,
  },



  data() {
    return {
      active: false,

      fields: {
        name: '',
        columns: '',
      },
    }
  },



  watch: {

    active(value) {
      if (!value)
        return

      this.fields.name = this.name ?? ''
      this.fields.columns = this.columns ?? ''

      setTimeout(() => {
        this.$refs.name.focus()
      })
    }

  },


}
</script>

<style>
</style>