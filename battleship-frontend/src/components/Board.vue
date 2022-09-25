<script setup lang="ts">
import type {Cell} from "@/types/interfaces";
import CellComponent from "@/components/CellComponent.vue"

const emit = defineEmits(["submitCoordinates"]);
const props = defineProps({
    isDesign: {
        type: Boolean,
        required: true
    },
    board: {
        required: true,
        type: Array<Array<Cell>>
    },
    turn: {
        required: true,
        type: Boolean
    }
})

function changeCell(x: number, y: number) {
    if (props.isDesign) {
        props.board[x][y].isShip = true;
    } else {
        if (props.turn) {
            emit("submitCoordinates", {x, y});
        }
    }
}

function checkCellColor(x: number, y: number): string {
    if (props.board[x][y].visible && props.board[x][y].isShip) {
        return "red"
    }
    if (props.board[x][y].isShip) {
        return "blue";
    }

    if (props.board[x][y].visible) {
        return "orange"
    } else {
        return "green"
    }
}
</script>
<template>
    <div class="container">
        <div v-for="(row, i) in board" :key="i" class="row">
            <CellComponent
                v-for="(_, j) in row"
                :key="j"
                :color="checkCellColor(i, j)"
                :id="i + '_' + j"
                @click="changeCell(i, j)"
            >
            </CellComponent>
        </div>
    </div>
</template>
<style scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.row {
    display: flex;
}
</style>