<template>
  <div class="h-screen   flex"
    @mousemove="onViewportMouseMove">



    <div class="w-72    p-2    bg-gray-400">
    </div>



    <div
      class="flex-auto     flex flex-col">



      <div class="bg-gray-300    p-1">
        <button
          class="rounded border border-gray-600     p-1"
          @click="onNewFilterClick">
          <img src="/static/Filter.png" class="w-5 h-5"/>
        </button>

        <button
          class="rounded border border-gray-600     p-1"
          @click="onNewSortClick">
          <img src="/static/Sort.png" class="w-5 h-5"/>
        </button>

        <button
          class="rounded border border-gray-600     p-1"
          @click="onNewGroupClick">
          <img src="/static/Group.png" class="w-5 h-5"/>
        </button>

        <button
          class="rounded border border-gray-600     p-1"
          @click="onNewJoinClick">
          <img src="/static/Join.png" class="w-5 h-5"/>
        </button>

        <button
          class="rounded border border-gray-600     p-1"
          @click="onNewLimitClick">
          <img src="/static/Limit.png" class="w-5 h-5"/>
        </button>



      </div>




      <!-- Viewport -->

      <svg
        id="viewport"

        class="select-none    h-full"

        @mousedown="onViewportMouseDown"
        @mouseup="onViewportMouseUp"

        @wheel="onViewportMouseWheel">



        <!-- Centralizer -->

        <svg
          x="50%" y="50%"

          style="overflow: visible">



          <!-- Viewbox -->

          <g :style="'transform: scale(' + zoom + ') translate(' + -position.x + 'px, ' + -position.y + 'px)'">





            <g>

              <!-- Links -->

              <g v-for="(link, linkKey) in links" :key="linkKey">
                <line
                  :x1="link.from == null ? 0 : nodes[link.from].position.x + socketOffsetX"
                  :y1="link.from == null ? 0 : nodes[link.from].position.y"
                  
                  :x2="link.to == null ? 0 : nodes[link.to].position.x - socketOffsetX"
                  :y2="link.to == null ? 0 : nodes[link.to].position.y + (link.side == null ? 0 : link.side == 'left' ? -socketOffsetY : socketOffsetY)"
        
                  style="stroke:black;stroke-width:2"/>
                
                <line
                  :x1="link.from == null ? 0 : nodes[link.from].position.x + socketOffsetX"
                  :y1="link.from == null ? 0 : nodes[link.from].position.y"
                  
                  :x2="link.to == null ? 0 : nodes[link.to].position.x - socketOffsetX"
                  :y2="link.to == null ? 0 : nodes[link.to].position.y + (link.side == null ? 0 : link.side == 'left' ? -socketOffsetY : socketOffsetY)"
        
                  style="stroke:black;stroke-width:6"
                  opacity="0"
                  
                  @mousedown="onLinkMouseDown(link)"/>
              </g>

            </g>







            <!-- Nodes -->

            <g
              v-for="(node, node_key) in nodes" :key="node_key"
              :style="'transform: translate(' + node.position.x + 'px, ' + node.position.y + 'px)'">






              <!-- Boundary -->

              <rect
                x="-24" y="-24"
                width="48" height="48"
                rx="5" ry="5"

                :stroke="selectedNodes.includes(node) ? 'blue' : 'black'"
                :stroke-width="node.selected ? '2' : '1'"

                fill="#f0f0f0"/>






              <!-- Icon -->

              <image
                v-if="node.type === 'Table'"
                x="-18" y="-18"
                href="/static/Table.png"/>

              <image
                v-if="node.type === 'Filter'"
                x="-16" y="-16"
                href="/static/Filter.png"/>

              <image
                v-if="node.type === 'Sort'"
                x="-16" y="-16"
                href="/static/Sort.png"/>

              <image
                v-if="node.type === 'Group'"
                x="-24" y="-24"
                href="/static/Group.png"/>

              <image
                v-if="node.type === 'Join'"
                x="-24" y="-24"
                href="/static/Join.png"/>

              <image
                v-if="node.type === 'Limit'"
                x="-24" y="-24"
                href="/static/Limit.png"/>

              <image
                v-if="node.type === 'Output'"
                x="-18" y="-18"
                href="/static/Output.png"/>






              <!-- Description -->

              <text
                y="-32"

                text-anchor="middle"
                font-weight="bold">
                {{ node.type }}
              </text>

              <text
                y="32"

                text-anchor="middle"

                dominant-baseline="hanging">
                {{ node.description }}
              </text>







              <!-- Event catcher -->

              <rect
                x="-24" y="-24"
                width="48" height="48"

                opacity="0"
                class="cursor-move"
                
                @mousedown="onNodeMouseDown(node)"/>









                
              <!-- Output socket -->

              <circle
                v-if="!['Output'].includes(node.type)"
                
                :cx="socketOffsetX"
                r="5"

                stroke="black"
                fill="white"
                
                @mousedown="onOutputSocketMouseDown(node)"
                @mouseup="onOutputSocketMouseUp(node)"/>






              <!-- Input socket -->

              <circle
                v-if="!['Table', 'Join'].includes(node.type)"

                :cx="-socketOffsetX"
                r="5"

                stroke="black"
                fill="white"
                
                @mousedown="onInputSocketMouseDown(node)"
                @mouseup="onInputSocketMouseUp(node)"/>





              <!-- Union sockets -->

              <circle
                v-if="['Join'].includes(node.type)"

                :cx="-socketOffsetX"
                :cy="-socketOffsetY"
                r="5"

                stroke="black"
                fill="white"
                
                @mousedown="onLeftSocketMouseDown(node)"
                @mouseup="onLeftSocketMouseUp(node)"/>

              <circle
                v-if="['Join'].includes(node.type)"

                :cx="-socketOffsetX"
                :cy="socketOffsetY"
                r="5"

                stroke="black"
                fill="white"
                
                @mousedown="onRightSocketMouseDown(node)"
                @mouseup="onRightSocketMouseUp(node)"/>






            </g>




          </g>



        </svg>
        



      </svg>



    </div>



    
    <div class="w-72    p-4    bg-gray-400">
      <div v-if="activeNode == null">
        Select a node
      </div>

      <div v-if="activeNode != null">
        <b>Node</b>

        <div class="mt-1">
          <div>Description:</div>

          <input
            type="text"
            v-model="activeNode.description"/>
        </div>

        <div
          v-if="activeNode.type === 'Table'"
          class="mt-5">
          <b>Table stuff</b>
        </div>

        <div
          v-if="activeNode.type === 'Filter'"
          class="mt-5">
          <b>Filter stuff</b>
          
          <div class="mt-1">
            <div>Condition:</div>

            <textarea
              class="w-full"
              v-model="activeNode.condition">
            </textarea>
          </div>
        </div>

        <div
          v-if="activeNode.type === 'Sort'"
          class="mt-5">
          <b>Sort stuff</b>
          
          <div class="mt-1">
            <div>Columns:</div>
            <textarea
              class="w-full"
              v-model="activeNode.columns">
            </textarea>
          </div>
        </div>

        <div
          v-if="activeNode.type === 'Group'"
          class="mt-5">
          <b>Group stuff</b>
          
          <div class="mt-1">
            <div>Group columns:</div>
            <textarea
              class="w-full"
              v-model="activeNode.groupColumns">
            </textarea>
          </div>
          
          <div class="mt-1">
            <div>Output columns:</div>
            <textarea
              class="w-full"
              v-model="activeNode.outputColumns">
            </textarea>
          </div>
        </div>

        <div
          v-if="activeNode.type === 'Join'"
          class="mt-5">
          <b>Join stuff</b>
          
          <div class="mt-2">
            <div>Type:</div>
            <label class="block" for="innerJoin">
              <input v-model="activeNode.joinType" type="radio" id="innerJoin" value="Inner join" checked/>
               Inner join
            </label>
            <label class="block" for="leftJoin">
              <input v-model="activeNode.joinType" type="radio" id="leftJoin" value="Left join"/>
              Left join
            </label>
            <label class="block" for="rightJoin">
              <input v-model="activeNode.joinType" type="radio" id="rightJoin" value="Right join"/>
              Right join
            </label>
            <label class="block" for="outerJoin">
              <input v-model="activeNode.joinType" type="radio" id="outerJoin" value="Outer join"/>
              Outer join
            </label>
            <label class="block" for="cartesianJoin">
              <input v-model="activeNode.joinType" type="radio" id="cartesianJoin" value="Cartesian join"/>
              Cartesian join
            </label>

            <div class="mt-2">
              <div>Condition:</div>
              <textarea
                class="w-full"
                v-model="activeNode.condition">
              </textarea>
            </div>
          </div>
        </div>

        <div
          v-if="activeNode.type === 'Limit'"
          class="mt-5">
          <b>Limit stuff</b>
          
          <div class="mt-1">
            <div>Amount:</div>

            <input
              type="text"
              v-model="activeNode.amount"/>
          </div>
        </div>


      </div>

    </div>



  </div>
