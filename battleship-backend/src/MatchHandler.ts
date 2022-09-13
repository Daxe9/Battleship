import {Server, Socket} from "socket.io"

export interface Coordinates {
    x: number;
    y: number;
    roomName: string;
}

export default class MatchHandler {
    public players: Array<Socket> = [];
    public server: Server;
    public roomName: string;
    public turn: boolean = true;

    get currentPlayer() {
        return this.turn ? this.players[0] : this.players[1];
    }

    constructor(server: Server, socket1: Socket, socket2: Socket) {
        this.players.push(socket1, socket2);
        this.roomName = (socket1.id + Math.floor(Math.random() * 9) + socket2.id).toString();
        socket1.join(this.roomName);
        socket2.join(this.roomName);
        this.server = server;
        this.startGame()
    }


    public startGame() {
        this.server.to(this.roomName).emit("startGame", this.roomName);
    }

    public turnHandler(st: Socket) {
        console.log("enter in turn handler")
        st.on("testing", (coordinates: Coordinates) => {
            console.log("received coordinates")
            console.log(st.id);
            if (st.id === this.currentPlayer.id) {
                console.log("valid turn")
                this.turn = !this.turn;
                st.to(this.roomName).emit("testing", coordinates);
            }
        })
    }
}

