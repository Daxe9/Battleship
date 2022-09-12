import express from "express"
import http from "http"
import {Server, Socket} from "socket.io"
import MatchHandler from "./MatchHandler";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {origin: "*"},
});
let players: Array<Socket> = [];

function gettingGameConnection(socket: Socket) {

}

io.on("connection", (socket: Socket) => {
    console.log(`${socket.id}  connected`);

    socket.on("searchForGame", () => {
        let hasSocket: boolean = false;
        players.forEach((player: Socket) => {
            if (player.id === socket.id) {
                hasSocket = true;
            }
        })
        if (!hasSocket) {
            players.push(socket);
        }
        if (players.length === 2) {
            console.log("two players found");
            const newMatch = new MatchHandler(io, players[0], players[1]);
            newMatch.startGame();
            players = [];
        }
    })


    socket.on("disconnect", () => {
        console.log(`${socket.id} disconnected`);
    });
});

server.listen(3000, () => {
    console.log("listening on *:3000");
})