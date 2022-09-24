export interface Secret {
    roomName: string
    x: number,
    y: number
}

export interface Coordinates {
    x: number,
    y: number
}

export interface Mark {
    roomName: string;
    args: any
}


export interface Cell {
    visible: boolean;
    isShip: boolean;
}