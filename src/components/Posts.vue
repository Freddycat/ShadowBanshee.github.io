<template>
  <div v-for="post in posts" :key="post.id" class="post">
    <h2>{{ post.subject }}</h2>
    <div v-html="post.content"></div>
    <img v-for="(url, index) in post.imageUrl" :key="index" :src="url" />
  </div>
  <div v-if="loading">Loading posts...</div>
  <div v-else-if="error">Error loading posts: {{ error }}</div>
  <div v-else-if="posts.length === 0">No posts available.</div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useUser } from '@/store/user';

const user = useUser();
const { posts, loading, error } = storeToRefs(user);

</script>
