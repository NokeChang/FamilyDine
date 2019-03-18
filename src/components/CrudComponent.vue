<template>
  <div id="crud-component">
    <section v-if="crudMsg">{{ crudMsg }}</section>
    <section v-else-if="loginMsg">{{loginMsg}}</section>
    <section v-else>
      <section v-if="loading">載入中....</section>
      <section v-else>
        <div class="row">
          <div class="col-6">
            <button class="btn btn-primary" @click="showModal">建立聚會</button>
          </div>
          <div class="text-right col-6">筆數: {{ infos.length }}</div>
        </div>
        <div class="row">
          <div class="col-lg-6" v-for="(item, index) in infos" :key="item.id">
            <div class="info-grid" :class="{ 'record-editing': infoExtras[index].isEditing }">
              <div class="info-content">
                <!-- <div>No.{{ index+1 }}</div> -->
                <div>名稱: {{ item.name }}</div>
                <div>日期: {{ item.date }}</div>
                <div>地點: {{ item.location }}</div>
                <!-- <div>主辦人: {{ item.owner }}</div> -->
              </div>
              <div class="multiline info-content-2">{{ item.description }}</div>
              <!-- <div v-if="username"> -->
              <button @click="editHandler(index)" class="btn btn-success">修改</button>
              <button @click="deleteHandler(index)" class="btn btn-danger">刪除</button>
              <!-- </div> -->
            </div>
          </div>
        </div>
      </section>
    </section>
    <modal-component v-show="isModalVisible" @close="closeModal">
      <template v-slot:header>
        <div v-if="editIndex!=null">更新聚會</div>
        <div v-else>建立聚會</div>
      </template>
      <template v-slot:body>
        <div class="input-area" v-if="username">
          <div>
            <input class="form-control" type="text" v-model="input.name" placeholder="聚會名稱">
          </div>
          <div>
            <input class="form-control" type="date" v-model="input.date" placeholder="日期">
          </div>
          <div>
            <select class="form-control" v-model="input.location">
              <option disabled value>地點</option>
              <option v-for="item in locationList" :key="item.id" :value="item.name">{{ item.name }}</option>
            </select>
          </div>
          <div>
            <textarea
              class="form-control"
              rows="5"
              cols="40"
              v-model="input.description"
              placeholder="說明"
            ></textarea>
          </div>
          <div>
            <button @click="submitHandler" class="btn btn-success">
              <span v-if="editIndex!=null">更新</span>
              <span v-else>建立</span>
            </button>
            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <button @click="cancelHandler" class="btn btn-warning">清除</button>
          </div>
        </div>
      </template>
    </modal-component>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
import ModalComponent from "@/components/ModalComponent.vue";
import { REST_API_URL } from "@/variables.js";

