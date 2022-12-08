import AbstractRunner from "../../types/runner";

namespace First {
    function isVisibleHelper(trees: string[], pos: number): boolean {
        const low = trees.slice(0, pos);
        const high = trees.slice(pos + 1);

        const visibleLow = low.reduce((acc, next) => {
            return acc && (Number(next) < Number(trees[pos]));
        }, true);

        const visibleHigh = high.reduce((acc, next) => {
            return acc && (Number(next) < Number(trees[pos]));
        }, true);

        return visibleLow || visibleHigh;
    }

    function isVisible(trees: string[][], x: number, y: number): boolean {
        const row = trees[y];

        const col = trees.map((row) => {
            return row[x];
        });

        return isVisibleHelper(row, x) || isVisibleHelper(col, y);
    }

    export function run(input: string): number {
        const lines = input.split('\r\n');

        const trees = lines.map(l => l.split(''));

        return trees.reduce((acc, next, i) => {
            return acc + next.reduce((acc, _, j) => {
                return acc + Number(isVisible(trees, i, j));
            }, 0);
        }, 0);
    }
}

namespace Second {
    function scenicScoreHelper(trees: string[]): number {
        let score = 0;

        const height = Number(trees[0]);

        for (let i = 1; i < trees.length; ++i) {
            ++score;

            if (height <= Number(trees[i])) {
                break;
            }
        }

        return score;
    }

    function rowColScenicScore(trees: string[], pos: number): number {
        const low = [...trees.slice(0, pos + 1)].reverse();
        const high = trees.slice(pos);

        let scoreDown = scenicScoreHelper(low);
        let scoreUp = scenicScoreHelper(high);

        return scoreDown * scoreUp;
    }

    function scenicScore(trees: string[][], x: number, y: number): number {
        const row = trees[y];

        const col = trees.map((row) => {
            return row[x];
        })

        return rowColScenicScore(row, x) * rowColScenicScore(col, y);
    }

    export function run(input: string): number {
        const lines = input.split('\r\n');

        const trees = lines.map(l => l.split(''));

        let highest = 0;
        for (let i = 0; i < trees.length; ++i) {
            for (let j = 0; j < trees[i].length; ++j) {
                const score = scenicScore(trees, i, j);
                if (score > highest) {
                    highest = score;
                }
            }
        }

        return highest;
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