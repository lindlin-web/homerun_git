import { BallNode } from "./BallNode";

export class Group {
    private balls:BallNode[] = [];

    public clear() {
        this.balls = [];
    }

    public init() {
        this.balls = [];
    }

    public addBall(ball:BallNode) {
        let _b:BallNode = ball.clone();
        this.balls.push(_b);
    }
}