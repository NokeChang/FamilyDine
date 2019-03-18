import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { types } from 'util';

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  state: {
    loginMsg: "",
    username: "",
  },
  mutations: {
    setLoginMsg(state, payload) {
      state.loginMsg = payload;
    },
    setUsername(state, payload) {
      state.username = payload;
    }
  },
  actions: {

  }
})
