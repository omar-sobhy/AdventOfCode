import AbstractRunner from "../../types/runner";
import { group } from "../../util";

enum Operation {
    Add = '+',
    Mul = '*',
}

type NumberOperand = {
    type: 'number'
    value: number
}

type VariableOperand = {
    type: 'variable'
    operandName: string
}

type Operand = NumberOperand | VariableOperand;

type Monkey = {
    items: number[]
    operation: Operation
    rhs: Operand
    divisor: number
    targetIfTrue: number
    targetIfFalse: number
}

function parseItems(line: string): number[] {
    return line
        .substring('Starting items: '.length)
        .split(', ')
        .map(i => Number(i));
}

function parseOperand(s: string): Operand {
    if (s[0].match(/\d/)) {
        return {
            type: 'number',
            value: Number(s),
        }
    } else {
        return {
            type: 'variable',
            operandName: s,
        }
    }
}

function parseOperation(line: string): [Operation, Operand] {
    const substring = line.substring('Operation: '.length);
    const data = substring.split(' ');

    const operationString = data[3];
    const operandString = data[4];

    return [
        operationString as Operation,
        parseOperand(operandString),
    ];
}

function parseMonkey(group: string[]): Monkey {
    const [
        _,
        itemsLine,
        operationLine,
        testLine,
        trueLine,
        falseLine,
    ] = group;

    const items = parseItems(itemsLine.trim());

    const [operation, rhs] = parseOperation(operationLine.trim());

    const divisor = Number(
        testLine.trim().substring('Test: divisible by '.length)
    );

    const targetIfTrue = Number(
        trueLine
            .trim()
            .substring('If true: throw to monkey '.length)
    );

    const targetIfFalse = Number(
        falseLine
            .trim()
            .substring('If false: throw to monkey '.length)
    );

    return {
        items,
        operation,
        rhs,
        divisor,
        targetIfTrue,
        targetIfFalse,
    };
}

function doOperation(old: number, operation: Operation, operand: Operand) {
    if (operation === Operation.Add) {
        if (operand.type === 'number') {
            return old + operand.value;
        } else {
            return old + old;
        }
    } else {
        if (operand.type === 'number') {
            return old * operand.value;
        } else {
            return old * old;
        }
    }
}

namespace First {
    export function run(input: string): number {
        const lines = input.split('\r\n');

        const groups = group(lines, (str, idx) => {
            return String(Math.trunc(idx / 7));
        });

        const monkeys = Object.values(groups).map(g => parseMonkey(g));

        const monkeysInspectedCount: Map<number, number> = new Map();

        for (let i = 0; i < monkeys.length; ++i) {
            monkeysInspectedCount.set(i, 0);
        }

        for (let i = 0; i < 20; ++i) {
            monkeys.forEach((m, idx) => {
                m.items.forEach(i => {
                    const newItemValue = Math.trunc(
                        doOperation(i, m.operation, m.rhs) / 3
                    );

                    if (newItemValue % m.divisor === 0) {
                        monkeys[m.targetIfTrue].items.push(newItemValue);
                    } else {
                        monkeys[m.targetIfFalse].items.push(newItemValue);
                    }
                });

                const currCount = monkeysInspectedCount.get(idx)!;
                monkeysInspectedCount.set(idx, currCount + m.items.length);

                m.items = [];
            });
        }

        const values = [...monkeysInspectedCount.values()]
            .sort((lhs, rhs) => rhs - lhs);

        return values[0] * values[1];
    }
}

namespace Second {
    export function run(input: string): number {
        const lines = input.split('\r\n');

        const groups = group(lines, (str, idx) => {
            return String(Math.trunc(idx / 7));
        });

        const monkeys = Object.values(groups).map(g => parseMonkey(g));

        const monkeysInspectedCount: Map<number, number> = new Map();

        for (let i = 0; i < monkeys.length; ++i) {
            monkeysInspectedCount.set(i, 0);
        }

        for (let i = 0; i < 10000; ++i) {
            monkeys.forEach((m, idx) => {
                m.items.forEach(item => {
                    const newItemValue = doOperation(item, m.operation, m.rhs);

                    if (newItemValue % m.divisor === 0) {
                        monkeys[m.targetIfTrue].items.push(newItemValue);
                    } else {
                        monkeys[m.targetIfFalse].items.push(newItemValue);
                    }
                });

                const currCount = monkeysInspectedCount.get(idx)!;
                monkeysInspectedCount.set(idx, currCount + m.items.length);

                m.items = [];
            });
        }

        const values = [...monkeysInspectedCount.values()]
            .sort((lhs, rhs) => rhs - lhs);

        return values[0] * values[1];
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