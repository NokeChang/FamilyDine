<template>
  <div id="dine-all-list">
    <section v-if="loadingMsg">{{ loadingMsg }}</section>
    <section v-else>
      <section v-if="loading">載入中....</section>
      <section v-else>
        <div class="text-right">
          <div>聚會總數: {{ infos.length }}</div>
        </div>
        <div class="row">
          <div class="col-lg-6" v-for="(item,index) in infos" :key="item.id">
            <div class="info-grid" :class="{ 'is-joined': infoExtras[index].isJoined }">
              <div class="info-content">
                <div>名稱: {{ item.name }}</div>
                <div>日期: {{ item.date }}</div>
                <div>地點: {{ item.location }}</div>
                <div>主辦人: {{ item.owner }}</div>
              </div>
              <button
                v-if="username!='Visitor'"
                class="btn"
                :class="{'btn-secondary': infoExtras[index].isJoined, 'btn-primary': !infoExtras[index].isJoined}"
                @click="joinDine(index, item.id)"
              >
                <span v-if="infoExtras[index].isJoined">退出</span>
                <span v-else>參加</span>
              </button>
              <button class="btn btn-info" @click="getDineDetail(index)">詳細</button>
              <transition name="slide">
                <div v-if="infoExtras[index].isDetailed" class="info-content-2">
                  <div>
                    <div class="multiline">{{ item.description }}</div>
                  </div>
                  <hr class="hr">
                  <div>
                    參加名單
                    <span>(共{{ infos[index].participants.length }}人)&nbsp;</span>:
                  </div>
                  <div>
                    <span
                      v-for="participant in item.participants"
                      :key="participant.id"
                    >{{participant.username}}&nbsp;&nbsp;&nbsp;</span>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </section>
    </section>
  </div>
</template>

<script>
import axios from "axios";
import { REST_API_URL } from "@/variables.js";

export default {
  data() {
    return {
      infos: [],
      infoExtras: [],
      loading: false,
      loadingMsg: ""
    };
  },
  computed: {
    username() {
      return this.$store.state.username;
    }
  },
  watch: {
    username: function(newVal, oldVal) {
      // this.updatePage();
      this.checkJoined();
    }
  },
  mounted() {
    this.updatePage();
    // this.checkJoined();
  },
  methods: {
    updatePage() {
      this.loading = true;
      axios
        .get(REST_API_URL + "api/dine/")
        .then(res => {
          // console.log(res);
          this.infos = res.data;
          // UI flags for infos
          for (let i = 0; i < this.infos.length; i++) {
            this.infoExtras.push({ isDetailed: false, isJoined: false });
          }
          this.loading = false;
          //check joined or not
          this.checkJoined();
        })
        .catch(err => {
          // console.log(err);
          this.loadingMsg = "讀取資料發生錯誤";
        });
    },
    getDineDetail(index) {
      if (this.infoExtras[index].isDetailed) {
        this.infoExtras[index].isDetailed = false;
      } else {
        this.infoExtras.forEach(info => {
          info.isDetailed = false;
        });
        this.infoExtras[index].isDetailed = true;
      }
    },
    joinDine(index, targetId) {
      axios
        .patch(
          REST_API_URL + "api/dine/join-dine/" + targetId + "/",
          { isJoined: this.infoExtras[index].isJoined },
          {
            headers: {
              Authorization: "Token " + localStorage.keytoken
            }
          }
        )
        .then(res => {
          // console.log(res);
          if (this.infoExtras[index].isJoined) {
            this.infoExtras[index].isJoined = false;
          } else {
            this.infoExtras[index].isJoined = true;
          }
          this.infos[index].participants = res.data.participants;
        })
        .catch(err => {
          if (err.response.status == 401) {
            alert("尚未登入");
          } else {
            alert("發生不明錯誤");
          }
        });
    },
    checkJoined() {
      // console.log("check join");
      this.infos.forEach((info, index) => {
        info.participants.some(participant => {
          // console.log(participant.username);
          if (localStorage.username == participant.username) {
            this.infoExtras[index].isJoined = true;
            return true;
          } else {
            this.infoExtras[index].isJoined = false;
          }
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
hr.hr {
  grid-column: 1/5;
  background-color: #aaaaaa;
}
.info-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 5px;
  margin: 5px 0px;
  border-radius: 10px;
  background-color: #333333;
  flex: 100%;
  max-width: 100%;
  padding: 20px;
  color: #cccccc;
  box-shadow: 3px 3px;
}
.info-grid.is-joined {
  background-color: #2266aa;
}
.info-content {
  grid-column: 1/4;
  grid-row: 1/2;
}
.info-content-2 {
  grid-column: 1/5;
  grid-row: 3/4;
}
.btn-info {
  grid-column: 1/5;
  grid-row: 2/3;
}

// animation
.slide-enter-active {
  transition: all 0.2s ease;
}
.slide-leave-active {
  transition: all 0.2s ease;
}
.slide-enter-to,
.slide-leave {
  height: 100%;
  overflow: hidden;
}
.slide-enter,
.slide-leave-to {
  height: 0px;
  overflow: hidden;
}
</style>

