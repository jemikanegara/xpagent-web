<template>
  <div>
    <!-- Title -->
    <div class="flex-title">
      <div class="title">Manage Packages</div>
      <div>
        <button class="important-button" @click="$router.push('/package/add')">Add New Package</button>
      </div>
    </div>

    <div v-if="deleteModal" class="delete-modal-container">
      <div class="delete-modal">
        Are you sure want to delete these packages?
        <div class="delete-list">
          <ul v-for="(value, checkedSinglePackage) in checkedPackages" :key="checkedSinglePackage">
            <li v-if="value">{{getPackageName(checkedSinglePackage)}}</li>
          </ul>
        </div>

        <div class="confirm-button flex">
          <button class="normal-button" @click="deleteModalToggle(false)">Cancel</button>
          <button class="important-button" @click="deletePackages">Delete</button>
        </div>
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
        <button
          @click="deleteModalToggle(true)"
          class="important-button delete-package"
        >Delete All Selected</button>
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import graphql from "../../../ajax/graphql";
import { packageQuery } from "./PackageQueries";
import { deleteMultiPackageQuery } from "./PackageQueries";
export default {
  name: "packages",
  data: () => ({
    imgEndpoint: process.env.VUE_APP_IMG,
    packages: [],
    packagesError: null,
    checkedPackages: {},
    checkAllPackages: false,
    checkedTotal: 0,
    deleteModal: false
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
    },
    deleteModalToggle(value) {
      this.deleteModal = value;
      document.body.style.height = this.deleteModal ? "100%" : "unset";
      document.body.style.overflow = this.deleteModal ? "hidden" : "unset";
    },
    getPackageName(id) {
      return this.packages
        .slice()
        .filter(singlePackage => singlePackage._id === id)[0].packageName;
    },
    deletePackages() {
      const query = deleteMultiPackageQuery;
      const _id = Object.keys(this.checkedPackages)
        .filter(_id => this.checkedPackages[_id])
        .map(_id => ({ _id }));
      const variables = {
        _id
      };
      graphql(query, variables)
        .then(res => {
          console.log(res);
          if (!res.data.errors) {
            this.getPackages();
            this.deleteModalToggle(false);
          }
        })
        .catch(err => {
          console.log(err);
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
  box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.3);
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
.delete-modal-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 99;
}
.delete-modal {
  max-width: 500px;
  margin: 5% auto 0;
  padding: 30px;
  background: #fff;
}
.delete-modal * {
  word-wrap: break-word;
}
.delete-list {
  padding: 10px;
  background: #c7ecee;
  color: #fff;
  border-radius: 5px;
  margin: 10px 0;
}
.delete-list ul {
  margin-left: 20px;
}
.delete-list li {
  margin-bottom: 5px;
}
.confirm-button {
  background: #eee;
  padding: 10px;
}
.confirm-button button {
  padding: 10px;
  margin-right: 10px;
}
</style>