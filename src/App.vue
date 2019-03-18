<template>
  <div class="container" id="app">
    <navi-bar>
      <login-component></login-component>
    </navi-bar>
    <header></header>
    <router-view/>
    <footer></footer>
  </div>
</template>

<script>
import NaviBar from "@/components/NaviBar.vue";
import LoginComponent from "@/components/LoginComponent.vue";

export default {
  components: {
    NaviBar,
    LoginComponent
  }
};
</script>

<style lang="scss">
#app {
  background-color: rgb(250, 225, 187);
  padding: 0px 10px;
}
div.multiline {
  white-space: pre-wrap;
}
header {
  height: 60px;
}
footer {
  height: 10px;
}
</style>

