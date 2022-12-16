import { exit } from "process";
import AbstractRunner from "../../types/runner";
import { HashMap } from "../../util";

enum State {
    Rock = '#',
    Air = '.',
    FallingSand = 's',
    AtRestSand = 'o',
    Start = '+'
};

function parseMap(input: string) {
    const lines = input.split('\r\n');

    const map: HashMap<[number, number], State> = new HashMap(
        [],
        ((lhs, rhs) => lhs[0] === rhs[0] && lhs[1] === rhs[1]),
    );

    map.set([500, 0], State.Start);

    lines.forEach(l => {
        const rockPaths = l.split(' -> ');

        let currentPath = rockPaths[-1];
        let nextPath = rockPaths[0];

        for (let idx = 0; idx < rockPaths.length - 1; ++idx) {
            currentPath = nextPath;
            nextPath = rockPaths[idx + 1];

            const [currentX, currentY] = currentPath.split(',')
                .map(s => Number(s));

            const [nextX, nextY] = nextPath.split(',')
                .map(s => Number(s));

            if (currentX === nextX) {
                if (currentY < nextY) {
                    for (let j = currentY; j <= nextY; ++j) {
                        map.set([currentX, j], State.Rock);
                    }
                } else {
                    for (let j = nextY; j <= currentY; ++j) {
                        map.set([currentX, j], State.Rock);
                    }
                }
            } else {
                if (currentX < nextX) {
                    for (let i = currentX; i <= nextX; ++i) {
                        map.set([i, currentY], State.Rock);
                    }
                } else {
                    for (let i = nextX; i <= currentX; ++i) {
                        map.set([i, currentY], State.Rock);
                    }
                }
            }
        }
    });

    return map;
}

function nextLocation(map: HashMap<[number, number], State>,
    currentLocation: [number, number])
    : [number, number] {
    const [currX, currY] = currentLocation;

    const down = map.get([currX, currY + 1]);
    const downLeft = map.get([currX - 1, currY + 1]);
    const downRight = map.get([currX + 1, currY + 1]);

    if (!down || down === State.Air) {
        return [currX, currY + 1];
    }

    if (!downLeft || downLeft === State.Air) {
        return [currX - 1, currY + 1];
    }

    if (!downRight || downRight === State.Air) {
        return [currX + 1, currY + 1];
    }

    return currentLocation;
}

namespace First {
    export function run(input: string): number {
        const map = parseMap(input);

        let maxY = -1;
        let maxX = -1;
        let minX = Infinity;
        for (const [k] of map.entries()) {
            if (k[1] > maxY) {
                maxY = k[1];
            }

            if (k[0] > maxX) {
                maxX = k[0];
            }

            if (k[0] < minX) {
                minX = k[0];
            }
        }

        const positions: [number, number][] = [[500, 0]];

        while (true) {
            const current = positions[positions.length - 1];

            const next = nextLocation(map, current);

            if (next[0] === current[0] && next[1] === current[1]) {
                positions.pop();
                map.set(current, State.AtRestSand);
                continue;
            }

            if (!(current[0] === 500 && current[1] === 0)) {
                map.set(current, State.Air);
            }

            if (next[1] >= maxY) {
                break;
            }

            positions.push(next);
            map.set(next, State.FallingSand);
        }

        return [...map.entries()].reduce((acc, next) => {
            if (next[1] === State.AtRestSand) {
                return acc + 1;
            }

            return acc;
        }, 0);
    }
}


namespace Second {
    export function run(input: string): number {
        const map = parseMap(input);

        const get = map.get.bind(map);

        map.get = ((k: [number, number]) => {
            const [_x, y] = k;
            if (y === maxY + 2) {
                return State.Rock;
            }

            return get(k);
        });

        let maxY = -1;
        let maxX = -1;
        let minX = Infinity;
        for (const [k] of map.entries()) {
            if (k[1] > maxY) {
                maxY = k[1];
            }

            if (k[0] > maxX) {
                maxX = k[0];
            }

            if (k[0] < minX) {
                minX = k[0];
            }
        }

        const positions: [number, number][] = [[500, 0]];

        while (true) {
            const current = positions[positions.length - 1];

            const next = nextLocation(map, current);

            if (next[0] === current[0] && next[1] === current[1]) {
                if (current[0] === 500 && current[1] === 0) {
                    break;
                }

                positions.pop();
                map.set(current, State.AtRestSand);
                continue;
            }

            if (!(current[0] === 500 && current[1] === 0)) {
                map.set(current, State.Air);
            }

            positions.push(next);
            map.set(next, State.FallingSand);
        }

        return [...map.entries()].reduce((acc, next) => {
            if (next[1] === State.AtRestSand) {
                return acc + 1;
            }

            return acc;
        }, 1);
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