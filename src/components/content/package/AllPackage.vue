<template>
  <div>
    <div class="flex-title">
      <div class="title">Manage Packages</div>
      <div>
        <button class="important-button" @click="$router.push('/package/add')">Add New Package</button>
      </div>
    </div>
    <div class="flex">
      <div class="flexbox-child" v-for="singlePackage in packages" :key="singlePackage._id">
        <router-link :to="{name:'package', params :{id : singlePackage._id} }" class="package-card">
          <div class="package-image">
            <img :src="`${imgEndpoint}/${singlePackage.packageImages[0]}`">
          </div>
          <div class="package-name">{{singlePackage.packageName}}</div>
          <div class="bottom-info">
            <span
              class="package-price"
            >{{singlePackage.packagePrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}} /</span>
            <span class="package-duration">{{" "}}{{singlePackage.packageDuration}} hours /</span>
            <span class="package-customer">{{" "}}{{singlePackage.packageCustomer}} person</span>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import graphql from "../../../ajax/graphql";
import { packageQuery } from "./PackageQueries";
export default {
  name: "packages",
  data: () => ({
    imgEndpoint: process.env.VUE_APP_IMG,
    packages: [],
    packagesError: null
  }),
  methods: {
    getPackages() {
      const query = packageQuery;
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
.flex-title {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.flex-title .important-button {
  padding: 5px 10px;
  margin-bottom: 10px;
  margin-left: 20px;
  text-transform: capitalize;
  min-height: 40px;
}
.flexbox-child {
  width: 25%;
}
.package-card {
  display: block;
  box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.3);
  color: unset;
  margin: 0px 10px 30px;
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
  width: 100%;
  height: 200px;
}
.bottom-info {
  padding: 0 10px 10px;
}
</style>
