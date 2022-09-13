<script setup lang="ts">
import CoordinatesInput from "@/components/CoordinatesInput.vue";

import {reactive, ref, watch} from "vue";
import {io, Socket} from "socket.io-client"

interface Secret {
    roomName: string
    x: number,
    y: number
}

const isUserConnected = ref<boolean>(false);
const sendingCoordinates = ref<boolean>(false);
const coordinates = reactive<Secret>({
    roomName: "",
    x: 0,
    y: 0
});
const URL = "http://localhost:3000";

function connectToServer(): void {
    const socket: Socket = io(URL);
    socket.on("connect", () => {
        console.log("Connected to server");
        isUserConnected.value = true;

        socket.emit("searchForGame");
        socket.on("startGame", (data: string) => {
            console.log("Game started");
            coordinates.roomName = data;
        })

        socket.on("testing", (data: Secret) => {
            console.log(data);
        })
    });

    watch([isUserConnected, sendingCoordinates], ([newIsUserConnected, newSendingCoordinates]) => {
        if (!newIsUserConnected) {
            socket.disconnect()
        }
        if (newSendingCoordinates) {
            socket.emit("testing", JSON.parse(JSON.stringify(coordinates)));
            sendingCoordinates.value = false;
        }
    })
}

function disconnect(): void {
    isUserConnected.value = false;
}

function getCoordinates(newCo: Secret): void {
    coordinates.x = newCo.x;
    coordinates.y = newCo.y;
    sendingCoordinates.value = true;
}

</script>

<template>
    <div>
        <button @click="connectToServer" :disabled="isUserConnected">
            Search for game
        </button>
        <button @click="disconnect" :disabled="!isUserConnected">
            Disconnect
        </button>
        <CoordinatesInput @coordinates="getCoordinates"/>
    </div>
</template>
