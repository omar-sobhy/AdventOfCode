import AbstractRunner from "../../types/runner"

function parseStacks(input: string): string[][] {
    const lines = input.split('\r\n');

    const numbersSplitIndex = lines.findIndex(l => l === '') - 1;

    const numStacks = lines[numbersSplitIndex].split('   ').length;

    const data = lines.slice(0, numbersSplitIndex).map(l => {
        return [...(l.matchAll(/(....)/g))];
    });

    const stacks: string[][] = [];

    for (let i = 0; i < numStacks; ++i) {
        stacks[i] = [];
    }

    for (let i = data.length - 1; i >= 0; --i) {
        data[i].forEach((r, j) => {
            const box = r[0][1]; // r[0] looks like '[B] ' and we want 'B'

            if (box !== ' ') {
                stacks[j].push(box);
            }
        });
    }

    return stacks;
}

function parseActions(input: string): string[][] {
    const actions = [...input.matchAll(/move (\d+) from (\d) to (\d)/g)];

    return actions;
}

namespace First {
    export function run(input: string): string {
        const stacks = parseStacks(input);

        const actions = parseActions(input);

        actions.forEach(r => {
            const [_, moveCount, start, end] = r;

            for (let i = 0; i < Number(moveCount); ++i) {
                const box = stacks[Number(start) - 1].pop()!;

                stacks[Number(end) - 1].push(box);
            }
        });

        return stacks.reduce((acc, next) => {
            const top = next[next.length - 1];

            return `${acc}${top}`;
        }, '');
    }
}

namespace Second {
    export function run(input: string): string {
        const stacks = parseStacks(input);

        const actions = parseActions(input);

        actions.forEach(r => {
            const [_, moveCount, start, end] = r;

            const tempStack = [];

            for (let i = 0; i < Number(moveCount); ++i) {
                const box = stacks[Number(start) - 1].pop()!;
                tempStack.push(box);
            }

            tempStack.reverse();

            stacks[Number(end) - 1].push(...tempStack);
        });

        return stacks.reduce((acc, next) => {
            const top = next[next.length - 1];

            return `${acc}${top}`;
        }, '');
    }
}

export default class Runner extends AbstractRunner {
    async run(input: string): Promise<{ first: string; second: string; }> {

        return {
            first: First.run(input),
            second: Second.run(input),
        }
    }
}