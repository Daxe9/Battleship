<script lang="ts" setup>
import type {Cell} from "@/types/interfaces";
import {defineProps} from "vue";

const props = defineProps<{
    matrix: Array<Array<Cell>>
}>()

function test(x: number, y: number): void {
    console.log(x, y);
    document.getElementById(x + "_" + y)!.style.backgroundColor = "rgba(255, 0, 0, 0.03)";
    document.getElementById(x + "_" + y)!.style.borderColor = "red";
}

function checkCellColor(x: number, y: number): string {
    console.log(x, y)
    console.log(props.matrix[x][y].visible)
    if (props.matrix[x][y].visible && props.matrix[x][y].isShip) {
        return "red"
    }
    if (props.matrix[x][y].visible) {
        return "orange"
    } else {
        return "green"
    }
}

</script>

<template>
    <div class="container">
        <div v-for="(row, i) in matrix" :key="i" class="row">
            <div v-for="(cell, j) in row" :key="j" class="cell" :class="checkCellColor(i, j)" :id="i + '_' + j"
                 @click="test(i, j)">

            </div>
        </div>
    </div>
</template>


<style scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.row {
    display: flex;
}

.cell {
    background-color: rgba(0, 255, 0, 0.03);
    width: 6vh;
    height: 6vh;
    border: 2px solid green;
    border-radius: 0.4em;
    margin: 0.5px;
}

.red {
    background-color: rgba(255, 0, 0, 0.03);
    border-color: red;
}

.green {
    background-color: rgba(0, 255, 0, 0.03);
    border-color: green;
}

.orange {
    background-color: rgba(255, 165, 0, 0.03);
    border-color: orange;
}
</style>