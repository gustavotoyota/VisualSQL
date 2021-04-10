


<template>
  <div id="app">
    <v-card>
      <v-toolbar color="cyan" dark flat>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>

        <v-toolbar-title>Your Dashboard</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>

        <v-btn icon>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>

        <template v-slot:extension>
          <v-tabs
            show-arrows
            :key="renderComponent"
            v-model="selectedIndex"
            align-with-title
          >
            <v-tabs-slider color="yellow"></v-tabs-slider>
            <draggable
              v-model="tabs"
              tag="ul"
              ghost-class="ghost"
              @start="handleStart"
              @end="handleEnd"
              v-bind="dragOptions"
            >
              <v-tab v-for="tab in tabs" :key="tab.id">
                {{ tab.name }}
              </v-tab>
              <!-- <transition-group
                tag="ul"
                type="transition"
                :name="!drag ? 'flip-list' : null"
              >
               
              </transition-group> -->
            </draggable>
          </v-tabs>
        </template>
      </v-toolbar>

      <v-tabs-items :key="renderComponent" v-model="selectedIndex">
        <v-tab-item v-for="tab in tabs" :key="tab.id">
          <v-card flat>
            <v-card-text v-text="tab.name + text"></v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>

    <div class="tabs">
      <draggable
        v-model="tabs"
        ghost-class="ghost"
        @start="handleStart"
        @end="handleEnd"
        v-bind="dragOptions"
      >
        <transition-group
          tag="ul"
          type="transition"
          :name="!drag ? 'flip-list' : null"
        >
          <li
            v-for="tab in tabs"
            :key="tab.id"
            class="tab"
            :class="{ selected: selectedId == tab.id }"
          >
            <a href="#" @click.stop="selectedId = tab.id">
              {{ tab.name }}
            </a>
          </li>
        </transition-group>
      </draggable>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
console.clear();
export default {
  name: "App",
  components: {
    draggable,
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
      };
    },
    selectedIndex: {
      get: function () {
        const newid = this.tabs.indexOf(
          this.tabs.find((tab) => tab.id === this.selectedId)
        );
        console.log(newid);
        return newid;
      },
      set: function (newValue) {
        console.log(newValue);
        this.selectedId = this.tabs[newValue].id;
      },
    },
  },
  methods: {
    handleEnd(evt) {
      this.drag = false;
      console.log(this.tabs);
      this.forceRerender();
    },
    handleStart(evt) {
      this.drag = true;
    },
    forceRerender() {
      // Remove my-component from the DOM
      this.renderComponent += 1;
    },
  },
  data() {
    return {
      renderComponent: 0,
      drag: false,
      tab: null,
      items: ["web", "shopping", "videos", "images", "news"],
      text:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      selectedId: 2,
      previousId: 2,
      tabs: [
        { id: 50, name: "tab 50" },
        { id: 12, name: "tab 12" },
        { id: 2, name: "tab 2" },
        { id: 13, name: "tab 13" },
        { id: 4, name: "tab 4" },
        { id: 25, name: "tab 25" },
        { id: 6, name: "tab 6" },
        { id: 7, name: "tab 7" },
        { id: 8, name: "tab 8" },
        { id: 9, name: "tab 9" },
        { id: 10, name: "tab 10" },
      ],
    };
  },
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.v-tabs-bar__content ul {
  display: flex;
  flex-direction: row;
}
.tabs {
  ul {
    display: flex;
    flex-direction: row;
    flex-wrap: no-wrap;
    color: #fff;
    background: #333;
    list-style: none;
    margin: 0;
    padding: 5px 5px 0 5px;
    overflow-y: scroll;
    .tab {
      margin-right: 5px;

      background: #222;
      &.selected {
        background: deeppink;
      }
      a {
        min-width: 150px;

        padding: 10px;
        display: block;
        text-decoration: none;
        color: #fff;
      }
    }
    border-bottom: 4px solid deeppink;
  }
}

.flip-list-move {
  transition: transform 2.5s;
}
.no-move {
  transition: transform 0s;
}
</style>
