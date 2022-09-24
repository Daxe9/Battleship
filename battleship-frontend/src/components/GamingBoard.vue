<script lang="ts" setup>
import type {Cell, Coordinates} from "@/types/interfaces";
import Board from "@/components/Board.vue"
import Rule from "@/components/Rule.vue"

const emit = defineEmits(["submitDesign", "submitCoordinates"]);

const props = defineProps({
    title: String,
    isDesign: Boolean,
    designedBoard: {
        required: true,
        type: Array<Array<Cell>>
    },
    enemyBoard: {
        required: true,
        type: Array<Array<Cell>>
    },
    turn: {
        required: true,
        type: Boolean
    }
})

function submitDesign(): void {
    emit("submitDesign");
}

function submitCoordinates(coordinates: Coordinates): void {
    emit("submitCoordinates", coordinates);
}
</script>

<template>
    <div>
        <div class="title">
            {{ props.title }}
        </div>
        <div class="game-board">
            <Board
                :board="props.designedBoard"
                :isDesign="isDesign"
                :turn="false"/>
            <Rule/>
            <Board
                :board="props.enemyBoard"
                :isDesign="false"
                :turn="turn"
                @submitCoordinates="submitCoordinates"/>
        </div>
        <button v-if="isDesign" @click="submitDesign">
            Submit the design
        </button>
    </div>
</template>


<style scoped>
.game-board {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.title {
    font-size: 3vw;
}


</style>