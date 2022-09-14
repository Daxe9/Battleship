<script setup lang="ts">
import {reactive, ref, watch} from "vue";
import {io, Socket} from "socket.io-client";
import {useRouter} from "vue-router";
import GamingBoard from "@/components/GamingBoard.vue";
import CoordinatesInput from "@/components/CoordinatesInput.vue";
import type {Cell, Secret} from "@/types/interfaces";

const sendingCoordinates = ref<boolean>(false);
const router = useRouter();


const gridWidth: number = 10;
const matrix = ref<Array<Array<Cell>>>([])
for (let i = 0; i < gridWidth; i++) {
    const temp: Array<Cell> = [];
    for (let j = 0; j < gridWidth; j++) {
        temp.push({visible: false, isShip: false})
    }
    matrix.value.push(temp);
}
console.log(matrix)
const coordinates = reactive<Secret>({
    roomName: "",
    x: 0,
    y: 0
});

const URL = "http://localhost:3000";
const socket: Socket = io(URL);
socket.on("connect", () => {
    console.log("Connected to server");

    socket.emit("searchForGame");
    socket.on("startGame", (data: string) => {
        console.log("Game started");
        coordinates.roomName = data;
    })

    socket.on("testing", (data: Secret) => {
        matrix.value[data.x][data.y].visible = true;
    })
});

watch(sendingCoordinates, (newSendingCoordinates) => {
    if (newSendingCoordinates) {
        socket.emit("testing", JSON.parse(JSON.stringify(coordinates)));
        sendingCoordinates.value = false;
    }
})

async function disconnect(): Promise<void> {
    await socket.disconnect()
    await router.push({name: "home"});
}

function getCoordinates(newCo: Secret): void {
    coordinates.x = newCo.x;
    coordinates.y = newCo.y;
    sendingCoordinates.value = true;
}
</script>


<template>
    <GamingBoard :matrix="matrix"/>

    <button @click="disconnect">
        Disconnect
    </button>
    <CoordinatesInput @coordinates="getCoordinates"/>
</template>

<style scoped>

</style>