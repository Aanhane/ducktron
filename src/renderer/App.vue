<template>
  <div id="app">
    <ducktron-header></ducktron-header>
    <router-view></router-view>
    <status-bar></status-bar>
  </div>
</template>

<script>
import StatusBar from '@/components/StatusBar';
import DucktronHeader from '@/components/DucktronHeader';
export default {
  components: {
    StatusBar,
    DucktronHeader
  },
};
</script>
<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* raleway-regular - latin */
@font-face {
  font-family: "Raleway";
  font-style: normal;
  font-weight: 400;
  src: local("Raleway"), local("Raleway-Regular"),
    url("./assets/raleway-v12-latin-regular.woff2") format("woff2"),
    /* Chrome 26+, Opera 23+, Firefox 39+ */
      url("./assets/raleway-v12-latin-regular.woff") format("woff"); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
}
/* raleway-600 - latin */
@font-face {
  font-family: "Raleway";
  font-style: normal;
  font-weight: 600;
  src: local("Raleway SemiBold"), local("Raleway-SemiBold"),
    url("./assets/raleway-v12-latin-600.woff2") format("woff2"),
    /* Chrome 26+, Opera 23+, Firefox 39+ */
      url("./assets/raleway-v12-latin-600.woff") format("woff"); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
}

html,
body {
  height: 100%;
  background-color: #262523;
  color: #b6b2b1;
  font-family: "Helvetica Neue", Helvetica;
}

.el-button--text {
  font-family: "Helvetica Neue", Helvetica !important;
  font-size: 1rem !important;
}

.el-input__inner {
  background-color: #3c3c3c !important;
  border-color: #575757 !important;
  color: #b6b2b1 !important;
}

.el-input__inner:hover {
  border-color: #858585 !important;
}
.el-input__inner:focus {
  border-color: #409eff !important;
}

.el-input-group__append,
.el-input-group__prepend {
  background-color: #535353 !important;
  color: #909399 !important;
  border-color: #575757 !important;
}
.el-button--mini {
  border-color: #535353 !important;
}
.el-button.is-disabled,
.el-button.is-disabled:focus,
.el-button.is-disabled:hover {
  border-color: #909399 !important;
}

::-webkit-input-placeholder {
  opacity: 1;
  color: #747474 !important;
}

.el-checkbox {
  transform: scale(1.7);
  margin-left: 4px;
}
.el-select-dropdown,
.el-checkbox__inner {
  background-color: #3c3c3c !important;
  border-color: #575757 !important;
}

.el-checkbox__inner:hover {
  border-color: #858585 !important;
}
.el-popper[x-placement^="bottom"] .popper__arrow {
  border-bottom-color: #575757 !important;
}
.el-popper[x-placement^="bottom"] .popper__arrow::after {
  border-bottom-color: #3c3c3c !important;
}
.el-popper[x-placement^="top"] .popper__arrow::after {
  border-top-color: #3c3c3c !important;
}
.el-popper[x-placement^="top"] .popper__arrow {
  border-top-color: #575757 !important;
}
.el-select-dropdown__item {
  color: #b6b2b1 !important;
}
.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
  background-color: #5a5a5a !important;
  color: #f0f0f0 !important;
}
.el-select-dropdown__item.selected {
  color: #0a85fc !important;
}
</style>

