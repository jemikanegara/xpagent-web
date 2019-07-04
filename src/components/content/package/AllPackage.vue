<template>
  <div>
    <!-- Title -->
    <div class="flex-title">
      <div class="title">Manage Packages</div>
      <div>
        <button class="important-button" @click="$router.push('/package/add')">Add New Package</button>
      </div>
    </div>
    <!-- Top Checkbox -->
    <div class="flex package-card top-checkbox">
      <!-- Top Checkbox - Checkbox -->
      <div class="package-check">
        <input
          type="checkbox"
          v-model="checkAllPackages"
          :style="checkAllPackages ? { background: '#2980b9' }: {}"
        >
        <font-awesome
          icon="check"
          size="1x"
          :style="{color: '#fff', position: 'absolute', left: '3px', right: '3px', bottom: '3px', top: '3px'}"
          @click="unCheckAll"
          v-if="checkAllPackages"
        />
      </div>
      <!-- Top Checkbox - Actions -->
      <div v-if="checkedTotal > 0" class="flex actions">
        <div
          class="check-information"
        >{{checkedTotal}} package{{checkedTotal > 1 ? 's' : ''}} selected</div>
        <button class="important-button delete-package">Delete Selected</button>
      </div>
    </div>
    <!-- Packages -->
    <div class="flex">
      <div
        class="flexbox-child package-card"
        v-for="singlePackage in packages"
        :key="singlePackage._id"
      >
        <div class="package-check">
          <input type="checkbox" v-model.lazy="checkedPackages[singlePackage._id]">
          <font-awesome
            icon="check"
            size="1x"
            :style="{color: '#fff', position: 'absolute', left: '3px', right: '3px', bottom: '3px', top: '3px'}"
            @click="singleUncheck(singlePackage._id)"
            v-if="checkedPackages[singlePackage._id]"
          />
        </div>

        <div class="package-image">
          <img :src="`${imgEndpoint}/${singlePackage.packageImages[0]}`">
        </div>
        <div class="package-info">
          <div class="package-name">{{singlePackage.packageName}}</div>

          <div class="bottom-info">
            <span
              class="package-price"
            >{{singlePackage.packagePrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}} /</span>
            <span class="package-duration">{{" "}}{{singlePackage.packageDuration}} hours /</span>
            <span class="package-customer">{{" "}}{{singlePackage.packageCustomer}} person</span>
          </div>
          <router-link :to="{name:'package', params :{id : singlePackage._id} }">
            <button class="edit important-button" type="button">Edit</button>
          </router-link>
          <button class="delete-package normal-button" type="button">Delete</button>
        </div>
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
    packagesError: null,
    checkedPackages: {},
    checkAllPackages: false,
    checkedTotal: 0
  }),
  watch: {
    checkAllPackages: {
      handler: "checkAll"
    },
    checkedPackages: {
      handler: function(newCheckedValue) {
        let checkedTotal = 0;
        for (let key in newCheckedValue) {
          if (newCheckedValue[key]) checkedTotal++;
        }
        this.checkedTotal = checkedTotal;
      },
      deep: true
    }
  },
  methods: {
    getPackages() {
      const query = packageQuery;
      const variables = {};
      graphql(query, variables)
        .then(res => {
          this.packages = res.data.data.getOwnPackage;
          this.initializeChecked(res.data.data.getOwnPackage);
        })
        .catch(err => {
          this.packagesError = err;
        });
    },
    initializeChecked(packagesArray) {
      let checkedPackages = {};
      packagesArray.forEach(singlePackage => {
        checkedPackages[singlePackage._id] = false;
      });
      this.checkedPackages = checkedPackages;
    },
    checkAll() {
      if (this.checkAllPackages) {
        this.packages.forEach(singlePackage => {
          this.checkedPackages[singlePackage._id] = true;
        });
      } else {
        this.unCheckAll();
      }
    },
    unCheckAll() {
      this.checkAllPackages = false;
      for (let key in this.checkedPackages) {
        this.checkedPackages[key] = false;
      }
    },
    singleUncheck(id) {
      this.checkedPackages[id] = false;
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
  width: 100%;
  display: flex;
  align-items: center;
}
.package-card {
  box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.3);
  color: unset;
  margin: 0px 10px 20px;
  height: 100px;
}
/* .package-card:hover {
  transition: box-shadow 0.25s;
  box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.24);
} */
.package-name {
  padding: 10px;
  font-size: 15px;
  color: #333;
  font-weight: 500;
}
img {
  width: 50px;
  height: 50px;
}
.bottom-info {
  padding: 0 10px 10px;
}
input[type="checkbox"] {
  appearance: none;
  padding: 10px;
  position: relative;
  outline: none;
  box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.3);
  cursor: pointer;
  background: #fff;
  border-radius: 2px;
}

input[type="checkbox"]:checked {
  background: #2980b9;
}

.fa-check {
  cursor: pointer;
}

input[type="checkbox"]:checked .fa-check {
  display: block !important;
  z-index: 99;
}

.package-check {
  position: relative;
  margin: 0 10px;
}
.edit {
  margin: 0 10px 10px;
  padding: 5px;
}
.delete-package {
  padding: 5px;
}
.top-checkbox {
  height: 50px;
  background: #eee;
  align-items: center;
}
.flex.actions {
  align-items: center;
}
.flex.actions > * {
  margin-right: 10px;
}
</style>
