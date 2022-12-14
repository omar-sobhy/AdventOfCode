import AbstractRunner from "../../types/runner";
import { HashMap } from "../../util";

function neighbours(pos: [number, number]): [number, number][] {
    return [
        [pos[0] - 1, pos[1]],
        [pos[0] + 1, pos[1]],
        [pos[0], pos[1] - 1],
        [pos[0], pos[1] + 1],
    ];
}

function duplicate<T>(t: T, l: number): Array<T> {
    const handler: ProxyHandler<{ length: number }> = {
        get(target, prop) {
            if (prop === 'length') {
                return target.length;
            }

            if (prop === Symbol.iterator) {
                return undefined;
            }

            return t;
        },
    };

    const obj = {
        length: l,
    };

    const proxy = new Proxy(obj, handler);

    return Array.from(proxy);
}

function bfs(map: number[][],
    startPos: [number, number],
    endPos: [number, number]
): number {
    if (startPos[0] === endPos[0]
        && startPos[1] === endPos[1]) {
        return 0;
    }

    const visited = new HashMap<[number, number], boolean>(
        [],
        (lhs, rhs) => lhs[0] === rhs[0] && lhs[1] == rhs[1],
    );

    const parents = new HashMap<[number, number], [number, number]>(
        [],
        (lhs, rhs) => lhs[0] === rhs[0] && lhs[1] == rhs[1],
    );

    const queue: [number, number][] = [startPos];

    visited.set(startPos, true);

    while (queue.length !== 0) {
        let currentPos = queue.shift()!;

        if (currentPos[0] === endPos[0] && currentPos[1] === endPos[1]) {
            break;
        }

        const [x, y] = currentPos;
        const currentHeight = map[x][y];

        neighbours(currentPos).forEach(n => {
            if (visited.get(n)) {
                return;
            }

            const [x, y] = n;
            const neighbourHeight = map[x][y];
            if (neighbourHeight <= currentHeight + 1) {
                visited.set(n, true);
                parents.set(n, currentPos);
                queue.push(n);
            }
        });
    }

    let length = 0;

    const parentsArr = [];
    let [x, y] = endPos;
    parentsArr.unshift([x, y]);
    const [startX, startY] = startPos;
    while (x !== startX || y !== startY) {
        ++length;

        const n: [number, number] = [x, y];

        const parent = parents.get(n);
        if (!parent) {
            return Infinity;
        }

        [x, y] = parent;
        parentsArr.unshift([x, y]);
    }

    return length;
}

function dijkstra(map: number[][],
    startPos: [number, number],
    endPos: [number, number],
): number {
    const visited = new HashMap<[number, number], boolean>(
        [],
        (lhs, rhs) => lhs[0] === rhs[0] && lhs[1] == rhs[1],
    );

    const dist = new HashMap<[number, number], number>(
        [],
        (lhs, rhs) => lhs[0] === rhs[0] && lhs[1] == rhs[1],
    );

    const prev = new HashMap<[number, number], [number, number]>(
        [],
        (lhs, rhs) => lhs[0] === rhs[0] && lhs[1] == rhs[1],
    );

    const queue: [number, number][] = [];

    for (let i = 1; i < map.length - 1; ++i) {
        for (let j = 1; j < map[i].length - 1; ++j) {
            dist.set([i, j], Infinity);
            queue.push([i, j]);
        }
    }

    dist.set(endPos, 0);

    while (queue.length !== 0) {
        const [minNode] = ([...dist.entries()]).reduce((lhs, rhs) => {
            if (lhs[1] < rhs[1]) {
                return lhs;
            }

            return rhs;
        });

        const [minX, minY] = minNode;

        const idx = queue.findIndex((node) => {
            const [x, y] = node;

            return minX === x && minY === y;
        });

        queue.splice(idx);

        dist.delete(minNode);

        neighbours(minNode).forEach(n => {
            const [x, y] = n;
            map[x][y]
        });
    }

    return length;
}

namespace First {
    export function run(input: string): number {
        const map: number[][] = [];

        let startPos: [number, number] = [-1, -1];
        let endPos: [number, number] = [-1, -1];

        const data = input.split('\r\n').map(l => l.split(''));

        const height = data.length;
        const width = data[0].length;

        for (let i = 0; i < height + 2; ++i) {
            map.push(duplicate(Infinity, width + 2));
        }

        for (let i = 0; i < height; ++i) {
            for (let j = 0; j < width; ++j) {
                const c = data[i][j];

                if (c === 'S') {
                    map[i + 1][j + 1] = 'a'.charCodeAt(0) - 'a'.charCodeAt(0);
                    startPos = [i + 1, j + 1];
                } else if (c === 'E') {
                    endPos = [i + 1, j + 1];
                    map[i + 1][j + 1] = 'z'.charCodeAt(0) - 'a'.charCodeAt(0);
                } else {
                    map[i + 1][j + 1] = c.charCodeAt(0) - 'a'.charCodeAt(0);
                }
            }
        }

        return bfs(map, startPos, endPos);
    }
}

namespace Second {
    export function run(input: string): number {
        const map: number[][] = [];

        let endPos: [number, number] = [-1, -1];

        const data = input.split('\r\n').map(l => l.split(''));

        const height = data.length;
        const width = data[0].length;

        for (let i = 0; i < height + 2; ++i) {
            map.push(duplicate(Infinity, width + 2));
        }

        for (let i = 0; i < height; ++i) {
            for (let j = 0; j < width; ++j) {
                const c = data[i][j];

                if (c === 'S') {
                    map[i + 1][j + 1] = 0;
                } else if (c === 'E') {
                    endPos = [i + 1, j + 1];
                    map[i + 1][j + 1] = 'z'.charCodeAt(0) - 'a'.charCodeAt(0);
                } else {
                    map[i + 1][j + 1] = c.charCodeAt(0) - 'a'.charCodeAt(0);
                }
            }
        }


        const distances = [];
        for (let i = 0; i < height; ++i) {
            for (let j = 0; j < width; ++j) {
                if (map[i + 1][j + 1] === 0) {
                    distances.push(bfs(map, [i + 1, j + 1], endPos));
                }
            }
        }

        distances.sort((d1, d2) => d1 - d2);

        return distances[0];
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