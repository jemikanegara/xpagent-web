<template>
  <div id="account">
    <div class="title">Account</div>
    <form class="section-container" @submit="submitProfile">
      <h2>Account Information</h2>
      <div>
        <label for="agent-name">Name</label>
        <input type="text" id="user-name">
      </div>
      <div>
        <label for="agent-description">Description</label>
        <textarea id="agent-description"></textarea>
      </div>
      <div>
        <input type="submit" class="important-button" :disabled="disableSubmit">
      </div>
    </form>
  </div>
</template>

<script>
import grapql from "../../../ajax/graphql";
export default {
  name: "account"
};
</script>

<style scoped>
</style>
