<script setup>
import Header from '../components/Header.vue'
import NavBar from '../components/NavBar.vue'
import Login from './auth/Login.vue'
import Clouds from '../components/Clouds.vue'
import Button from '../components/Button.vue'
</script>

<template>
    <div class="home">
        <Header />
        <NavBar />
        <Login />
        <div class="page-content">
            <div style="display: flex; flex-direction: column; width: 80%; margin: auto; align-items: center;">
                <h1>Updated list of places
                    <br>that carry my comics!
                </h1>

                <iframe src="https://www.google.com/maps/d/u/0/embed?mid=15j6SUwo6iB4O5wqUW4X2nZ8lhhq-xcE&ehbc=2E312F"
                    width="600" height="450" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false"
                    tabindex="0"></iframe>

                <div id="List">
                    <p class="centeredText">
                        <span id="ListTitleSub">If you have any suggestions Email me!<br>
                            oneeyedsuperkid@gmail.com<br></span>
                    </p>
                    <p>
                        <span id="ListTitleSub"> Chicago <br></span>
                        <br>
                        Cosmic Bikes<br>
                        Howling Pages<br>
                        Maximum Distractions<br>
                        Quimbys<br>
                        Third Coast Comics<br>
                        Alleycat Comics<br>
                        Women and Children First Bookstore<br>
                        Zombie Unicorn Comics<br>
                        First Aid Comics (Taylor)<br>
                        Hell Yeah Comics (Skokie)<br>
                        <br>
                        <span id="ListTitleSub">Michigan<br></span>
                        <br>
                        Rabbit Hole Comics (Hartford)<br>
                        <br>
                        <span id="ListTitleSub">Indiana<br></span>
                        <br>
                        The Green Door Bookstore (Hobart) <br>
                    </p>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
</script>

<style scoped>

.page-content {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: auto;
}

.text {
    font-feature-settings: "ss01" on;
    font-feature-settings: "ss02" on;
    font-feature-settings: "ss03" on;
    font-feature-settings: "ss04" on;
    font-feature-settings: "ss05" on;
    font-feature-settings: "ss06" on;
    font-feature-settings: "ss07" on;
    font-feature-settings: "ss08" on;
}
</style>