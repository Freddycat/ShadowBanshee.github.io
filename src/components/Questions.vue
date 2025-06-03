<template>
  <div class="home">
    <Header />
    <NavBar />
    <Login />
    <Clouds />
    <div class="page-content">
      <div class="edge">
        <img
          src="@/assets/images/questions/example_question.png"
          class="example_question"
        />
        <img
          src="@/assets/images/questions/speghatti_question.png"
          class="speghatti_question"
        />
        <img src="@/assets/images/questions/issue2.png" class="issue2" />
      </div>
      <form
        v-bind="form"
        @submit.prevent="submitFormData"
        id="questionForm"
        class="container"
      >
        <Button isRouter to="/periodical" isImage class="buttonHeader">
          <img src="@/assets/images/periodical_logo.png" alt="" />
        </Button>
        <p>LEAVE THE INFO YOU WANT DISPLAYED IN MY ZINE :)</p>
        <input v-model="name" class="name text" placeholder="Name (optional)" />
        <input
          v-model="contact"
          class="contact text"
          placeholder="@ or Business (optional)"
        />
        <p>LEAVE BLANK FOR -ANONYMOUS</p>
        <textarea
          v-model="question"
          class="question text"
          placeholder="Your Question Here"
        ></textarea>
        <Button type="submit" id="submit">Submit</Button>
      </form>
      <div class="bottom">
        <img
          src="@/assets/images/questions/peter_question.png"
          class="peter_question"
        />
        <img
          src="@/assets/images/questions/superkid_quesion.png"
          class="superkid_quesion"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import Header from "../components/Header.vue";
import NavBar from "../components/NavBar.vue";
import Login from "./auth/Login.vue";
import Clouds from "../components/Clouds.vue";
import Button from "../components/Button.vue";
import { ref } from "vue";
import { useDb } from "@/store/database";
import { ref as dbRef, push, serverTimestamp } from "firebase/database";

const Db = useDb();
const db = Db.db;
const name = ref("");
const contact = ref("");
const question = ref("");

function submitFormData() {
  console.log(name.value, contact.value, question.value);

  // Push the form data to the database
  push(dbRef(db, "questions"), {
    name: name.value,
    question: question.value,
    contact: contact.value,
    timestamp: serverTimestamp(),
  })
    .then(function () {
      alert("Question submitted successfully!");
      // Clear form fields after submission
      question.value = '';
      name.value = '';
      contact.value = '';
    })
    .catch(function (error) {
      console.error("Error submitting question:", error);
      alert("An error occurred. Please try again later.");
    });
}
</script>

<style scoped>

p {
  font-size: 12px;
}

.clouds {
  position: absolute;
  width: 100vw;
  z-index: -100;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.issue2 {
  position: absolute;
  max-width: 20vw;
  top: 7px;
  left: 20%;
  transform: rotate(-9deg);
}

.name {
  width: 116px;
  margin: 0 auto;
}

.question {
  margin: 0;
  height: 33vh;
  width: 33%;
  max-width: 50vw;
}

.contact {
  width: 180px;
  margin: 0 auto;
  margin-top: 15px;
}

.text {
  font-family: "Sans";
  font-size: 12px;
  background-color: rgba(122, 170, 231, 0.671);
  border: 1.5px solid #0084ff9a;
  border-radius: 8px;
}

.text:focus {
  outline: none;
  background-color: rgba(173, 208, 253, 0.856);
  border: 1.5px solid #0084ffea;
  border-radius: 8px;
}

.buttonHeader {
  margin-bottom: -12px;
  width: 25%;
  animation: floatUpDown 1.5s ease-in-out infinite alternate;
}

@keyframes floatUpDown {
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(-3px);
    /* Adjust the distance you want the image to float up and down */
  }
}

.edge {
  position: relative;
  top: 0px;
  left: 0px;
  width: 100vw;
}

.superkid_quesion {
  position: absolute;
  bottom: 80px;
  left: 0px;
  max-width: 250px;
  width: 24vw;
}

@media only screen and (min-width: 768px) {
  /* Styles for wider views */
  .superkid_quesion {
    position: absolute;
    bottom: 80px;
    left: 5%;
    max-width: 250px;
    width: 24vw;
  }

  .speghatti_question {
    position: absolute;
    top: 5vh;
    right: 125px;
    width: 20vw;
  }

  .example_question {
    position: absolute;
    top: 115px;
    left: 4vw;
    width: 25vw;
  }

  .peter_question {
    position: absolute;
    bottom: 0vh;
    right: 5px;
    width: 25vw;
    max-width: 240px;
  }
}

@media only screen and (max-width: 767px) {
  /* Styles for narrower views */
  .superkid_quesion {
    position: absolute;
    bottom: 180px;
    left: -2px;
    max-width: 250px;
    width: 24vw;
  }

  .speghatti_question {
    position: absolute;
    top: 135px;
    right: 25px;
    width: 20vw;
  }

  .example_question {
    position: absolute;
    top: 100px;
    left: 5px;
    width: 25vw;
  }

  .peter_question {
    position: absolute;
    bottom: 40px;
    right: 0px;
    width: 25vw;
    max-width: 240px;
  }
}

.bottom {
  padding-top: 20px;
  position: relative;
}

#submit {
  margin-top: 1vw;
  margin-bottom: 3vw;
}

</style>
