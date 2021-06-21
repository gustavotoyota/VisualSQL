<template>

  <v-dialog max-width="650" v-model="active">

    <template v-slot:activator="{ on: dialog }">

      <ToolbarButton v-on="dialog"
      btn-style="width: auto">
        Help
      </ToolbarButton>

    </template>



      
    <v-card>

      <v-card-title>Help</v-card-title>
      
      <v-divider/>

      <v-card-text style="padding: 0; display: flex; height: 360px">

        <v-list dense style="width: 175px; overflow-y: scroll;
        border-right: 1px solid #383838">

          <v-list-item @click="goTo(card.id)"
          v-for="(card, index) in cards" :key="index"
          :input-value="card.id === activeCardId">
            <v-list-item-content>
              <v-list-item-title>{{ card.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

        </v-list>

        <div id="help-container"
        style="flex: 1; overflow-y: scroll;
        background-color: #101010;
        padding-top: 30px; padding-left: 30px">

          <div style="margin-bottom: 31px"
          v-for="(card, index) in cards" :key="index">

            <div :id="`help-${card.id}`"
            style="position: relative; top: 18px"></div>

            <img :class="card.id" :src="`/help/${card.id}.png`"
            style="outline: 1px solid #505050"
            v-intersect="{ handler: onIntersect, options: { threshold: [1] } }"/>

          </div>

        </div>

      </v-card-text>

      <v-divider/>

      <v-card-actions>

        <v-spacer></v-spacer>

        <v-btn color="primary" text
        @click="active = false">
          Close
        </v-btn>

      </v-card-actions>

    </v-card>

  </v-dialog>

</template>

<script>
export default {


  data() {
    return {
      active: false,

      activeCardId: 'creating-nodes',

      cards: [
        { id: 'creating-nodes', title: 'Creating nodes' },
        { id: 'linking-nodes', title: 'Linking nodes' },
        { id: 'node-types', title: 'Node types' },
        { id: 'generating-sql', title: 'Generating SQL' },
        { id: 'modules', title: 'Modules' },
        { id: 'named-nodes', title: 'Named nodes' },
        { id: 'node-description', title: 'Node description' },
        { id: 'column-tracking', title: 'Column tracking' },
        { id: 'subquery-referencing', title: 'Subquery referencing' },
      ],
    }
  },



  methods: {

    goTo(target) {
      this.$vuetify.goTo(`#help-${target}`, { container: '#help-container' })
    },

    onIntersect(entries) {
      for (const entry of entries) {
        if (!entry.isIntersecting)
          continue

        this.activeCardId = entry.target.className

        console.log(entry)
      }
    },

  },


}
</script>

<style>
</style>