<template>
  <div id="login">
    <div class="container">
      <div class="title">Agent Login</div>

      <template v-if="!passwordCheck">
        <div>
          Don't have agent profile?
          <span
            class="change-state"
            @click="showRegister"
          >Register as agent</span>
        </div>
        <form @submit="submitEmail">
          <input v-model="email" type="email" placeholder="Your email..." class="email">
          <input type="submit" value="Submit Email" class="submit" :disabled="disabledEmail">
        </form>
      </template>

      <template v-else>
        Your Email : {{email}}
        <span @click="backToEmail" class="change-state">Change</span>
        <form @submit="submitPassword">
          <input v-model="password" type="password" placeholder="Your password..." class="email">
          <input type="submit" value="Submit Password" class="submit" :disabled="disabledPassword">
          <div>{{loginError}}</div>
        </form>
      </template>
    </div>
  </div>
</template>

<script>
import graphql from "../../ajax/graphql";
import { mapActions } from "vuex";

export default {
  name: "login",
  data: () => ({
    email: "",
    password: "",
    passwordCheck: false,
    disabledEmail: false,
    disabledPassword: false,
    loginError: null
  }),
  methods: {
    ...mapActions("auth", ["authCheck", "hasProfileCheck"]),
    showRegister() {
      this.$emit("showRegister");
    },
    backToEmail() {
      this.disabledEmail = false;
      this.passwordCheck = false;
    },
    // Submit Email
    submitEmail(e) {
      e.preventDefault();
      this.disabledEmail = true;
      const query = `mutation ($email : String!) {
        agentEmailCheck (email : $email)
        }`;
      const variables = {
        email: this.email
      };
      graphql(query, variables)
        .then(res => {
          if (res.data.data.agentEmailCheck) this.passwordCheck = true;
          else this.disabledEmail = false;
        })
        .catch(() => {
          this.disabledEmail = false;
        });
    },

    // Submit Password
    submitPassword(e) {
      e.preventDefault();
      this.disabledPassword = true;
      const query = `mutation ($email : String!, $password : String!, $isAgent : Boolean!) {
        userLogin (user : {userEmail : $email, userPassword: $password, isAgent: $isAgent}) {
          token,
          isAgent
        }
        }`;
      const variables = {
        email: this.email,
        password: this.password,
        isAgent: true
      };
      graphql(query, variables).then(res => {
        const data = res.data;
        if (data.errors) {
          this.loginError = data.errors[0].message;
          return null;
        }
        if (data.data) {
          if (data.data.userLogin.isAgent) this.hasProfileCheck(true);
          if (data.data.userLogin.token) this.authCheck(true);
          else return;
          localStorage.token = data.data.userLogin.token;
        } else {
          this.disabledEmail = false;
        }
      });
    }
  }
};
</script>

<style scoped>
#login {
  display: flex;
  justify-content: center;
  height: 100vh;
  background-color: #eee;
}
#login .container {
  max-width: 300px;
  max-height: fit-content;
  margin: 5% auto 0;
  background-color: #fff;
  padding: 20px;
}
#login .submit,
#login .email {
  width: 100%;
  margin-top: 10px;
}
#login .email {
  padding: 3px 10px;
}
#login .submit {
  background: rgb(173, 67, 67);
  color: #fff;
  padding: 5px 10px;
}
#login input:disabled {
  background: rgb(138, 76, 76);
}
.title {
  font-size: 20px;
}
</style>


