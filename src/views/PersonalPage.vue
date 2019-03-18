<template>
  <div>
    <!-- <login-component @updatePage="updatePage"></login-component> -->
    <!-- <crud-component :username="username"></crud-component> -->
    <crud-component></crud-component>
  </div>
</template>

<script>
import CrudComponent from "@/components/CrudComponent.vue";
// import LoginComponent from "@/components/LoginComponent.vue";

export default {
  data() {
    return {
      username: localStorage.username
    };
  },
  components: {
    CrudComponent
    // LoginComponent
  }
  // methods: {
  //   updatePage() {
  //     this.username = localStorage.username;
  //     console.log("time to update");
  //   }
  // }
};
</script>

