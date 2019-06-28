<template>
  <div>
    <div class="title">Manage Packages</div>
    <div class="flex">
      <router-link
        :to="{name:'package', params :{id : singlePackage._id} }"
        class="package-card"
        v-for="singlePackage in packages"
        :key="singlePackage._id"
      >
        <div class="package-image">
          <img :src="`${imgEndpoint}/${singlePackage.packageImages[0]}`">
        </div>
        <div class="package-name">{{singlePackage.packageName}}</div>
        <div class="bottom-info">
          <span
            class="package-price"
          >{{singlePackage.packagePrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}} /</span>
          <span class="package-duration">{{singlePackage.packageDuration}} days /</span>
          <span class="package-customer">{{singlePackage.packageCustomer}} person</span>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import graphql from "../../../ajax/graphql";
export default {
  name: "packages",
  data: () => ({
    imgEndpoint: process.env.VUE_APP_IMG,
    packages: [],
    packagesError: null
  }),
  methods: {
    getPackages() {
      const query = `{
        getOwnPackage {
        _id,
        packageName,
        packagePrice,
        packageImages,
        packageDuration,
        packageCustomer  
        }
      }`;
      const variables = {};
      graphql(query, variables)
        .then(res => {
          this.packages = res.data.data.getOwnPackage;
        })
        .catch(err => {
          this.packagesError = err;
        });
    }
  },
  mounted() {
    this.getPackages();
  }
};
</script>

<style scoped>
.package-card {
  display: block;
  max-width: 200px;
  box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.3);
  color: unset;
  margin-right: 20px;
}
.package-card:hover {
  transition: box-shadow 0.25s;
  box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.24);
}

.package-name {
  padding: 10px;
  font-size: 15px;
  color: #333;
  font-weight: 500;
}
img {
  max-width: 100%;
  height: 200px;
}
.bottom-info {
  padding: 0 10px 10px;
}
</style>
