<template>
  <div style="position: absolute; left: 16px; top: 16px;
  width: 0; height: 0; white-space: nowrap">

    <div style="display: flex">
      <NodeButton :tab="tab" :module="module" type="table"/>
      <NodeButton :tab="tab" :module="module" type="union"/>
    </div>
    
    <div style="margin-top: 1px; display: flex">
      <NodeButton :tab="tab" :module="module" type="node"/>
      <NodeButton :tab="tab" :module="module" type="difference"/>
    </div>

    <div style="margin-top: 1px; display: flex">
      <NodeButton :tab="tab" :module="module" type="sql"/>
      <NodeButton :tab="tab" :module="module" type="intersection"/>
    </div>

    <div style="margin-top: 12px; display: flex">
      <NodeButton :tab="tab" :module="module" type="inner-join"/>
      <NodeButton :tab="tab" :module="module" type="filter"/>
    </div>

    <div style="margin-top: 1px; display: flex">
      <NodeButton :tab="tab" :module="module" type="left-join"/>
      <NodeButton :tab="tab" :module="module" type="transform"/>
    </div>

    <div style="margin-top: 1px; display: flex">
      <NodeButton :tab="tab" :module="module" type="right-join"/>
      <NodeButton :tab="tab" :module="module" type="distinct"/>
    </div>

    <div style="margin-top: 1px; display: flex">
      <NodeButton :tab="tab" :module="module" type="full-join"/>
      <NodeButton :tab="tab" :module="module" type="sort"/>
    </div>

    <div style="margin-top: 1px; display: flex">
      <NodeButton :tab="tab" :module="module" type="cross-join"/>
      <NodeButton :tab="tab" :module="module" type="limit"/>
    </div>

  </div>
</template>

<script>
export default {


  props: {

    tab: Object,
    module: Object,

  },


}
</script>

<style>

</style>