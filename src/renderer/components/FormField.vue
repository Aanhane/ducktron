<template>
  <el-row :gutter="20">
    <el-col :span="6">
      <span class="input-label">{{ label }}</span>
      <span
        v-if="description"
        class="description"
      >{{ description }}</span>
    </el-col>
    <el-col :span="16">
      <slot></slot>
    </el-col>
    <el-col :span="2">
      <slot name="actions"></slot>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: ['label', 'description']
}
</script>

<style>
.input-label {
  display: inline-block;
  margin-top: 11px;
  font-size: 0.9rem;
  vertical-align: top;
}
.description {
  display: block;
  font-size: 0.7rem;
  margin-top: 5px;
  margin-right: 10px;
}
</style>
