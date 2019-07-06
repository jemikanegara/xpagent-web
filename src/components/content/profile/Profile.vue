<template>
  <div id="profile">
    <div class="title">Profile</div>
    <form class="section-container" @submit="submitProfile">
      <h2>Profile Information</h2>
      <div class="flex">
        <div class="left">
          <img :src="newAgent.agentPhoto">
          <div>
            <label for="agent-photo" class="agent-photo normal-button">Change Photo</label>
            <input type="file" id="agent-photo" @change="addPhoto">
          </div>
        </div>

        <div class="right">
          <div>
            <label for="agent-name">Name</label>
            <input type="text" v-model="newAgent.agentName" id="agent-name">
          </div>
          <div>
            <label for="agent-description">Description</label>
            <textarea v-model="newAgent.agentDescription" id="agent-description"></textarea>
          </div>
        </div>
      </div>
      <div>
        <input type="submit" class="important-button" :disabled="disableSubmit">
      </div>
    </form>
  </div>
</template>

<script>
import graphql from "../../../ajax/graphql";
const agentInit = {
  agentName: "",
  agentPhoto: "",
  agentDescription: ""
};
export default {
  name: "profile",
  data: () => ({
    agent: {
      ...agentInit
    },
    newAgent: {
      ...agentInit
    },
    imgEndpoint: process.env.VUE_APP_IMG,
    rawPhoto: null,
    errors: {},
    disableSubmit: false
  }),
  methods: {
    submitProfile(e) {
      e.preventDefault();
      this.disableSubmit = true;
      const query = `
        mutation (
          $agentName: String, 
          $agentPhoto: Upload, 
          $agentDescription: String){
            updateAgent(
              agent : {
                agentName: $agentName, 
                agentPhoto: $agentPhoto, 
                agentDescription: $agentDescription
                }){
                  agentName,
                  agentPhoto,
                  agentDescription
            }
          }
      `;

      const variables = {};

      if (this.newAgent.agentDescription !== this.agent.agentDescription)
        variables.agentDescription = this.newAgent.agentDescription;

      if (this.newAgent.agentName !== this.agent.agentName)
        variables.agentName = this.newAgent.agentName;

      if (this.rawPhoto) variables.agentPhoto = [this.rawPhoto];

      if (Object.keys(variables).length < 1) return;

      const agentPhotoArgument = variables.agentPhoto
        ? "agentPhoto"
        : undefined;

      graphql(query, variables, agentPhotoArgument)
        .then(res => {
          console.log(res);
          if (!res.data.errors) {
            this.disableSubmit = false;
            this.$router.push("/packages");
          }
        })
        .catch(() => {
          this.disableSubmit = false;
        });
    },
    addPhoto(e) {
      const file = e.target.files[0];
      this.rawPhoto = file;

      const reader = new FileReader();
      reader.onload = readerData => {
        this.newAgent.agentPhoto = readerData.target.result;
      };
      reader.readAsDataURL(file);
    },
    getAgentProfile() {
      const query = `
        {
          getOwnAgent {
            agentName,
            agentPhoto,
            agentDescription
          }
        }
      `;
      const variables = {};
      graphql(query, variables)
        .then(res => {
          if (!res.data.errors) {
            const agent = res.data.data.getOwnAgent;

            const newAgent = Object.assign({}, agent);

            const photoFullURL = `${this.imgEndpoint}/${newAgent.agentPhoto}`;

            newAgent.agentPhoto = photoFullURL;

            this.agent = agent;
            this.newAgent = newAgent;
          }
        })
        .catch();
    }
  },
  mounted() {
    this.getAgentProfile();
  }
};
</script>

<style scoped>
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
.section-container .left {
  width: 150px;
  margin-right: 20px;
}
.section-container .right {
  width: 80%;
}
.section-container img {
  height: 150px;
  width: 150px;
}
.section-container input:not([type="submit"]),
.section-container textarea {
  border: 1px solid #eee;
  line-height: 1.5em;
  padding: 10px 16px;
  width: 100% !important;
  margin: 10px 0;
}
.section-container input[type="submit"],
label.normal-button {
  padding: 10px;
  width: 100%;
}
.section-container input[type="submit"]:disabled {
  background: #66a6d0;
  cursor: unset;
}
.flex {
  margin-bottom: 20px;
}
#agent-photo {
  display: none;
}
label.agent-photo {
  display: block;
  text-align: center;
}
label:not(.agent-photo) {
  font-weight: 700;
}
</style>