export default {
  // props: {
  //   username: {
  //     type: String
  //   }
  // },
  components: {
    ModalComponent
  },
  data() {
    return {
      loading: false,
      infos: [],
      infoExtras: [],
      editIndex: null,
      input: {
        name: "",
        description: "",
        date: this.getNowDate(),
        location: ""
      },
      crudMsg: "",
      locationList: [],
      isModalVisible: false
    };
  },
  computed: {
    ...mapState(["loginMsg"]),
    username() {
      // console.log("computed");
      return this.$store.state.username;
    }
  },
  watch: {
    username: function(newVal, oldVal) {
      // console.log("watched username changed");
      this.crudMsg = "";
      this.isLogin();
    }
  },
  mounted() {
    this.isLogin();
    this.getLocationList();
  },
  methods: {
    isLogin() {
      if (this.username != "Visitor") {
        this.updatePage();
      }
    },
    updatePage() {
      this.loading = true;
      axios
        .get(REST_API_URL + "api/dine/list/" + this.username + "/")
        .then(res => {
          // console.log(res);
          this.infos = res.data;
          for (let i = 0; i < this.infos.length; i++) {
            this.infoExtras.push({ isEditing: false });
          }
          this.loading = false;
        })
        .catch(err => {
          // console.log(err);
          this.crudMsg = "讀取資料發生錯誤";
        });
    },
    cancelHandler() {
      if (
        this.input.name ||
        this.input.date ||
        this.input.location ||
        this.input.description
      ) {
        if (this.editIndex != null) {
          this.infoExtras[this.editIndex].isEditing = false;
        }
        this.input.name = "";
        this.input.description = "";
        this.input.date = this.getNowDate();
        this.input.location = "";
        this.editIndex = null;
      }
    },
    submitHandler() {
      // see editing or creating
      if (this.editIndex == null) {
        if (this.input.name && this.input.date && this.input.location) {
          this.loading = true;
          axios
            .post(REST_API_URL + "api/dine/", this.input, {
              headers: {
                Authorization: "Token " + localStorage.keytoken
              }
            })
            .then(res => {
              this.infos.push(res.data);
              this.infoExtras.push({ isEditing: false });
              this.cancelHandler();
              this.loading = false;
              this.closeModal();
              this.$toast.success({
                title: "建立資料成功",
                message: "已完成資料建檔"
              });
            })
            .catch(err => {
              // console.log(err);
              this.crudMsg = "上傳資料失敗";
              this.$toast.error({
                title: "建立資料失敗",
                message: "伺服器發生錯誤"
              });
            });
        } else {
          this.validateMsg();
        }
      } else {
        if (this.input.name && this.input.date && this.input.location) {
          this.loading = true;
          let targetId = this.infos[this.editIndex].id;
          axios
            .put(
              REST_API_URL + "api/dine/detail/" + targetId + "/",
              this.input,
              {
                headers: {
                  Authorization: "Token " + localStorage.keytoken
                }
              }
            )
            .then(res => {
              this.infos[this.editIndex] = res.data;
              this.cancelHandler();
              this.loading = false;
              this.closeModal();
              this.$toast.success({
                title: "更新資料成功",
                message: "已完成資料更新"
              });
            })
            .catch(err => {
              // console.log(err);
              this.crudMsg = "上傳資料失敗";
            });
        } else {
          this.validateMsg();
        }
      }
    },
    deleteHandler(index) {
      let target = this.infos[index];
      this.$dialog
        .confirm(`確定要刪除 "${target.name}" ?`)
        .then(() => {
          this.loading = true;
          axios
            .delete(REST_API_URL + "api/dine/detail/" + target.id + "/", {
              headers: {
                Authorization: "Token " + localStorage.keytoken
              }
            })
            .then(res => {
              this.infos.splice(index, 1);
              this.infoExtras.splice(index, 1);
              this.cancelHandler();
              this.loading = false;
              this.$toast.success({
                title: "刪除成功",
                message: "已刪除資料"
              });
            })
            .catch(err => {
              // console.log(err);
              this.$toast.error({
                title: "刪除失敗",
                message: "伺服器發生錯誤"
              });
            });
        })
        .catch(() => {
          // console.log("cancel");
        });
    },
    editHandler(index) {
      if (this.editIndex != null) {
        this.infoExtras[this.editIndex].isEditing = false;
      }
      this.input.name = this.infos[index].name;
      this.input.description = this.infos[index].description;
      this.input.date = this.infos[index].date;
      this.input.location = this.infos[index].location;
      // switch to edit mode
      this.editIndex = index;
      this.infoExtras[index].isEditing = true;
      // open modal
      this.showModal();
    },
    getLocationList() {
      axios
        .get(REST_API_URL + "api/dine/locations/")
        .then(res => {
          this.locationList = res.data;
        })
        .catch(err => {
          if (!err.response) {
            this.$store.commit("setLoginMsg", "連線錯誤");
          } else {
            this.$store.commit("setLoginMsg", error.response.data.message);
          }
        });
    },
    showModal() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
      this.cancelHandler();
    },
    getNowDate() {
      let myDate = new Date();
      let year = myDate.getFullYear();
      let month = ("0" + (myDate.getMonth() + 1)).slice(-2);
      let date = ("0" + myDate.getDate()).slice(-2);
      let ymd = year + "-" + month + "-" + date;
      return ymd;
    },
    validateMsg() {
      let message = "";
      if (!this.input.name) {
        message = "請輸入名稱";
      } else if (!this.input.date) {
        message = "請輸入日期";
      } else if (!this.input.location) {
        message = "請選擇地點";
      } else {
        message = "輸入發生其他錯誤";
      }
      this.$toast.warn({
        title: "資料格式錯誤",
        message: message
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.info-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
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
.info-content {
  grid-column: 1/4;
  grid-row: 1/2;
}
.info-content-2 {
  grid-column: 1/6;
  grid-row: 2/3;
}
.record-editing {
  background-color: rgb(17, 247, 47);
}
</style>