<script setup lang="ts">
import {useRouter} from "vue-router";
import {ref} from "vue";
import type {Cell} from "@/types/interfaces";

const router = useRouter();

function connectToServer(): void {
    router.push("/game");
}


</script>

<template>
    <div>
        <button @click="connectToServer">
            Search for game
        </button>
    </div>
</template>
