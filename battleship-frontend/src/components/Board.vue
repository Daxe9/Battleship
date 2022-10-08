<script lang="ts" setup>
import type {Cell} from "@/types/interfaces";
import CellComponent from "@/components/CellComponent.vue"

const neighbors: Array<Array<number>> = [
	[-1, -1],
	[-1, 0],
	[-1, 1],
	[0, -1],
	[0, 1],
	[1, -1],
	[1, 0],
	[1, 1]
];

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

function cellValidation(x: number, y: number): boolean {
	let isValid: boolean = true;
	for (let i = 0; i < neighbors.length; ++i) {
		try {
			if (props.board[x + neighbors[i][0]][y + neighbors[i][1]].isShip) {
				isValid = false;
				break;
			}
		} catch (e) {
		}
	}
	return isValid;
}

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
				:id="i + '_' + j"
				:key="j"
				:color="checkCellColor(i, j)"
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