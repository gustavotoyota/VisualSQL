<template>

  <div class="h-screen   flex">



    <!-- Left sidebar -->

    <div class="w-72    p-2    bg-gray-400">
    </div>

    


    <!-- Center -->

    <div class="flex-auto     flex flex-col">


      

      <!-- Toolbar -->

      <div class="bg-gray-300    p-1">

        <button
          class="rounded border border-gray-600     p-1">
          <img src="/static/Filter.png" class="w-5 h-5"/>
        </button>

        <button
          class="rounded border border-gray-600     p-1">
          <img src="/static/Sort.png" class="w-5 h-5"/>
        </button>

        <button
          class="rounded border border-gray-600     p-1">
          <img src="/static/Group.png" class="w-5 h-5"/>
        </button>

        <button
          class="rounded border border-gray-600     p-1">
          <img src="/static/Join.png" class="w-5 h-5"/>
        </button>

        <button
          class="rounded border border-gray-600     p-1">
          <img src="/static/Limit.png" class="w-5 h-5"/>
        </button>

      </div>




      <!-- Viewport -->

      <svg
        ref="viewport">



        
        <!-- Centralizer -->

        <svg
          x="50%" y="50%"

          style="overflow: visible">




          <!-- Viewbox -->

          <g style="transform: scale(1) translate(0px, 0px)">






          </g>




        </svg>



      </svg>



    </div>




    
    <!-- Right sidebar -->

    <div class="w-72    p-2    bg-gray-400">
    </div>





  </div>


</template>


<script>







export default {
  
  data() {
    return {

    }
  },


  methods: {
    
    screenToWorld(pos) {
      return {
        x: pos.x,
        y: pos.y,
      }
    },
    worldToScreen(pos) {
      return {
        x: pos.x,
        y: pos.y,
      }
    },

  },

}

</script>