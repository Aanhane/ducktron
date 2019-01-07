<template>
  <header>
    <h1>Ducktron</h1>
    <p>A tool for
      <el-button
        type="text"
        @click="open('https://www.duckdns.org')"
      >https://www.duckdns.org</el-button>
    </p>
  </header>
</template>

<script>
export default {
  methods: {
    open (link) {
      this.$electron.shell.openExternal(link);
    }
  }
}
</script>

<style>
header {
  background: #363231;
  border-bottom: 1px solid #3b3b3b;
  padding: 8px 15px 0px 19px;
}
header p {
  margin-left: 2px;
}
header .el-button:hover {
  text-decoration: underline;
}
h1 {
  font-family: "Raleway", "Helvetica Neue", "Helvetica";
}
</style>
