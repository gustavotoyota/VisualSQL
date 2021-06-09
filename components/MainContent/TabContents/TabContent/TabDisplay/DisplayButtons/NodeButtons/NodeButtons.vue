<template>
  <div style="position: absolute; left: 16px; top: 16px;
  width: 0; height: 0; white-space: nowrap">

    <div style="display: flex">
      <NodeButton :tab="tab" type="table"/>
      <NodeButton :tab="tab" type="union"/>
    </div>
    
    <div style="margin-top: 1px; display: flex">
      <NodeButton :tab="tab" type="node"/>
      <NodeButton :tab="tab" type="difference"/>
    </div>

    <div style="margin-top: 1px; display: flex">
      <NodeButton :tab="tab" type="sql"/>
      <NodeButton :tab="tab" type="intersection"/>
    </div>

    <div style="margin-top: 12px; display: flex">
      <NodeButton :tab="tab" type="inner-join"/>
      <NodeButton :tab="tab" type="filter"/>
    </div>

    <div style="margin-top: 1px; display: flex">
      <NodeButton :tab="tab" type="left-join"/>
      <NodeButton :tab="tab" type="transform"/>
    </div>

    <div style="margin-top: 1px; display: flex">
      <NodeButton :tab="tab" type="right-join"/>
      <NodeButton :tab="tab" type="distinct"/>
    </div>

    <div style="margin-top: 1px; display: flex">
      <NodeButton :tab="tab" type="full-join"/>
      <NodeButton :tab="tab" type="sort"/>
    </div>

    <div style="margin-top: 1px; display: flex">
      <NodeButton :tab="tab" type="cross-join"/>
      <NodeButton :tab="tab" type="limit"/>
    </div>

  </div>
</template>

<script>
export default {

  props: {
    tab: Object,
  },

}
</script>

<style>

</style>