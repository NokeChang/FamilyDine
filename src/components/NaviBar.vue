<template>
  <!-- <nav class="navbar navbar-expand-lg bg-dark navbar-dark fixed-top">
    <router-link to="/about" class="navbar-brand" v-if="username!='Visitor'">{{ username }}</router-link>
    <router-link to="/" class="navbar-brand" v-else>{{ username }}</router-link>
    <button type="button" class="navbar-toggler" data-toggle="collapse" data-target="#myNavbar">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="myNavbar">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item">
          <router-link to="/" class="nav-link">聚餐列表</router-link>
        </li>
      </ul>
      <slot></slot>
    </div>
  </nav>-->
  <b-navbar toggleable="lg" type="dark" variant="dark fixed-top">
    <b-navbar-brand to="/about" v-if="username!='Visitor'">{{ username }}</b-navbar-brand>
    <b-navbar-brand to="/" v-else>{{ username }}</b-navbar-brand>

    <b-navbar-toggle target="nav_collapse"/>

    <b-collapse is-nav id="nav_collapse">
      <b-navbar-nav class="mr-auto">
        <b-nav-item to="/">聚餐列表</b-nav-item>
      </b-navbar-nav>

      <slot></slot>
    </b-collapse>
  </b-navbar>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {
    if (localStorage.username) {
      this.$store.commit("setUsername", localStorage.username);
    } else {
      this.$store.commit("setUsername", "Visitor");
    }
  },
  computed: {
    username() {
      return this.$store.state.username;
    }
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  margin-bottom: 5px;
}
</style>

