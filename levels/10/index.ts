import AbstractRunner from "../../types/runner";

class CPU {
    x = 1;
    cycle = 0;

    totalInterestingSignalStrength = 0;

    do(instruction: string, cycleFunction: Function) {
        const data = instruction.split(' ');
            if (data[0] === 'noop') {
                ++this.cycle;
                cycleFunction(this);
            } else if (data[0] === 'addx') {
                for (let i = 0; i < 2; ++i) {
                    ++this.cycle;
                    cycleFunction(this);
                }

                this.x += Number(data[1]);
            }
    }
}

namespace First {
    export function run(input: string): number {
        const instructions = input.split('\r\n');

        const cpu = new CPU();

        let totalSignalStrength = 0;

        instructions.forEach(i => cpu.do(i, (cpu: CPU) => {
            if (cpu.cycle % 40 === 20) {
                totalSignalStrength += cpu.x * cpu.cycle;
            }
        }));

       return totalSignalStrength;
    }
}

namespace Second {
    export function run(input: string): string {
        const instructions = input.split('\r\n');

        const cpu = new CPU();

        let line: string[] = [];

        let lines: string[] = [];
        instructions.forEach(i => {
            cpu.do(i, (cpu: CPU) => {
                const { x, cycle } = cpu;

                if (x - 1 === (cycle - 1) % 40
                    || x === (cycle - 1) % 40
                    || x + 1 === (cycle - 1) % 40) {
                    line.push('#');
                } else {
                    line.push('.');
                }

                if (cycle % 40 === 0) {
                    lines.push(line.join(''));
                    line = [];
                }
            });
        });


        return '\r\n' + lines.join('\r\n');
    }
}

class Runner extends AbstractRunner {
    async run(input: string): Promise<{
        first: string,
        second: string,
    }> {
        return {
            first: String(First.run(input)),
            second: Second.run(input),
        };
    }
}

export default Runner;