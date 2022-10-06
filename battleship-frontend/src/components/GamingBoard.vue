<script lang="ts" setup>
import type {Cell, Coordinates} from "@/types/interfaces";
import Board from "@/components/Board.vue"
import Rule from "@/components/Rule.vue"

const emit = defineEmits(["submitDesign", "submitCoordinates"]);

const props = defineProps({
    isDesign: {
        required: true,
        type: Boolean
    },
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
        <h1 v-if="isDesign"> Design your board </h1>
        <div class="game-board">
            <div>
                <h2>This is your board</h2>
                <Board
                    :board="props.designedBoard"
                    :isDesign="isDesign"
                    :turn="false"/>
            </div>
            <Rule class="rule-description"/>
            <div class="spacer"></div>
            <div>
                <h2>This is enemy's board</h2>
                <Board
                    :board="props.enemyBoard"
                    :isDesign="false"
                    :turn="turn"
                    @submitCoordinates="submitCoordinates"/>
            </div>
        </div>
        <button v-if="isDesign" @click="submitDesign">
            Submit the design
        </button>
    </div>
</template>


<style scoped>
/* 743*/
.game-board {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.spacer {
    display: none;
}

@media screen and (max-width: 743px) {
    .game-board {
        flex-direction: column;
    }

    .rule-description {
        display: none;
    }

    .spacer {
        display: block;
        margin: 10px 0;
    }
}

.title {
    font-size: 3vw;
}


</style>