import {Server, Socket} from "socket.io"
import {Cell} from "../types/interfaces";

export interface Coordinates {
    roomName: string;
    args: any
}

interface Player {
    socket: Socket;
    game: {
        board: Array<Array<Cell>>,
        ships: number
    };
}

export default class MatchHandler {
    public players: Array<Player> = [];
    public server: Server;
    public roomName: string;
    public turn: boolean = true;
    public readyPlayers: number;

    get currentPlayer() {
        return this.turn ? this.players[0] : this.players[1];
    }

    get otherPlayer() {
        return !this.turn ? this.players[0] : this.players[1];
    }


    constructor(server: Server, socket1: Socket, socket2: Socket) {
        this.players.push(
            {
                socket: socket1,
                game: {
                    board: [],
                    ships: 0
                }
            },
            {
                socket: socket2,
                game: {
                    board: [],
                    ships: 0
                }
            });
        this.roomName = socket1.id + Math.floor(Math.random() * 9) + socket2.id;
        socket1.join(this.roomName);
        socket2.join(this.roomName);
        this.server = server;
        this.startDesign()
        this.readyPlayers = 0;
    }

    private startDesign() {
        this.server.to(this.roomName).emit("startDesign", this.roomName);
    }

}

