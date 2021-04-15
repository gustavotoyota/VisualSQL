<template>
  <div style="position: absolute; left: 16px; top: 16px;
  width: 0; height: 0; white-space: nowrap">

    <div>
      <NodeButton type="table"></NodeButton>
      <NodeButton type="union-all"></NodeButton>
    </div>
    
    <div style="margin-top: 1px">
      <NodeButton type="module"></NodeButton>
      <NodeButton type="union"></NodeButton>
    </div>

    <div style="margin-top: 1px">
      <NodeButton type="node"></NodeButton>
      <NodeButton type="except"></NodeButton>
    </div>

    <div style="margin-top: 1px">
      <NodeButton type="sql"></NodeButton>
      <NodeButton type="intersect"></NodeButton>
    </div>

    <div style="margin-top: 12px">
      <NodeButton type="inner-join"></NodeButton>
      <NodeButton type="filter"></NodeButton>
    </div>

    <div style="margin-top: 1px">
      <NodeButton type="left-join"></NodeButton>
      <NodeButton type="transform"></NodeButton>
    </div>

    <div style="margin-top: 1px">
      <NodeButton type="right-join"></NodeButton>
      <NodeButton type="distinct"></NodeButton>
    </div>

    <div style="margin-top: 1px">
      <NodeButton type="full-join"></NodeButton>
      <NodeButton type="sort"></NodeButton>
    </div>

    <div style="margin-top: 1px">
      <NodeButton type="cross-join"></NodeButton>
      <NodeButton type="reduce"></NodeButton>
    </div>

    <div style="margin-top: 12px">
      <NodeButton type="pivot"></NodeButton>
      <NodeButton type="output"></NodeButton>
    </div>

  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>