<template>
  <div id="app">
    <template v-if="isAuth && hasProfile">
      <AppHeader/>
      <AppFooter/>
      <div class="container">
        <router-view></router-view>
      </div>
    </template>
    <template v-if="isAuth && !hasProfile">
      <Profile/>
    </template>
    <template v-if="!isAuth">
      <Auth/>
    </template>
  </div>
</template>

<script>
import AppHeader from "./components/header/Header";
import AppFooter from "./components/footer/Footer";
import Auth from "./components/auth/Auth";
import Profile from "./components/content/profile/Profile";
import { mapGetters, mapActions } from "vuex";
import graphql from "./ajax/graphql";
export default {
  name: "app",
  components: {
    AppHeader,
    AppFooter,
    Auth,
    Profile
  },
  computed: {
    ...mapGetters("auth", ["isAuth", "hasProfile"])
  },
  methods: {
    ...mapActions("auth", ["authCheck", "hasProfileCheck"])
  },
  mounted() {
    const query = `mutation ($token : String!) {
        agentTokenCheck (token : $token) {
          valid,
          isAgent
        }
    }`;
    const variables = {
      token: localStorage.getItem("token")
    };

    if (!variables.token) return;

    graphql(query, variables)
      .then(res => {
        if (res.data.data.agentTokenCheck.isAgent) this.hasProfileCheck(true);
        if (res.data.data.agentTokenCheck.valid) this.authCheck(true);
        if (this.$route.path === "/" && this.isAuth)
          this.$router.push("/packages");
      })
      .then(() => {
        return;
      });
  }
};
</script>
<style>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  text-decoration: none;
  color: #666;
  font-size: 14px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}
.flex {
  display: flex;
}
.container {
  max-width: 980px;
  margin: 0 auto;
}
.title {
  font-size: 24px;
  padding-bottom: 10px;
}
.normal-button {
  background: #fff;
  border: 1px solid #3498db;
  border-radius: 5px;
  cursor: pointer;
}
.normal-button:hover {
  background: #f5f5f5;
}
.important-button {
  background: #3498db;
  border: 1px solid #3498db;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
}
.important-button:hover {
  background: #2980b9;
}
</style>