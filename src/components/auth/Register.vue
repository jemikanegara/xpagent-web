<template>
  <div id="register">
    <div class="container">
      <div class="title">Register an Agent</div>
      <div>
        Are you already an agent?
        <span class="change-state" @click="showLogin">Login</span>
      </div>
    </div>
  </div>
</template>
  
<script>
export default {
  name: "register",
  methods: {
    showLogin() {
      this.$emit("showLogin");
    }
  }
};
</script>

<style scoped>
#register {
  display: flex;
  justify-content: center;
  height: 100vh;
  background-color: #eee;
}
#register .container {
  max-width: 300px;
  max-height: fit-content;
  margin: 5% auto 0;
  background-color: #fff;
  padding: 20px;
}
#register .submit,
#register .email {
  width: 100%;
  margin-top: 10px;
}
#register .email {
  padding: 3px 10px;
}
#register .submit {
  background: rgb(173, 67, 67);
  color: #fff;
  padding: 5px 10px;
}
#register input:disabled {
  background: rgb(138, 76, 76);
}
.title {
  font-size: 20px;
}
</style>
