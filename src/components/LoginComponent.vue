<template>
  <div id="login-component">
    <div v-if="loginnedUser.username">
      <button class="btn btn-outline-danger my-2 my-sm-0" @click="logoutHandler">登出</button>
    </div>
    <div v-else>
      <div class="form-inline my-2 my-lg-0">
        <div>
          <input
            class="form-control mr-sm-2"
            type="text"
            name="username"
            maxlength="100"
            v-model="user.username"
            placeholder="輸入帳號"
          >
        </div>
        <div>
          <input
            class="form-control mr-sm-2"
            type="password"
            name="password"
            maxlength="100"
            v-model="user.password"
            placeholder="輸入密碼"
          >
        </div>
        <button class="btn btn-outline-success my-2 my-sm-0" @click="loginHandler">登入</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapState, mapMutations } from "vuex";
import { REST_API_URL } from "@/variables.js";

export default {
  data() {
    return {
      user: {
        username: "",
        password: ""
      },
      loginnedUser: {
        username: ""
      }
    };
  },
  computed: {
    ...mapState(["loginMsg"])
  },
  mounted() {
    this.loginnedUser.username = localStorage.username;
    if (this.loginnedUser.username) {
      this.$store.commit("setLoginMsg", "");
    } else {
      this.$store.commit("setLoginMsg", "請先登入帳號");
    }
  },
  methods: {
    loginHandler() {
      //username and pwd from input form
      let dataSent = {
        username: this.user.username,
        password: this.user.password
      };
      axios
        .post(REST_API_URL + "rest-auth/login/", dataSent)
        .then(res => {
          // console.log(res);
          //recieve token and set the input form blank
          localStorage.keytoken = res.data.key;
          this.user.username = "";
          this.user.password = "";
          this.$store.commit("setLoginMsg", "");
          this.$toast.info({
            title: "登入成功",
            message: "歡迎回來"
          });
          this.getUserDetail();
        })
        .catch(err => {
          // console.log(err.response.status);
          this.$toast.warn({
            title: "登入失敗",
            message: "帳號或密碼錯誤"
          });
          this.$store.commit("setLoginMsg", "帳號或密碼錯誤");
        });
    },
    getUserDetail() {
      //get username from backend
      axios
        .get(REST_API_URL + "rest-auth/user/", {
          headers: {
            Authorization: "Token " + localStorage.keytoken
          }
        })
        .then(res => {
          // console.log(res);
          let un = res.data.username;
          localStorage.username = un;
          this.loginnedUser.username = un;
          this.$store.commit("setUsername", un);
          // console.log("before call parent");
          // this.$emit("updatePage");
          // console.log("after call parent");
        })
        .catch(err => {
          // console.log(err);
          this.$toast.error({
            title: "取得個人資料失敗",
            message: "伺服器發生錯誤"
          });
        });
    },
    logoutHandler() {
      this.$dialog
        .confirm("確定要登出？")
        .then(() => {
          axios
            .post(REST_API_URL + "rest-auth/logout/", "nothing", {
              headers: {
                Authorization: "Token " + localStorage.keytoken
              }
            })
            .then(res => {
              // console.log(res);
              localStorage.keytoken = "";
              localStorage.username = "";
              this.loginnedUser.username = "";
              this.$store.commit("setLoginMsg", "已成功登出");
              this.$store.commit("setUsername", "Visitor");
              this.$router.replace({ name: "home" });
              this.$toast.success({
                title: "登出成功",
                message: "已登出"
              });
              // this.$emit("updatePage");
            })
            .catch(err => {
              // console.log(err);
              this.$store.commit("setLoginMsg", "登出發生錯誤");
              this.$toast.error({
                title: "登出失敗",
                message: "伺服器發生錯誤"
              });
            });
        })
        .catch(() => {
          // console.log("cancel");
        });
    }
  }
};
</script>

