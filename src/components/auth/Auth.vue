<template>
  <div>
    <template v-if="loginPage">
      <Login @showRegister="showRegister"/>
    </template>
    <template v-else>
      <Register @showLogin="showLogin"/>
    </template>
  </div>
</template>

<script>
import Login from "./Login";
import Register from "./Register";
export default {
  name: "auth",
  components: {
    Login,
    Register
  },
  data: () => ({
    loginPage: false
  }),
  methods: {
    showLogin() {
      this.loginPage = true;
    },
    showRegister() {
      this.loginPage = false;
    }
  }
};
</script>

<style>
.change-state {
  text-decoration: underline;
  cursor: pointer;
}
</style>
