<template>

  <v-dialog max-width="651" v-model="$state.help.active">

    <template v-slot:activator="{ on: dialog }">

      <ToolbarButton v-on="dialog"
      btn-style="width: auto"
      @click="onButtonClick">
        Help
      </ToolbarButton>

    </template>



      
    <v-card>

      <v-card-title>{{ $state.help.title }}</v-card-title>
      
      <v-divider/>

      <v-card-text style="padding: 0">

        <div style="padding: 12px 24px">
          Visual SQL is a free online tool for SQL query building.
          Below are the available functionalities:
        </div>

        <v-divider/>

        <div style="display: flex; height: 360px">

          <v-list dense style="width: 174px;
          border-right: 1px solid #383838; padding: 0">

            <v-list-item @click="goTo(card.id)" color="primary"
            style="padding-left: 24px"
            v-for="(card, index) in cards" :key="index"
            :input-value="card.id === activeCardId">
              <v-list-item-content>
                <v-list-item-title>{{ card.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

          </v-list>

          <div id="help-container"
          style="flex: 1; overflow-y: scroll;
          background-color: #101010; padding-top: 30px;
          display: flex; flex-direction: column">

            <div style="width: 460px; min-height: 331px;
            margin: auto; display: flex; justify-content: center"
            v-for="(card, index) in cards" :key="index">

              <div :id="`help-${card.id}`"
              style="position: relative; top: 18px"></div>

              <img :class="card.id" :src="`/help/${card.id}.png`"
              style="display: block; width: 400px; height: 300px; outline: 1px solid #505050"
              v-intersect="{ handler: onIntersect, options: { threshold: 1 } }"/>

            </div>

          </div>

        </div>

      </v-card-text>

      <v-divider/>

      <v-card-actions>

        <v-spacer></v-spacer>

        <v-btn color="primary" text
        @click="$state.help.active = false">
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
      activeCardId: 'creating-nodes',

      cards: [
        { id: 'creating-nodes', title: 'Creating nodes' },
        { id: 'linking-nodes', title: 'Linking nodes' },
        { id: 'node-types', title: 'Node types' },
        { id: 'generating-sql', title: 'Generating SQL' },
        { id: 'modules', title: 'Modules' },
        { id: 'named-nodes', title: 'Named nodes' },
        { id: 'node-description', title: 'Node description' },
        { id: 'column-suggestions', title: 'Column suggestions' },
        { id: 'subquery-referencing', title: 'Subquery referencing' },
      ],
    }
  },



  methods: {

    onButtonClick(event) {
      $state.help.title = 'Help'

      this.activeCardId = 'creating-nodes'
      
      this.goTo('creating-nodes')
    },

    goTo(target) {
      $vuetify.goTo(`#help-${target}`, { container: '#help-container' })
    },

    onIntersect(entries) {
      for (const entry of entries) {
        if (!entry.isIntersecting)
          continue

        this.activeCardId = entry.target.className
      }
    },

  },


}
</script>

<style>
</style>