import AbstractRunner from "../../types/runner";
import { HashMap } from "../../util";

function distance(p1: [number, number], p2: [number, number]) {
    return Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]);
}

namespace First {
    export function run(input: string): number {
        const lines = input.split('\r\n');

        const sensorBeaconMap: HashMap<[number, number], [number, number]>
            = new HashMap(
                [],
                (lhs, rhs) => lhs[0] === rhs[0] && lhs[1] === rhs[1],
            );

        lines.forEach(l => {
            const r = /Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/;

            const [
                _,
                sensorXString,
                sensorYString,
                beaconXString,
                beaconYString,
            ] = l.match(r)!;

            const sensorX = Number(sensorXString);
            const sensorY = Number(sensorYString);
            const beaconX = Number(beaconXString);
            const beaconY = Number(beaconYString);

            sensorBeaconMap.set([sensorX, sensorY], [beaconX, beaconY]);
        });

        // for (let j = 0; j < 23; ++j) {
        //     const line = [];
        //     for (let i = -2; i < 26; ++i) {
        //         const node = map.get([i, j]);
        //         if (node) {
        //             line.push(node);
        //             continue;
        //         }

        //         let isEmpty = false;
        //         for (const [k, v] of sensorBeaconMap.entries()) {
        //             const d1 = distance(k, v);
        //             const d2 = distance(k, [i, j]);

        //             if (d2 <= d1) {
        //                 line.push('#');
        //                 isEmpty = true;
        //                 break;
        //             }
        //         }

        //         if (!isEmpty) {
        //             line.push('.');
        //         }
        //     }

        //     console.log(line.join(''));
        // }

        let min = Infinity, max = -Infinity, maxDistance = -Infinity;
        for (const [sensor, beacon] of sensorBeaconMap.entries()) {
            min = Math.min(min, sensor[0], beacon[0]);
            max = Math.max(max, sensor[0], beacon[0]);

            const d = distance(sensor, beacon);
            maxDistance = Math.max(maxDistance, d);
        }

        // min = -10_000_000;
        // max = 10_000_000;

        let count = 0;
        const targetY = 2_000_000;
        for (let i = min - maxDistance; i <= max + maxDistance; ++i) {
            for (const [sensor, beacon] of sensorBeaconMap.entries()) {
                const sensorBeaconDistance = distance(sensor, beacon);
                const sensorPointDistance = distance(sensor, [i, targetY]);

                if (beacon[0] === i && beacon[1] === targetY) {
                    continue;
                }

                if (sensorPointDistance <= sensorBeaconDistance) {
                    ++count;
                    break;
                }
            }
        }

        return count;
    }
}


namespace Second {
    export function run(input: string): number {
        const lines = input.split('\r\n');

        const sensorBeaconMap: HashMap<[number, number], [number, number]>
            = new HashMap(
                [],
                (lhs, rhs) => lhs[0] === rhs[0] && lhs[1] === rhs[1],
            );

        lines.forEach(l => {
            const r = /Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/;

            const [
                _,
                sensorXString,
                sensorYString,
                beaconXString,
                beaconYString,
            ] = l.match(r)!;

            const sensorX = Number(sensorXString);
            const sensorY = Number(sensorYString);
            const beaconX = Number(beaconXString);
            const beaconY = Number(beaconYString);

            sensorBeaconMap.set([sensorX, sensorY], [beaconX, beaconY]);
        });

        // for (let j = 0; j < 23; ++j) {
        //     const line = [];
        //     for (let i = -2; i < 26; ++i) {
        //         const node = map.get([i, j]);
        //         if (node) {
        //             line.push(node);
        //             continue;
        //         }

        //         let isEmpty = false;
        //         for (const [k, v] of sensorBeaconMap.entries()) {
        //             const d1 = distance(k, v);
        //             const d2 = distance(k, [i, j]);

        //             if (d2 <= d1) {
        //                 line.push('#');
        //                 isEmpty = true;
        //                 break;
        //             }
        //         }

        //         if (!isEmpty) {
        //             line.push('.');
        //         }
        //     }

        //     console.log(line.join(''));
        // }

        let min = Infinity, max = -Infinity, maxDistance = -Infinity;
        for (const [sensor, beacon] of sensorBeaconMap.entries()) {
            min = Math.min(min, sensor[0], beacon[0]);
            max = Math.max(max, sensor[0], beacon[0]);

            const d = distance(sensor, beacon);
            maxDistance = Math.max(maxDistance, d);
        }

        // min = -10_000_000;
        // max = 10_000_000;

        let minX = 0, minY = 0, maxX = 20, maxY = 20;

        let [x, y] = [0, 0];

        const distances = [...sensorBeaconMap.entries()]
            .map(([sensor, beacon]) => {
                return distance(sensor, beacon);
            });

        return x * 4_000_000 + y;
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