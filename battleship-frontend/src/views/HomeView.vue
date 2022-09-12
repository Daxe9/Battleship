<script setup lang="ts">
import CoordinatesInput from "@/components/CoordinatesInput.vue";

import {ref, watch} from "vue";
import {io, Socket} from "socket.io-client"


const isUserConnected = ref<boolean>(false);

const URL = "http://localhost:3000";

function connectToServer(): void {
    const socket: Socket = io(URL);
    socket.on("connect", () => {
        console.log("Connected to server");
        isUserConnected.value = true;

        socket.emit("searchForGame");
        socket.on("startGame", (data: any) => {
            console.log("Game started");
        });
        if (!isUserConnected.value) {
            socket.disconnect()
        }
    });

    watch(isUserConnected, (newValue) => {
        if (!newValue) {
            socket.disconnect()
        }
    })
}

function disconnect(): void {
    isUserConnected.value = false;
}

function getCoordinates(coordinates: any): void {
    console.log(coordinates);
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
