import express from "express"
import http from "http"
import {Server, Socket} from "socket.io"
import MatchHandler, {Coordinates} from "./classes/MatchHandler";
import {Mark} from "./types/interfaces";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {origin: "*"},
});
let players: Array<Socket> = [];
const matches: Array<MatchHandler> = [];

io.on("connection", (socket: Socket) => {
    console.log(`${socket.id}  connected`);

    socket.on("searchForGame", () => {
        // check if the connection is already registered
        if (!players.find(player => player.id === socket.id)) {
            players.push(socket);
        }

        // when there are 2 players, create a match
        if (players.length === 2) {
            const newMatch: MatchHandler = new MatchHandler(io, players[0], players[1]);
            matches.push(newMatch);
            players = [];
        }
    })

    // event for receiving designed board from the clients
    socket.on("designBoard", (info: Mark) => {
        for (let match of matches) {
            // find the match with given roomName
            if (match.roomName === info.roomName) {
                match.readyPlayers++;

                // take designed board and associate with player
                if (socket.id === match.players[0].socket.id) {
                    match.players[0].game.board = info.args.board;
                    match.players[0].game.ships = info.args.ships;
                } else {
                    match.players[1].game.board = info.args.board;
                    match.players[1].game.ships = info.args.ships;
                }

                // when both players are ready, start the game and send the first player's id
                if (match.readyPlayers === 2) {
                    io.to(match.roomName).emit("startGame", {
                        roomName: match.roomName,
                        nextPlayerId: match.players[0].socket.id
                    });
                }
                break;
            }
        }
    })

    //////////////////////////////////
    //////////////////////////////////

    socket.on("coordinates", (coordinates: Coordinates) => {
        for (let match of matches) {
            // find the match with given roomName
            if (match.roomName === coordinates.roomName) {


                // if the id is the same as the current player's id, continue
                if (socket.id === match.currentPlayer.socket.id) {
                    // set the other player's board's cell to visible based on current player's coordinates
                    match.otherPlayer.game.board[coordinates.args.x][coordinates.args.y].visible = true;
                    let hitPlayerId: string = match.otherPlayer.socket.id;
                    let isHit: boolean = false;
                    // if the other player's board's cell is a ship, change back
                    if (match.otherPlayer.game.board[coordinates.args.x][coordinates.args.y].isShip) {
                        // if the other player's board's cell is a ship, decrease the number of ships
                        match.otherPlayer.game.ships--;
                        // if the other player's ships are 0, send the winner's id
                        if (match.otherPlayer.game.ships === 0) {
                            io.to(match.roomName).emit("winner", socket.id);
                        }

                        isHit = true;
                    } else {
                        // change player's turn
                        match.turn = !match.turn;
                    }

                    // send the coordinates, the player who's been hit
                    io.to(match.roomName).emit("ingameInfoExchange", {
                        // player's id who is hit
                        hitPlayerId: hitPlayerId,
                        coordinates: coordinates.args,
                        nextPlayerId: match.currentPlayer.socket.id,
                        isHit
                    })
                    break;
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