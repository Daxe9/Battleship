import {Server, Socket} from "socket.io";
import MatchHandler, {Coordinates} from "./classes/MatchHandler";

import {Server as httpServer} from "http"
import {Mark} from "./types/interfaces";


export default class SocketManager {
    public ioServer: Server;
    private connectedPlayers: Array<Socket> = [];
    private matches: Array<MatchHandler> = [];

    constructor(server: httpServer, serverArgs: any) {
        this.ioServer = new Server(server, serverArgs);
    }

    public listen(): void {
        this.ioServer.on("connection", (socket: Socket) => {
            console.log(`${socket.id}  connected`);
            this.searchGame(socket);
            this.designBoard(socket);
            this.receiveCoordinates(socket);
            this.disconnection(socket);
        })
    }

    private searchGame(socket: Socket): void {
        socket.on("searchForGame", () => {
            // check if the connection is already registered
            if (!this.connectedPlayers.find(player => player.id === socket.id)) {
                this.connectedPlayers.push(socket);
            }

            // when there are 2 this.connectedPlayers, create a match
            if (this.connectedPlayers.length === 2) {
                const newMatch: MatchHandler = new MatchHandler(
                    this.ioServer,
                    this.connectedPlayers[0],
                    this.connectedPlayers[1]);
                this.matches.push(newMatch);
                this.connectedPlayers = [];
            }
        })
    }

    private designBoard(socket: Socket): void {
        // event for receiving designed board from the clients
        socket.on("designBoard", (info: Mark) => {
            for (let match of this.matches) {
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
                        this.ioServer.to(match.roomName).emit("startGame", {
                            roomName: match.roomName,
                            nextPlayerId: match.players[0].socket.id
                        });
                    }
                    break;
                }
            }
        })
    }

    private receiveCoordinates(socket: Socket): void {
        socket.on("coordinates", (coordinates: Coordinates) => {
            for (let match of this.matches) {
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
                                this.ioServer.to(match.roomName).emit("winner", socket.id);
                            }
                            // change status of the cell
                            isHit = true;
                        } else {
                            // change player's turn
                            match.turn = !match.turn;
                        }

                        // send the coordinates, the player who's been hit
                        this.ioServer.to(match.roomName).emit("ingameInfoExchange", {
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
    }

    private disconnection(socket: Socket): void {
        socket.on("disconnect", () => {
            const socketId: string = socket.id;

            // if one player disconnect then delete it from waiting list
            for (let player of this.connectedPlayers) {
                if (player.id === socketId) {
                    this.connectedPlayers.splice(this.connectedPlayers.indexOf(player), 1);
                }
            }
        });
    }
}