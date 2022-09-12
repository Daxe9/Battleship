<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
    <div class="main-container">
        <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />
    </div>

    <RouterView />


</template>

<style scoped>
.main-container {
    padding: 0;
    height: 30vh;
    display: flex;
    justify-content: center;
}
</style>
