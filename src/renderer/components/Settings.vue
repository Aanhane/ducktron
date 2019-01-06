<template>
    <main>
      <form-field label="Domains">
        <el-input
          placeholder="Enter a domain"
          v-model="newDomain"
          @focus="domainInputHasFocus = true"
          @blur="domainInputHasFocus = false"
        >
          <template slot="prepend">http://</template>
          <template slot="append">.duckdns.org</template>
        </el-input>
        <el-tag
          class="domain-list"
          v-for="d in config.domains"
          :key="d"
          closable
          @close="removeDomain(d)"
        >
          <span
            @click="open(`http://${d}.duckdns.org`)"
            class="tag-link"
          ><strong>{{ d }}</strong>.duckdns.org</span>
        </el-tag>
        <template slot="actions">
          <transition name="pop">
            <el-button
              :type="isNewDomainValid ? 'success' : ''"
              size="mini"
              icon="el-icon-plus"
              class="btn-add-domain"
              circle
              @click="addNewDomain()"
              v-show="canAddDomain"
            ></el-button>
          </transition>
        </template>
      </form-field>
      <form-field label="Token">
        <el-input
          placeholder="Your token"
          v-model="config.token"
        >
        </el-input>
      </form-field>
      <form-field label="Refresh interval">
        <el-select
          v-model="config.refreshInterval"
          placeholder="Select"
        >
          <el-option
            v-for="item in availableIntervals"
            :key="item.value"
            :label="item.text"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </form-field>
      <form-field
        label="Smart update"
        description="Only do an update when the external IP is changed (uses canhazip)."
      >
          <el-checkbox v-model="config.smartUpdate"></el-checkbox>
      </form-field>
      <form-field label="Launch on startup">
          <el-checkbox v-model="config.launchOnStartup"></el-checkbox>
      </form-field>
    </main>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { ipcRenderer } from "electron";
import FormField from './FormField';
import _ from 'lodash';

const SAVE_CONFIG = 'save-config';
const GET_CONFIG = 'get-config';
const DISABLE_AUTOLAUNCH = 'disable-autolaunch';
const ENABLE_AUTOLAUNCH = 'enable-autolaunch';

export default {
  name: "landing-page",
  components: {
    FormField
  },
  data () {
    return {
      domainInputHasFocus: false,
      newDomain: "",
      availableIntervals: [
        { value: 10, text: "10 minutes" },
        { value: 30, text: "30 minutes" },
        { value: 60, text: "1 hour" },
        { value: 120, text: "2 hours" },
        { value: 240, text: "4 hours" },
        { value: 480, text: "8 hours" },
        { value: 960, text: "16 hours" },
        { value: 1440, text: "1 day" }
      ],
      config: {
        domains: [],
        token: '',
        refreshInterval: 60,
        smartUpdate: true,
        launchOnStartup: true
      }
    };
  },
  created () {
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" || event.keyCode === 27) {
        window.close();
      } else if ((event.key === 'Enter' || event.keyCode === 13) && this.domainInputHasFocus && this.canAddDomain) {
        this.addNewDomain();
      }
    });
  },
  mounted () {
    this.loadConfig();
  },
  beforeDestroy () {
    document.removeEventListener("keydown", null);
  },
  watch: {
    config: {
      handler: function () {
        this.saveConfig();
      },
      deep: true
    }
  },
  computed: {
    isNewDomainValid () {
      return (this.newDomain && this.newDomain.length > 0 && this.config.domains.indexOf(this.newDomain) < 0 && this.newDomain.match(/^[a-zA-Z0-9\-]+$/) !== null);
    },
    canAddDomain () {
      return (
        this.isNewDomainValid && this.config.domains.length < 5
      );
    }
  },
  methods: {
    open (link) {
      this.$electron.shell.openExternal(link);
    },
    loadConfig () {
      ipcRenderer.once(GET_CONFIG, (event, data) => {
        this.config = data;
        this.addStartupWatch();
      });
      ipcRenderer.send(GET_CONFIG);
    },
    saveConfig: _.debounce(function () {
      ipcRenderer.once(SAVE_CONFIG, (event, data) => {
      });
      ipcRenderer.send(SAVE_CONFIG, this.config);
    }, 1000),
    addNewDomain () {
      this.config.domains.push(this.newDomain);
      this.newDomain = '';
    },
    removeDomain (domain) {
      this.config.domains.splice(this.config.domains.indexOf(domain), 1);
    },
    addStartupWatch () {
      this.$watch(
        'config.launchOnStartup',
        (newVal, oldVal) => {
          if (newVal) {
            ipcRenderer.send(ENABLE_AUTOLAUNCH);
          }
          else {
            ipcRenderer.send(DISABLE_AUTOLAUNCH);
          }
        }
      )
    }
  }
};
</script>

<style>

main {
  margin: 20px;
}


h4 {
  margin-bottom: 25px;
}

.el-tag {
  margin-right: 10px;
}
.tag-link:hover {
  cursor: pointer;
  text-decoration: underline;
}
.el-row {
  margin-top: 35px;
}

.btn-add-domain {
  margin-top: 6px !important;
  opacity: 1;
}
.domain-list {
  margin-top: 15px;
}
.el-checkbox {
  margin-top: 11px;
}

.pop-enter-active {
  transition: all 4s ease;
}
.pop-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.pop-enter {
  transform: translateX(15px);
  opacity: 0;
}
.pop-leave-to {
  opacity: 0;
}
</style>
