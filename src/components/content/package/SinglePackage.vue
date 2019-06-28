<template>
  <div>Single Package</div>
</template>

<script>
export default {
  name: "single-package",
  data: () => ({
    packageUrl: ""
  }),
  mounted() {
    this.packageUrl = this.$route.params.id;
  }
};
</script>