</template>



<script>






function include(array, item) {
  if (array.includes(item))
    return

  array.push(item)
}

function remove(array, item) {
  while (true) {
    let itemIdx = array.indexOf(item)

    if (itemIdx < 0)
      break

    array.splice(itemIdx, 1)
  }
}



function updateLinks(data) {
  for (let link of data.links) {
    include(data.nodes[link.from].outgoingLinks, link)

    if (link.side == null)
      data.nodes[link.to].incomingLink = link
    else
      data.nodes[link.to].incomingLinks[link.side] = link
  }
}






export default {

  data() {
    let data = {

      head: {
        title: 'Visual SQL Tool',
      },

      dataSources: {

        sistema_multas: {

          Tables: {
            contratos: {},
            registros_massiva: {},
            registros_atividade: {},
          },

          queries: {
            query1: {},
            query2: {},
          },

        },

        website: {

          Tables: {
            usuarios: {},
            permissoes: {},
          },

          queries: {
            query1: {},
            query2: {},
          },

        },

      },







      // Socket offsets

      socketOffsetX: 24,
      socketOffsetY: 12,
      





      // Camera

      zoom: 1,

      panning: false,
      panPoint: {
        x: 0,
        y: 0,
      },
      position: {
        x: 0,
        y: 0,
      },






      // Nodes

      nodes: {

        1: {
          id: 1,

          type: 'Table',

          description: '',

          position: {
            x: -200,
            y: -50,
          },

          incomingLink: null,
          outgoingLinks: [],
        },

        2: {
          id: 2,

          type: 'Filter',

          description: '',

          position: {
            x: -100,
            y: -50,
          },

          condition: '',

          incomingLink: null,
          outgoingLinks: [],
        },

        3: {
          id: 3,

          type: 'Table',

          description: '',

          position: {
            x: -200,
            y: 50,
          },

          incomingLink: null,
          outgoingLinks: [],
        },

        4: {
          id: 4,

          type: 'Group',

          description: '',

          position: {
            x: -100,
            y: 50,
          },

          incomingLink: null,
          outgoingLinks: [],
        },

        5: {
          id: 5,

          type: 'Join',

          description: '',

          position: {
            x: 0,
            y: 0,
          },

          incomingLinks: {
            left: null,
            right: null,
          },
          outgoingLinks: [],

          condition: '',

          joinType: 'Inner join',
        },

        6: {
          id: 6,

          type: 'Sort',

          description: '',

          position: {
            x: 100,
            y: 0,
          },

          columns: '',

          incomingLink: null,
          outgoingLinks: [],
        },

        7: {
          id: 7,

          type: 'Limit',

          description: '',

          position: {
            x: 200,
            y: 0,
          },

          columns: '',

          incomingLink: null,
          outgoingLinks: [],
        },

        8: {
          id: 8,

          type: 'Output',

          description: '',

          position: {
            x: 300,
            y: 0,
          },

          incomingLink: null,
          outgoingLinks: [],
        },

      },

      nextNodeId: 9,


      


      // Selecting

      activeNode: null,

      selectedNodes: [],

      selectionStart: {
        x: 0,
        y: 0,
      },




      // Moving

      moving: false,

      movePoint: {
        x: 0,
        y: 0,
      },




      links: [
        { from: 1, to: 2 },
        { from: 2, to: 5, side: 'left' },

        { from: 3, to: 4 },
        { from: 4, to: 5, side: 'right' },

        { from: 5, to: 6 },
        { from: 6, to: 7 },
        { from: 7, to: 8 },
      ],

      newLink: null,

    }

    updateLinks(data)

    return data
  },




  methods: {
    onViewportMouseDown(event) {
      if (!event.ctrlKey) {
        this.activeNode = null

        this.selectedNodes = []
      }

      this.panPoint.x = event.clientX
      this.panPoint.y = event.clientY

      this.panning = true
    },
    onViewportMouseMove(event) {
      if (this.panning && (event.buttons & 4) === 4) {
        this.position.x -= (event.clientX - this.panPoint.x) / this.zoom
        this.position.y -= (event.clientY - this.panPoint.y) / this.zoom
        
        this.panPoint.x = event.clientX
        this.panPoint.y = event.clientY
      }

      if (this.moving && (event.buttons & 1) === 1) {
        for (let node of this.selectedNodes) {
          node.position.x += (event.clientX - this.movePoint.x) / this.zoom
          node.position.y += (event.clientY - this.movePoint.y) / this.zoom
        }
        
        this.movePoint.x = event.clientX
        this.movePoint.y = event.clientY
      }
    },
    onViewportMouseUp(event) {
      this.panning = false

      this.moving = false

      if (this.newLink != null)
        remove(this.links, this.newLink)
    },
    onViewportMouseWheel(event) {
      if (event.deltaY > 0)
        this.zoom *= 1.2
      else
        this.zoom /= 1.2
    },




    onNodeMouseDown(node) {
      if (event.button === 0)
        event.stopPropagation()

      if (!event.ctrlKey && !this.selectedNodes.includes(node))
        this.selectedNodes = []

      if (event.ctrlKey && this.selectedNodes.includes(node)) {
        remove(this.selectedNodes, node)

        this.activeNode = null
      } else {
        include(this.selectedNodes, node)

        this.activeNode = node
      }

      this.movePoint.x = event.clientX
      this.movePoint.y = event.clientY

      this.moving = true
    },




    onLinkMouseDown(link) {
      remove(this.links, link)
    },

    



    onOutputSocketMouseDown(node) {
      this.newLink = { from: node.id, to: null }

      include(this.links, this.newLink)
    },

    onInputSocketMouseDown(node) {
      this.newLink = { from: null, to: node.id }

      include(this.links, this.newLink)
    },
    onLeftSocketMouseDown(node) {
      this.newLink = { from: null, to: node.id, side: 'left' }

      include(this.links, this.newLink)
    },
    onRightSocketMouseDown(node) {
      this.newLink = { from: null, to: node.id, side: 'right' }

      include(this.links, this.newLink)
    },





    onOutputSocketMouseUp(node) {
      if (this.newLink == null)
        return

      if (this.newLink.to == null)
        return

      this.newLink.from = node.id
      


      // Source
      
      include(node.outgoingLinks, this.newLink)



      // Destination

      if (this.newLink.side == null) {
        if (this.nodes[this.newLink.to].incomingLink != null)
          remove(this.links, this.nodes[this.newLink.to].incomingLink)

        this.nodes[this.newLink.to].incomingLink = this.newLink
      } else {
        if (this.nodes[this.newLink.to].incomingLinks[this.newLink.side] != null)
          remove(this.links, this.nodes[this.newLink.to].incomingLinks[this.newLink.side])

        this.nodes[this.newLink.to].incomingLinks[this.newLink.side] = this.newLink
      }



      this.newLink = null

      event.stopPropagation()
    },

    onInputSocketMouseUp(node) {
      if (this.newLink == null)
        return

      if (this.newLink.from == null)
        return

      this.newLink.to = node.id
        


      // Source

      include(this.nodes[this.newLink.from].outgoingLinks, this.newLink)
        

        
      // Destination

      if (node.incomingLink != null)
        remove(this.links, node.incomingLink)

      node.incomingLink = this.newLink



      this.newLink = null

      event.stopPropagation()
    },
    onLeftSocketMouseUp(node) {
      if (this.newLink == null)
        return

      if (this.newLink.from == null)
        return

      this.newLink.to = node.id
      this.newLink.side = 'left'
      


      // Source

      include(this.nodes[this.newLink.from].outgoingLinks, this.newLink)



      // Destination

      if (node.incomingLinks[this.newLink.side] != null)
        remove(this.links, node.incomingLinks[this.newLink.side])

      node.incomingLinks[this.newLink.side] = this.newLink



      this.newLink = null

      event.stopPropagation()
    },
    onRightSocketMouseUp(node) {
      if (this.newLink == null)
        return

      if (this.newLink.from == null)
        return

      this.newLink.to = node.id
      this.newLink.side = 'right'
      


      // Source
      
      include(this.nodes[this.newLink.from].outgoingLinks, this.newLink)



      // Destination

      if (node.incomingLinks[this.newLink.side] != null)
        remove(this.links, node.incomingLinks[this.newLink.side])

      node.incomingLinks[this.newLink.side] = this.newLink



      this.newLink = null

      event.stopPropagation()
    },







    createNode(type, description) {
      let node = {
        id: this.nextNodeId++,

        type: type,

        description: description,

        position: JSON.parse(JSON.stringify(this.position)),
      }

      this.activeNode = node
      this.selectedNodes = [node]
      
      this.nodes[node.id] = node

      return node
    },

    onNewFilterClick() {
      let node = this.createNode('Filter')

      node.incomingLink = null
      node.outgoingLinks = []
    },
    onNewSortClick() {
      let node = this.createNode('Sort')

      node.incomingLink = null
      node.outgoingLinks = []
    },
    onNewGroupClick() {
      let node = this.createNode('Group')

      node.incomingLink = null
      node.outgoingLinks = []
    },
    onNewJoinClick() {
      let node = this.createNode('Join')

      node.incomingLinks = {
        left: null,
        right: null,
      },
      node.outgoingLinks = []

      node.joinType = "Inner join"
    },
    onNewLimitClick() {
      let node = this.createNode('Limit')

      node.incomingLink = null
      node.outgoingLinks = []
    },


  },
  
}
</script>