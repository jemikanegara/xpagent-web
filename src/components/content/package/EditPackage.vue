<template>
  <div id="edit-package">
    <template v-if="packageNotFound">
      <div class="not-found">Oops, Package not found</div>
    </template>
    <template v-else>
      <div v-if="addPackage" class="title">Add Package</div>
      <div v-if="!addPackage" class="title">Edit Package</div>
      <form @submit="submitPackage">
        <!-- Section : Images -->
        <div class="section-container">
          <h2>Upload Image</h2>
          <template v-if="errors.packageImages">
            <div class="error">{{this.errors.packageImages}}</div>
          </template>
          <div class="flex">
            <template v-if="newPackage.packageImages.length > 0">
              <template v-for="(imgUrl, i) in newPackage.packageImages">
                <div class="upload-image" :key="`uploaded-${i}`">
                  <div class="upload-box">
                    <img :src="imgUrl">
                    <div
                      v-if="newPackage.packageImages.length > 1 || addPackage"
                      class="delete-image"
                      @click="addPackage ? deleteImage(i) : deleteConfirm(i)"
                    >
                      <font-awesome icon="times" size="lg"/>
                    </div>
                  </div>
                </div>
              </template>
            </template>

            <template v-for="i in (5 - newPackage.packageImages.length)">
              <div class="upload-image" :key="`uploader-${i}`">
                <div class="upload-box">
                  <label class="upload-label" :for="`inputfile-${i}`">+</label>
                </div>
                <input type="file" @change="onFileChange" multiple :id="`inputfile-${i}`">
              </div>
            </template>
          </div>
        </div>

        <!-- Section : Package Description -->
        <div class="section-container">
          <h2>Package Description</h2>
          <template v-if="errors.packageName">
            <div class="error">{{this.errors.packageName}}</div>
          </template>
          <div class="flex">
            <label>Package Name :</label>
            <input type="text" v-model="newPackage.packageName">
          </div>
          <template v-if="errors.packageDescription">
            <div class="error">{{this.errors.packageDescription}}</div>
          </template>
          <div class="flex">
            <label>Package Description</label>
            <textarea type="text" v-model="newPackage.packageDescription"></textarea>
          </div>
        </div>

        <!-- Section : Package Pricing -->
        <div class="section-container">
          <h2>Pricing Information</h2>
          <template v-if="errors.packageDuration">
            <div class="error">{{this.errors.packageDuration}}</div>
          </template>
          <div class="flex">
            <label>Package Duration Estimation (in hours)</label>
            <input type="number" min="1" v-model.number="newPackage.packageDuration">
          </div>

          <template v-if="errors.packageCustomer">
            <div class="error">{{this.errors.packageCustomer}}</div>
          </template>
          <div class="flex">
            <label>Maximum Person per Package</label>
            <input type="number" min="1" v-model.number="newPackage.packageCustomer">
          </div>

          <template v-if="errors.packagePrice">
            <div class="error">{{this.errors.packagePrice}}</div>
          </template>
          <div class="flex">
            <label>Package Price</label>
            <template v-if="rawPrice">
              <input type="number" min="1" v-model="newPackage.packagePrice" @blur="hidePrice">
            </template>
            <template v-if="!rawPrice">
              <input type="text" v-model="price" @click="showPrice">
            </template>
          </div>
        </div>

        <div class="flex">
          <button type="button" class="normal-button" @click="() => {$router.go(-1)}">Cancel</button>
          <input
            type="submit"
            value="Submit Changes"
            class="important-button"
            :disabled="disableSubmit"
          >
        </div>
      </form>

      <template v-if="deleteImageData.confirmPopUp">
        <div class="delete-image-confirm">
          <div class="delete-image-box">
            <img :src="deleteImageData.image">
            <div>Are you sure want to delete this image?</div>
            <div>once it deleted there is no way to revert back</div>
            <div class="buttons">
              <button class="normal-button" @click="deleteConfirm()">Cancel</button>
              <button class="important-button" @click="deleteImage">Delete</button>
            </div>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import Vue from "vue";
import graphql from "../../../ajax/graphql";
import {
  createPackageQuery,
  updatePackageQuery,
  singlePackageQuery,
  deletePackageImgQuery
} from "./PackageQueries";

