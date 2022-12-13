<script>
export default {
    async created() {
        const authData = await fetch('/backend/auth/content');
        const authDataResp = await authData.json();
        if (authDataResp.message) {
            this.authMessage = authDataResp.message;
        }

        const proxiedData = await fetch('/backend/auth/proxied');
        const proxiedDataResp = await proxiedData.json();
        if (proxiedDataResp.message) {
            this.proxiedMessage = proxiedDataResp.message;
        }
    },

    data() {
        return {
            authMessage: null,
            proxiedMessage: null,
        }
    }
}
</script>

<template>
    <article>
        <header>
            <h1>Dashboard</h1>
            <p>Welcome. You are logged in.</p>
        </header>

        <h2 v-if="authMessage">Authenticated Message From Express.js BFF /backend/auth/content</h2>
        <p v-if="authMessage">{{authMessage}}</p>

        <h2 v-if="proxiedMessage">Proxied Message From Express.js BFF /backend/auth/proxied</h2>
        <p v-if="proxiedMessage">{{proxiedMessage}}</p>
    </article>
</template>
