<script setup>
</script>

<template>
    <h1>Vue.js SPA with Backend For Front-End</h1>
    <p>This is a Vue.js SPA that uses an Nginx reverse proxy to serve an Express.js backend on the same domain as the SPA. In addition, the Express.js backend: </p>
    <ul>
      <li>Utilizes Passport.js and passport-oauth2 to implement OIDC authentication with Okta.</li>
      <li>Utilizes standard web cookies for authenticated sessions</li>
      <li>Demonstrates authenticated backend-served api content</li>
      <li>Demonstrates proxying micro-service requests through the backend-for-frontend to a backing service.</li>
    </ul>
</template>

<style scoped>
</style>
