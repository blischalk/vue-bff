<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <main class="container">
    <nav>
    </nav>
    <nav>
      <ul>
        <li><strong>Vue.js BFF</strong></li>
      </ul>
      <ul>
        <li><RouterLink to="/">Home</RouterLink></li>
        <li v-if="$store.state.isAuthenticated"><RouterLink to="/dashboard">Dashboard</RouterLink></li>
        <li v-if="!$store.state.isAuthenticated"><a href="/backend/login">Login</a></li>
        <li v-if="$store.state.isAuthenticated"><a href="/backend/logout">Logout</a></li>
      </ul>
    </nav>
    <RouterView />
  </main>

</template>

<style scoped>
</style>
