<template>
  <div id="app-footer">
    <div class="container">
      <router-link to="/packages">
        <div class="navigation">Packages</div>
      </router-link>
      <router-link to="/bookings">
        <div class="navigation">Bookings</div>
      </router-link>
      <router-link to="/profile">
        <div class="navigation">Profile</div>
      </router-link>
      <router-link to="/account">
        <div class="navigation">Account</div>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "app-footer"
};
</script>

<style scoped>
#app-footer {
  border-bottom: 1px solid #eee;
  width: 100%;
  margin-bottom: 25px;
}
@media (max-width: 980px) {
  #app-footer {
    position: fixed;
    bottom: 0;
    margin-bottom: 0px;
  }
}
.container {
  max-width: 980px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
}
.container a {
  width: 24%;
  text-align: center;
  color: #666;
  font-size: 18px;
  padding: 15px 5px;
  cursor: pointer;
  text-decoration: none;
}
.container a:hover {
  color: #333;
}
</style>