const packageInit = {
  packageName: "",
  packageImages: [],
  packagePrice: 0,
  packageDescription: "",
  packageDuration: 0,
  packageCustomer: 0
};

export default {
  name: "edit-package",
  data: () => ({
    addPackage: false,
    deleteImageData: {
      confirmPopUp: false,
      image: "",
      imageId: -1
    },
    disableSubmit: false,
    errors: {},
    imgEndpoint: process.env.VUE_APP_IMG,
    newPackage: { ...packageInit },
    packageNotFound: false,
    price: "",
    rawImages: [],
    rawPrice: false,
    singlePackage: { ...packageInit }
  }),
  watch: {
    newPackage: {
      handler: function({ packagePrice }) {
        const result = packagePrice
          .toString()
          .replace(/\D/g, "")
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        Vue.nextTick(() => (this.price = result));
      },
      deep: true
    }
  },
  methods: {
    showPrice() {
      this.rawPrice = true;
    },
    hidePrice() {
      this.rawPrice = false;
    },
    onFileChange(e) {
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      Array.from(files).forEach(image => {
        this.createImage(image, reader => {
          this.newPackage.packageImages.push(reader.target.result);
        });
      });
      this.rawImages.push(...files);
    },
    createImage(file, cb) {
      const reader = new FileReader();
      reader.onload = cb;
      reader.readAsDataURL(file);
    },
    deleteConfirm(id) {
      const showBox = id !== undefined;
      document.body.style.height = showBox ? "100%" : "unset";
      document.body.style.overflow = showBox ? "hidden" : "unset";
      this.deleteImageData.confirmPopUp = showBox;
      this.deleteImageData.image = showBox
        ? this.newPackage.packageImages[id]
        : "";
      this.deleteImageData.imageId = showBox ? id : -1;
    },
    deleteImage(imgId) {
      const id = this.addPackage ? imgId : this.deleteImageData.imageId;
      const deleteLocalImg = () => {
        this.newPackage.packageImages.splice(id, 1);
      };

      if (!this.addPackage) {
        const variables = {
          _id: this.$route.params.id,
          imageKey: this.singlePackage.packageImages[id]
        };

        graphql(deletePackageImgQuery, variables)
          .then(res => {
            console.log(res);
            if (!res.data.errors) {
              deleteLocalImg();
            }
          })
          .catch(() => {
            return null;
          });
      } else {
        deleteLocalImg();
      }

      this.deleteConfirm();
    },
    submitPackage(e) {
      e.preventDefault();
      this.disableSubmit = true;
      this.removeErrors();

      // Form Validation
      let isValid = true;
      const matching = {
        packageName: 6,
        packageDescription: 30
      };

      for (let key in this.newPackage) {
        const newPackage = this.newPackage;
        const fieldName =
          key[0].toUpperCase() +
          key.substring(1).replace(/([a-z0-9])([A-Z])/g, "$1 $2");

        if (matching[key]) {
          if (newPackage[key].length < matching[key]) {
            this.errors[key] = `${fieldName} cannot be less than ${
              matching[key]
            } characters`;
          }
        } else {
          if (newPackage[key].length < 1) {
            this.errors[key] = `${fieldName} cannot be less than 1`;
          }
        }
      }

      for (let key in this.newPackage) {
        if (this.errors[key] !== null) {
          isValid = false;
          break;
        }
      }

      if (!isValid) this.disableSubmit = false;
      if (!isValid) return;

      // Define GRAPHQL Query & Variables
      const query = this.addPackage ? createPackageQuery : updatePackageQuery;

      const variables = {
        packageName: this.newPackage.packageName,
        packagePrice: +this.newPackage.packagePrice,
        packageDescription: this.newPackage.packageDescription,
        packageImages: [...this.rawImages],
        packageDuration: this.newPackage.packageDuration,
        packageCustomer: this.newPackage.packageCustomer
      };

      // Nulling unchange field
      if (!this.addPackage) {
        variables._id = this.$route.params.id;
        for (let key in this.newPackage) {
          if (
            key !== "packageImages" &&
            this.newPackage[key] === this.singlePackage[key]
          ) {
            variables[key] = undefined;
          }
        }
      }

      // Execute graphql
      graphql(query, variables, "packageImages")
        .then(res => {
          if (!res.data.errors) {
            this.disableSubmit = false;
            this.$router.push("/packages");
          }
        })
        .catch(() => {
          this.disableSubmit = false;
        });
    },
    getSinglePackage() {
      const query = singlePackageQuery;
      const variables = { id: this.$route.params.id };
      graphql(query, variables)
        .then(res => {
          if (!res.data.errors) {
            // Shorten variable
            const getSinglePackage = res.data.data.getSinglePackage;
            // Store Raw Data
            const rawPackage = Object.assign({}, getSinglePackage);
            // Generate Full URL
            const packageImages = getSinglePackage.packageImages.map(
              imgUrl => `${this.imgEndpoint}/${imgUrl}`
            );
            // Assign full URL
            getSinglePackage.packageImages = packageImages;
            // Assign data
            this.singlePackage = rawPackage;
            this.newPackage = getSinglePackage;
          } else if (res.data.errors) {
            this.packageNotFound = true;
          }
        })
        .catch(() => {
          return;
        });
    },
    removeErrors() {
      for (let key in packageInit) {
        this.errors[key] = null;
      }
    }
  },
  mounted() {
    this.removeErrors();
    if (this.$route.path !== "/package/add") this.getSinglePackage();
    else if (this.$route.path === "/package/add") {
      this.newPackage.packageImages = [];
      this.addPackage = true;
    }
  }
};
</script>

