export default () => ({


  loaded: false,
  



  // Project

  project: null,




  // Save/load

  saving: {
    ignoreChange: true,
    modified: false,

    fileHandle: null,

    timeout: false,
  },
  



  // Sidebars

  sidebars: {
    left: true,
    right: true,
  },



  
  // Tabs

  tabs: {
    rerender: 0,
  },




  // Pointer position

  pointer: {
    pagePos: { x: 0, y: 0 },
  },




  // Panning
  
  panning: {
    active: false,

    currentPos: null,

    startPos: null,
    selectTimeout: null,
  },




  // Pinching

  pinching: {
    pointers: {},
    
    centerPos: null,
    distance: null,
  },




  // Dragging
  
  dragging: {
    active: false,

    currentPos: null,
    
    saveState: false,
  },




  // Linking
  
  linking: {
    active: false,

    newLink: null,
  },




  // Selecting

  selecting: {
    active: false,

    startPos: null,
    endPos: null,
  },


  

  // Node creation

  nodeCreation: {
    active: false,

    nodeType: null,

    dragStart: null,
    visible: false,
  },

  


  // Snackbar

  snackbar: {
    active: false,

    text: '',
    color: '',
    timeout: 0,

    timeoutId: null,
  },



})