<template>
  <div id="pageContent">
    <Tiptap />
    <div id="bottom">
      <div id="posts">
        <Posts />
      </div>
      <div id="users"></div>
    </div>
  </div>
</template>

<script setup>
import Tiptap from "./Tiptap.vue";
import Posts from "./Posts.vue";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useUser } from "../store/user.js"

const user = useUser()
const router = useRouter()
const claims = ref({})

onMounted( async () => {
  
  if (!user) {
    router.push('/')
    return
  }

  const admin = await user.getAdmin()

  if (!admin.success) {
    router.push('/')
  }

});

</script>

<style scoped>
.ql-editor {
  display: block;
  font-family: "Sans";
  font-weight: 400;
  font-style: normal;
}

#pageContent {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: auto;
}

#send-email {
  display: flex;
  flex-direction: column;
  margin: auto;
  width: 90%;
  margin-left: 5%;
}

#send-email-form {
  margin: auto;
  width: 100%;
  margin-bottom: 5%;
}

#email-buttons {
  display: flex;
  flex-direction: row;
  margin: auto;
  width: 30%;
}

#bottom {
  font-family: "Sans";
  display: flex;
  flex-direction: row;
  padding: 5%;
}

#posts {
  margin: 0;
  display: flex;
  width: 50%;
  flex-direction: column;
}

.post {
  display: flex;
  flex-direction: row-reverse;
  background-color: aliceblue;
  border: solid 1px black;
  border-radius: 3vw;
  height: 5%;
  align-items: center;
}

.post p {
  margin-right: 5%;
  width: 100%;
  height: 100%;
}

#posts img {
  margin: auto;
  height: 100%;
  width: auto;
  margin-left: 15%;
}

#users {
  padding: 5%;
}

.user {
  padding: 5%;
  margin: 5%;
  background-color: aliceblue;
  border: solid 1px black;
  border-radius: 3vw;
  width: 100%;
}

.user-content {
  display: none;
}

.active .user-content {
  display: block;
}
</style>
