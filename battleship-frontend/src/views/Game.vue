<script setup lang="ts">
import {reactive, ref} from "vue";
import {io, Socket} from "socket.io-client";
import {useRouter} from "vue-router";
import GamingBoard from "@/components/GamingBoard.vue";
import type {Cell, Coordinates, Mark} from "@/types/interfaces";

const sendingCoordinates = ref<boolean>(false);
const router = useRouter();

const gridWidth: number = 10;

// our board
const designedBoard = ref<Array<Array<Cell>>>([])
// enemy board
const enemyBoard = ref<Array<Array<Cell>>>([])

const hasWinner = ref<boolean>(false);

for (let i = 0; i < gridWidth; i++) {
    const t1: Array<Cell> = [];
    const t2: Array<Cell> = [];
    for (let j = 0; j < gridWidth; j++) {
        t1.push({visible: false, isShip: false})
        t2.push({visible: false, isShip: false})
    }
    designedBoard.value.push(t1);
    enemyBoard.value.push(t2)
}
const coordinatesMark = reactive<Mark>({
    roomName: "",
    args: {
        x: 0,
        y: 0
    }
});
const isDesign = ref<boolean>(false);
const showText = ref<boolean>(false);

const ourTurn = ref<boolean>(false);
const URL = "http://localhost:3000";
const socket: Socket = io(URL);
socket.on("connect", () => {
    socket.emit("searchForGame");
    socket.on("startDesign", (data: string) => {
        // design the board
        isDesign.value = true;
        coordinatesMark.roomName = data;
    })

    socket.on("startGame", (data: any) => {
        // deciding ourTurn value based on reiceved player id
        ourTurn.value = data.nextPlayerId === socket.id;
        showText.value = true;
    })

    socket.on("ingameInfoExchange", (info: any) => {
        // if hit player is our, change designBoard
        if (info.hitPlayerId === socket.id) {
            designedBoard.value[info.coordinates.x][info.coordinates.y].visible = true;
        } else {
            // if we hit the other player, change the visibility
            if (info.isHit) {
                enemyBoard.value[info.coordinates.x][info.coordinates.y].isShip = true;
            }
        }
        // deciding our turn based on server's information
        ourTurn.value = info.nextPlayerId === socket.id
    })

    // TODO: better winner celebration
    socket.on("winner", async (winnerId: string) => {
        console.log("winner is " + winnerId);
        if (winnerId === socket.id) {
            alert("You won!");
        } else {
            alert("You lost!");
        }

        await disconnect();
        await router.push("/");
    })
});

async function disconnect(): Promise<void> {
    await socket.disconnect()
    await router.push({name: "home"});
}

// count how many ship are in our board
function counterShip(matrix: Array<Array<Cell>>): number {
    let counter: number = 0;
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j].isShip) {
                counter++;
            }
        }
    }
    return counter;
}

// submit our board to the server
function submitDesign(): void {
    // submit the designed board to the server
    socket.emit("designBoard", {
        roomName: coordinatesMark.roomName,
        args: {
            board: JSON.parse(JSON.stringify(designedBoard.value)),
            ships: counterShip(designedBoard.value)
        }
    });

    isDesign.value = false;
}

// get coordinates from click and send it to the server
function getSubmittedCoordinates(coordinates: Coordinates): void {
    coordinatesMark.args.x = coordinates.x;
    coordinatesMark.args.y = coordinates.y;
    enemyBoard.value[coordinates.x][coordinates.y].visible = true;
    ourTurn.value = false;

    socket.emit("coordinates", JSON.parse(JSON.stringify(coordinatesMark)));
}

</script>

<template>
    <h1 v-if="showText">
        {{ ourTurn ? "Your turn" : "Enemy's turn" }}
    </h1>
    <!--    <button @click="test">-->
    <!--        Hi-->
    <!--    </button>-->
    <GamingBoard :designedBoard="designedBoard"
                 :enemyBoard="enemyBoard"
                 :title="isDesign ? 'Design your board please' : 'This is your board'"
                 :isDesign="isDesign"
                 :turn="ourTurn"
                 @submitDesign="submitDesign"
                 @submitCoordinates="getSubmittedCoordinates"
    />

    <button @click="disconnect">
        Disconnect
    </button>
    <!--    <CoordinatesInput @coordinates="getCoordinates"/>-->
</template>

<style scoped>

</style>