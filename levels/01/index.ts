import AbstractRunner from '../../types/runner';

class Runner extends AbstractRunner {
    async run(input: string): Promise<{
            first: string,
            second: string,
        }> {
        const groups = input.split('\n\r\n').map(g => g.split('\n'));

        const sums = groups.map(g => {
            return g.reduce<number>((acc, next) => {
                return acc + Number(next);
            }, 0);
        });

        const sorted = sums.sort((lhs, rhs) => {
            if (lhs > rhs) return -1;
            if (lhs === rhs) return 0;
            return 1;
        });

        return {
            first: String(sorted[0]),
            second: String(sorted[0] + sorted[1] + sorted[2]),
        };
    }
    
}

export default Runner;