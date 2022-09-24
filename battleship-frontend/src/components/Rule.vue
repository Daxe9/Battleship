<script setup lang="ts">
import CellComponent from "@/components/CellComponent.vue"</script>
<template>
    <div class="description">
        <div class="description-block">
            <CellComponent color="red"/>
            <p class="description-text">Hit ship</p>
        </div>
        <div class="description-block">
            <CellComponent color="orange"/>
            <p class="description-text">Explored</p>
        </div>
        <div class="description-block">
            <CellComponent color="green"/>
            <p class="description-text">Unexplored</p>
        </div>
        <div class="description-block">
            <CellComponent color="blue"/>
            <p class="description-text">Ship placed by you</p>
        </div>
    </div>
</template>

<style scoped>
.description {
    border-radius: 20%;
    border: 1px solid lightgrey;
    width: fit-content;
    padding: 1vw;
}

.description-block {
    display: flex;
    align-items: center;
}

.description-text {
    margin-left: 1vw;
    font-weight: 600;
    font-size: 20px;
    font-family: Cantarell, sans-serif;
}
</style>