<style scoped>
#edit-package {
  padding: 10px;
  font-size: 14px;
}
img {
  width: 100%;
  height: 100%;
}
textarea {
  resize: none;
  height: 100px;
}
input,
textarea {
  padding: 10px 16px;
  width: 80%;
}
input:not([type="submit"]),
textarea {
  border: 1px solid #eee;
  line-height: 1.5em;
}
.section-container {
  box-shadow: rgba(0, 0, 0, 0.08) 0px 2px 10px 0px;
  margin: 10px 0 30px;
  padding: 30px;
}
.section-container h2 {
  color: #333;
  font-size: 17px;
  padding-bottom: 10px;
}
.flex {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
}
.flex label:not(.upload-label),
.flex button {
  width: 19%;
}
input:disabled {
  background: #66a6d0;
  cursor: unset;
}

input[type="file"] {
  display: none;
}
.upload-image {
  width: 19%;
}
.upload-box {
  width: 100%;
  padding-top: 100%;
  display: inline-block;
  position: relative;
}
.upload-box > *:not(.delete-image) {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 45px;
  color: #999;
  border: 1px solid #eee;
  border-radius: 5px;
  cursor: pointer;
  background: rgba(238, 238, 238, 0.3);
}
.upload-box > img {
  cursor: unset !important;
}
.upload-box:hover > img {
  opacity: 0.5;
}
.upload-box > .delete-image {
  display: none;
  position: absolute;
  top: 0;
  right: 0;
  width: 30px;
  height: 30px;
  padding: 5px;
  border-radius: 5px;
  background: #fff;
  text-align: center;
  cursor: pointer;
}
.upload-box > .delete-image path {
  color: #333;
}
.upload-box:hover .delete-image {
  display: block;
}
.upload-label:hover {
  color: #000;
}
.delete-image-confirm {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.delete-image-box {
  position: absolute;
  margin: auto;
  padding: 30px 15px 10px;
  min-width: 250px;
  min-height: 250px;
  background: #fff;
  box-shadow: inset 0 7px 9px -7px rgba(0, 0, 0, 0.04);
  border-radius: 5px;
}
.delete-image-box img {
  width: 150px;
  height: 150px;
  margin: 0 auto 10px;
  display: block;
}
.delete-image-box div {
  text-align: center;
}
.delete-image-box .buttons {
  display: flex;
  justify-content: center;
}
.delete-image-box button {
  padding: 10px;
  margin: 10px 5px;
}
.error {
  display: inline-block;
  background: #e74c3c;
  color: #fff;
  padding: 5px;
  border-radius: 5px;
}
.not-found {
  font-size: 30px;
  text-align: center;
  text-transform: uppercase;
  color: #000;
}
</style>
