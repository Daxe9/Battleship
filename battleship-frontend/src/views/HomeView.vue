<script setup lang="ts">
import {useRouter} from "vue-router";
import {ref} from "vue";
import type {Cell} from "@/types/interfaces";

const router = useRouter();

function connectToServer(): void {
    router.push("/game");
}

const gridWidth = 10;
const matrix = ref<Array<Array<Cell>>>([])
for (let i = 0; i < gridWidth; i++) {
    const temp: Array<Cell> = [];
    for (let j = 0; j < gridWidth; j++) {
        temp.push({visible: false, isShip: false})
    }
    matrix.value.push(temp);
}

</script>

<template>
    <div>
        <button @click="connectToServer">
            Search for game
        </button>
    </div>
</template>
