import AbstractRunner from "../../types/runner";

function rangeContainsOther(r1: [number, number], r2: [number, number]): boolean {
    if (r1[0] <= r2[0] && r1[1] >= r2[1]) {
        return true;
    }

    return false;
}

function rangeFromLine(line: string): [number, number] {
    const endpoints = line.split('-');
    
    const l = Number(endpoints[0]);
    const r = Number(endpoints[1]);

    return [l, r];
    
}

function rangesOverlap(r1: [number, number], r2: [number, number]): boolean {
    if (r1[0] <= r2[0] && r1[1] >= r2[0]
        || r2[0] <= r1[0] && r2[1] >= r1[0]) {
        return true;
    }

    return false;
}

namespace First {
    export function run(input: string) {
        const lines = input.split('\n');

        const groups = lines.map(l => l.split(','));

        return groups.reduce((acc, next) => {
            const r1 = rangeFromLine(next[0]);
            const r2 = rangeFromLine(next[1]);

            if (rangeContainsOther(r1, r2) || rangeContainsOther(r2, r1)) {
                return acc + 1;
            }

            return acc;
        }, 0)
    }
}

namespace Second {
    export function run(input: string) {
        const lines = input.split('\n');

        const groups = lines.map(l => l.split(','));

        return groups.reduce((acc, next) => {
            const r1 = rangeFromLine(next[0]);
            const r2 = rangeFromLine(next[1]);

            if (rangesOverlap(r1, r2)) {
                return acc + 1;
            }

            return acc;
        }, 0)
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