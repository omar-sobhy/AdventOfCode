import AbstractRunner from "../../types/runner";

function* rollingWindow(input: string, size: number) {
    let i = 0;

    for (i; i < input.length - size; ++i) {
        const slice = input.slice(i, i + size);
        
        const stack = [...slice];

        yield stack;
    }

    return i;
}

function hasUniqueEntries<T>(input: Array<T>) {
    const m = new Map<T, number>();
    
    input.forEach(i => {
        if (!m.get(i)) {
            m.set(i, 0);
        }

        m.set(i, m.get(i)! + 1);
    })

    const e = [...m.entries()].find(([_k, v]) => {
        return v !== 1;
    });

    return !e;
}

namespace First {
    export function run(input: string): number {
        const iter = rollingWindow(input, 4);

        for (let i = 0, v = iter.next(); !v.done; ++i, v = iter.next()) {
            if (hasUniqueEntries(v.value)) {
                return i + 4;
            }
        }

        return 0;
    }
}

namespace Second {
    export function run(input: string): number {
        const iter = rollingWindow(input, 14);

        for (let i = 0, v = iter.next(); !v.done; ++i, v = iter.next()) {
            if (hasUniqueEntries(v.value)) {
                return i + 14;
            }
        }

        return -1;
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