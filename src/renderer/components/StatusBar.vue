<template>
  <div
    class="status-bar"
    v-if="lastUpdate"
  >
    Last update <strong>{{ timeSinceLastUpdate }}</strong>
    <span
      class="text-success"
      v-if="lastUpdate.success"
    >(OK)</span>
    <span
      class="text-error"
      v-else
    >(<strong>Error:</strong> {{ lastUpdate.message }})</span>
    <span
      v-if="lastUpdate.currentIpV4"
      class="ip"
    >Detected IP: {{ lastUpdate.currentIpV4 }}</span>
  </div>

</template>

<script>
import { ipcRenderer } from "electron";
import moment from 'moment';

export default {
  name: 'status-bar',
  data () {
    return {
      lastUpdate: null,
      intervalHandle: null,
      timeSinceLastUpdate: ''
    }
  },
  created () {
    ipcRenderer.on('dns-updated', (event, payload) => {
      this.lastUpdate = payload;
    });

    window.setInterval(() => {
      if (this.lastUpdate) {
        this.timeSinceLastUpdate = moment(this.lastUpdate.date).fromNow();
      }
    }, 1000);
  }
}
</script>
<style>
.status-bar {
  font-size: 0.7rem;
  position: absolute;
  bottom: 0;
  width: 100%;
  background: #363231;
  padding: 8px;
  border-top: 1px solid #3b3b3b;
}
.text-error {
  color: #f56c6c;
}
.text-success {
  color: #67c23a;
}
.ip {
  float: right;
}
</style>
