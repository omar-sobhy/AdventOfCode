import AbstractRunner from "../../types/runner";
import { HashMap } from "../../util";

type Position = {
    x: number
    y: number
};

type State = {
    segments: number[]
    tailVisited: boolean
};

function hash(p: Position): string {
    return `${p.x},${p.y}`;
}

function equals(lhs: Position, rhs: Position): boolean {
    return lhs.x === rhs.x && lhs.y === rhs.y;
}

function isTouching(p1: Position, p2: Position): boolean {
    const stepsDiff = Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
    if (stepsDiff <= 1) {
        return true;
    }

    const xDiff = p1.x - p2.x;
    const yDiff = p1.y - p2.y;

    const magnitude = Math.sqrt(xDiff * xDiff + yDiff * yDiff);

    if (Math.abs(Math.sqrt(2) - magnitude) < Number.EPSILON) {
        return true;
    }

    return false;
}

class Grid {
    map: HashMap<Position, State> = new HashMap([], equals, hash);

    leastX = 0;
    leastY = 0;
    highestX = 0;
    highestY = 0;

    tailLength: number;
    segments: number[] = [];

    segmentPositions: Map<number, Position> = new Map();

    constructor(tailLength: number = 2) {
        this.tailLength = tailLength;
        for (let i = 0; i < tailLength; ++i) {
            this.segments.push(i);
            this.segmentPositions.set(i, {
                x: 0,
                y: 0,
            });
        }

        this.map.set({
            x: 0,
            y: 0
        }, {
            segments: [...this.segments],
            tailVisited: true,
        });
    }

    print(final = false) {
        const lines = [];
        for (let j = this.leastY; j <= this.highestY; ++j) {
            const row = [];
            for (let i = this.leastX; i <= this.highestX; ++i) {
                if (i === 0 && j === 0) {
                    row.push('s');
                } else {
                    const state = this.map.get({ x: i, y: j });
                    if (!state) {
                        row.push('.');
                        continue;
                    }

                    const segments = state.segments;

                    if (final) {
                        if (state.tailVisited) {
                            row.push('#');
                        } else {
                            row.push('.');
                        }
                    } else {
                        const lowest = segments.reduce((acc, next) => {
                            if (next < acc) {
                                return next;
                            }
    
                            return acc;
                        }, Infinity);
    
                        if (lowest === this.tailLength - 1) {
                            row.push('T');
                        } else if (lowest === 0) {
                            row.push('H');
                        } else if (lowest === Infinity) {
                            row.push('.');
                        } else {
                            row.push(lowest);
                        }
                    }
                }
            }

            lines.push(row.join(''));
        }

        console.log(lines.reverse().join('\n'), '\n');
    }

    moveRope(m: { direction: string, magnitude: number }) {
        const { direction, magnitude } = m;

        for (let i = 0; i < magnitude; ++i) {
            const head = this.segmentPositions.get(0)!;

            this.map.get(head)!.segments.pop();

            if (direction === 'L') {
                head.x -= 1;
            } else if (direction === 'R') {
                head.x += 1;
            } else if (direction === 'U') {
                head.y += 1;
            } else if (direction === 'D') {
                head.y -= 1;
            }

            if (!this.map.get(head)) {
                this.map.set({ ...head }, {
                    segments: [],
                    tailVisited: false,
                });
            }

            this.map.get(head)!.segments.push(0);
            
            this.segmentPositions.set(0, { ...head });

            if (head.x < this.leastX) {
                this.leastX = head.x;
            }

            if (head.x > this.highestX) {
                this.highestX = head.x;
            }

            if (head.y < this.leastY) {
                this.leastY = head.y;
            }

            if (head.y > this.highestY) {
                this.highestY = head.y;
            }

            for (let j = 1; j < this.tailLength; ++j) {
                const curr = this.segmentPositions.get(j)!;
                const prev = this.segmentPositions.get(j - 1)!;

                if (!isTouching(prev, curr)) {
                    this.map.get(curr)!.segments.pop();

                    if (prev.x !== curr.x
                        && prev.y !== curr.y) {
                            // move diagonally
                        const diff: Position = {
                            x: prev.x - curr.x,
                            y: prev.y - curr.y,
                        }

                        if (diff.x < 0 && diff.y > 0) {
                            // up left
                            curr.x -= 1;
                            curr.y += 1;
                        } else if (diff.x > 0 && diff.y > 0) {
                            // up right
                            curr.x += 1;
                            curr.y += 1;
                        } else if (diff.x < 0 && diff.y < 0) {
                            // down left
                            curr.x -= 1;
                            curr.y -= 1;
                        } else {
                            // down right
                            curr.x += 1;
                            curr.y -= 1;
                        }
                    } else if (Math.abs(prev.x - curr.x) > 1) {
                        // move horizontally
                        if (direction === 'L') {
                            curr.x -= 1;
                        } else {
                            curr.x += 1;
                        }
                    } else {
                        // move vertically
                        if (direction === 'D') {
                            curr.y -= 1;
                        } else {
                            curr.y += 1;
                        }
                    }

                    if (!this.map.get(curr)) {
                        this.map.set({ ...curr }, {
                            segments: [],
                            tailVisited: false,
                        });
                    }
                    
                    this.map.get(curr)!.segments.push(j);
                }
            }

            const tailPos = this.segmentPositions.get(this.tailLength - 1)!;
            this.map.get(tailPos)!.tailVisited = true;
        }
    }
}

namespace First {
    export function run(input: string): number {
        const lines = input.split('\r\n');

        const moves = lines.map(l => {
            const [direction, magnitude] = l.split(' ');

            return {
                direction,
                magnitude: Number(magnitude),
            };
        });

        const grid = new Grid();

        moves.forEach(m => {
            grid.moveRope(m);
        });

        const visitedNodes = [...grid.map.entries()].reduce((acc, next) => {
            const [_position, state] = next;
            if (state.tailVisited) {
                return acc + 1;
            }

            return acc;
        }, 0);

        return visitedNodes;
    }
}

namespace Second {
    export function run(input: string): number {
        const lines = input.split('\r\n');

        const moves = lines.map(l => {
            const [direction, magnitude] = l.split(' ');

            return {
                direction,
                magnitude: Number(magnitude),
            };
        });

        const grid = new Grid(10);

        moves.forEach(m => {
            grid.moveRope(m);
        });

        const visitedNodes = [...grid.map.entries()].reduce((acc, next) => {
            const [_position, state] = next;
            if (state.tailVisited) {
                return acc + 1;
            }

            return acc;
        }, 0);

        return visitedNodes;
    }
}

class Runner extends AbstractRunner {
    async run(input: string): Promise<{
        first: string,
        second: string,
    }> {
        return {
            first: String(First.run(input)),
            second: String(Second.run(input)),
        };
    }
}

export default Runner;