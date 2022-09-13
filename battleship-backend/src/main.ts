import express from "express"
import http from "http"
import {Server, Socket} from "socket.io"
import MatchHandler, {Coordinates} from "./MatchHandler";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {origin: "*"},
});
let players: Array<Socket> = [];
const matches: Array<MatchHandler> = [];

// function turnHandler(matchHandler: MatchHandler, st: Socket): void {
//     console.log("enter in turn handler")
//     st.on("testing", (coordinates: Coordinates) => {
//         console.log("received coordinates from " + st.id)
//         if (st.id === matchHandler.currentPlayer) {
//             console.log("valid turn")
//             matchHandler.turn = !matchHandler.turn;
//             st.to(matchHandler.roomName).emit("testing", coordinates);
//         }
//     })
//     console.log("exit from turn handler")
// }

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
            console.log("two players found, created a new match");
            const newMatch: MatchHandler = new MatchHandler(io, players[0], players[1]);
            matches.push(newMatch);

            // newMatch.startGame();
            // newMatch.turnHandler(socket);

            players = [];
        }
    })
    socket.on("testing", (coordinates: Coordinates) => {
        for (let match of matches) {
            if (match.roomName === coordinates.roomName) {
                console.log("received coordinates from " + socket.id)
                if (socket.id === match.currentPlayer.id) {
                    console.log("valid turn")
                    match.turn = !match.turn;
                    socket.to(match.roomName).emit("testing", coordinates);
                }
            }
        }
    })

    socket.on("disconnect", () => {
        console.log(`${socket.id} disconnected`);
    });
});

server.listen(3000, () => {
    console.log("listening on *:3000");
});