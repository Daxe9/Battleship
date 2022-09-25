import express from "express"
import http from "http"
import SocketManager from "./socketManager";

const app = express();
const server = http.createServer(app);

const socketManager: SocketManager = new SocketManager(server, {cors: {origin: "*"}});
socketManager.listen()

server.listen(3000, () => {
    console.log("listening on *:3000");
});