<template>
  <div style="position: absolute; left: 16px; top: 16px;
  width: 0; height: 0; white-space: nowrap">

    <div>
      <NodeButton :tab="tab" type="table"></NodeButton>
      <NodeButton :tab="tab" type="union"></NodeButton>
    </div>
    
    <div style="margin-top: 1px">
      <NodeButton :tab="tab" type="node"></NodeButton>
      <NodeButton :tab="tab" type="difference"></NodeButton>
    </div>

    <div style="margin-top: 1px">
      <NodeButton :tab="tab" type="sql"></NodeButton>
      <NodeButton :tab="tab" type="intersection"></NodeButton>
    </div>

    <div style="margin-top: 12px">
      <NodeButton :tab="tab" type="inner-join"></NodeButton>
      <NodeButton :tab="tab" type="filter"></NodeButton>
    </div>

    <div style="margin-top: 1px">
      <NodeButton :tab="tab" type="left-join"></NodeButton>
      <NodeButton :tab="tab" type="transform"></NodeButton>
    </div>

    <div style="margin-top: 1px">
      <NodeButton :tab="tab" type="right-join"></NodeButton>
      <NodeButton :tab="tab" type="distinct"></NodeButton>
    </div>

    <div style="margin-top: 1px">
      <NodeButton :tab="tab" type="full-join"></NodeButton>
      <NodeButton :tab="tab" type="sort"></NodeButton>
    </div>

    <div style="margin-top: 1px">
      <NodeButton :tab="tab" type="cross-join"></NodeButton>
      <NodeButton :tab="tab" type="limit"></NodeButton>
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