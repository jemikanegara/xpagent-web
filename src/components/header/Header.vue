<template>
  <div id="header">
    <div class="container">
      <input type="text" placeholder="Search...">
    </div>
  </div>
</template>

<script>
export default {
  name: "app-header"
};
</script>

<style scoped>
#header {
  background-color: #2980b9;
}
#header .container {
  display: flex;
  justify-content: space-between;
  max-width: 980px;
  margin: 0 auto;
  padding: 10px;
}
button {
  margin-right: 10px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #fff;
}
#header input {
  padding: 10px;
  width: 100%;
  border-radius: 5px;
}
</style>

