import {Server, Socket} from "socket.io"

interface Coordinates {
    x: number;
    y: number;
}

export default class MatchHandler {
    public players: Array<Socket> = [];
    public server: Server;
    public roomName: string;
    private turn: boolean = true;

    get currentPlayer() {
        return this.turn ? this.players[0].id : this.players[1].id;
    }

    constructor(server: Server, socket1: Socket, socket2: Socket) {
        this.players.push(socket1, socket2);
        this.roomName = (socket1.id + Math.floor(Math.random() * 9) + socket2.id).toString();
        socket1.join(this.roomName);
        socket2.join(this.roomName);
        this.server = server;
        this.startGame();
    }


    public startGame() {
        this.server.to(this.roomName).emit("startGame");
    }

    public turnHandler(st: Socket) {
        st.on("testing", (coordinates: Coordinates) => {
            if (st.id === this.currentPlayer) {
                this.turn = !this.turn;
                this.server.to(this.roomName).emit("testing", coordinates);
            }
        })
    }
}

