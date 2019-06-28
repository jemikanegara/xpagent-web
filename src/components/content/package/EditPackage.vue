<template>
  <div id="edit-package">
    <template v-if="packageNotFound">
      <div>Package not found</div>
    </template>
    <template v-else>
      <div v-if="addPackage" class="title">Add Package</div>
      <div v-if="!addPackage" class="title">Edit Package</div>
      <form @submit="submitPackage">
        <div></div>
        <!-- Section : Images -->
        <div class="section-container">
          <h2>Upload Image</h2>
          <div class="flex">
            <template v-if="newPackage.packageImages.length > 0">
              <template v-for="(imgUrl, i) in newPackage.packageImages">
                <div class="upload-image" :key="`uploaded-${i}`">
                  <div class="upload-box">
                    <img :src="imgUrl">
                    <div class="delete-image" @click="deleteImage(i)">
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
          <div class="flex">
            <label>Package Name :</label>
            <input type="text" v-model="newPackage.packageName">
          </div>
          <div class="flex">
            <label>Package Description</label>
            <textarea type="text" v-model="newPackage.packageDescription"></textarea>
          </div>
        </div>
        <!-- Section : Package Pricing -->
        <div class="section-container">
          <h2>Pricing Information</h2>
          <div class="flex">
            <label>Package Duration Estimation (in hours)</label>
            <input type="number" v-model="newPackage.packageDuration">
          </div>
          <div class="flex">
            <label>Maximum Person per Package</label>
            <input type="number" v-model="newPackage.packageCustomer">
          </div>
          <div class="flex">
            <label>Package Price</label>
            <template v-if="rawPrice">
              <input type="number" v-model="newPackage.packagePrice" @blur="hidePrice">
            </template>
            <template v-if="!rawPrice">
              <input type="text" v-model="price" @click="showPrice">
            </template>
          </div>
        </div>

        <div class="flex">
          <button class="normal-button">Cancel</button>
          <input type="submit" value="Submit Changes" class="important-button">
        </div>
      </form>
    </template>
  </div>
</template>

<script>
import Vue from "vue";
import graphql from "../../../ajax/graphql";
import axios from "axios";
export default {
  name: "edit-package",
  data: () => ({
    addPackage: false,
    packageNotFound: false,
    imgEndpoint: process.env.VUE_APP_IMG,
    rawPrice: false,
    errors: {
      packageImages: null,
      packageName: null,
      packageDescription: null,
      packageDuration: null,
      packageCustomer: null,
      packagePrice: null
    },
    singlePackage: {
      packageName: "",
      packageImages: [],
      packagePrice: 0,
      packageDescription: "",
      packageDuration: 0,
      packageCustomer: 0
    },
    newPackage: {
      packageName: "",
      packageImages: [],
      packagePrice: 0,
      packageDescription: "",
      packageDuration: 0,
      packageCustomer: 0
    },
    price: "",
    rawImages: [],
    map: {}
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
    },
    rawImages: {
      handler: function() {
        this.rawImages.forEach((img, i) => {
          this.map[i.toString()] = [`variables.packageImages.${i}`];
        });
      }
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
      Array.from(files).forEach((image, i) => {
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
    deleteImage(e, id) {
      this.newPackage.packageImages.splice(id, 1);
    },
    submitPackage(e) {
      e.preventDefault();
      const createPackageQuery = `
        mutation (tourPackage : {
            $packageName : String!,
            $packagePrice: Int!,
            $packageDescription: String!,
            $packageImages: [Upload!]!,
            $packageDuration: Int!,
            $packageCustomer: Int!
            }) {
              createPackage(
                packageName : $packageName, 
                packagePrice: $packagePrice, 
                packageDescription: $packageDescription, 
                packageImages: $packageImages, 
                packageDuration: $packageDuration, 
                packageCustomer: $packageCustomer){
                  packageName
                }
        }
      `;

      const updatePackageQuery = `
        mutation (
        $_id: ID!,
        $packageName: String,
        $packagePrice: Int,
        $packageDescription: String,
        $packageImages: [Upload],
        $packageDuration: Int,
        $packageCustomer: Int
        ) {
          updatePackage(tourPackage: {
                _id: $_id,
                packageName: $packageName, 
                packagePrice: $packagePrice, 
                packageDescription: $packageDescription, 
                packageImages: $packageImages, 
                packageDuration: $packageDuration, 
                packageCustomer: $packageCustomer}) {
                  packageName
                }
        }
      `;

      const query =
        this.$route.path === "/package/add"
          ? createPackageQuery
          : updatePackageQuery;

      const packageImages = Array.from(this.rawImages).map(() => null);

      const variables = {
        packageName: this.newPackage.packageName,
        packagePrice: +this.newPackage.packagePrice,
        packageDescription: this.newPackage.packageDescription,
        packageImages: [...packageImages],
        packageDuration: +this.newPackage.packageDuration,
        packageCustomer: +this.newPackage.packageCustomer
      };

      this.$route.path === "/package/add"
        ? null
        : (variables._id = this.$route.params.id);

      const o = {
        query,
        variables
      };

      const form = new FormData();
      form.append("operations", JSON.stringify(o));
      form.append("map", JSON.stringify(this.map));
      Array.from(this.rawImages).forEach((image, i) => {
        form.append(`${i}`, image, image.name);
      });

      for (var pair of form.entries()) {
        console.log(pair[0] + ", " + pair[1]);
      }

      axios
        .post("http://localhost:5000/graphql", form, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        })
        .then(res => {
          if (!res.data.errors) {
            this.$router.push("/packages");
          }
        })
        .catch(() => {
          return null;
        });
    },

    getSinglePackage() {
      const query = `
      query ($id : String!) {
        getSinglePackage(id: $id){
          packageName,
          packagePrice,
          packageDescription,
          packageImages,
          packageDuration,
          packageCustomer
        }
      }
    `;
      const variables = { id: this.$route.params.id };
      graphql(query, variables)
        .then(res => {
          if (!res.data.errors) {
            // Shorten variable
            const getSinglePackage = res.data.data.getSinglePackage;
            // Generate Full URL
            const packageImages = getSinglePackage.packageImages.map(
              imgUrl => `${this.imgEndpoint}/${imgUrl}`
            );
            // Assign full URL
            getSinglePackage.packageImages = packageImages;
            // Assign data
            this.singlePackage = getSinglePackage;
            this.newPackage = getSinglePackage;
          } else if (res.data.errors) {
            this.packageNotFound = true;
          }
        })
        .catch(() => {
          return;
        });
    }
  },
  mounted() {
    if (this.$route.path !== "/package/add") this.getSinglePackage();
    else if (this.$route.path === "/package/add") this.addPackage = true;
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
</style>
