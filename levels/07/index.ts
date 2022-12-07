import AbstractRunner from "../../types/runner";

class Node {
    name: string;

    nodeSize: number = 0;

    parent: undefined | Node;

    children: Node[];

    constructor(name: string, parent: Node | undefined,
            nodeSize: number = 0,
            children: Node[] = []) {
        this.name = name;
        this.parent = parent;
        this.nodeSize = nodeSize;
        this.children = children;
    }

    totalSize(): number {
        const childrenSize = this.children.reduce((acc, next) => { 
            return acc + next.totalSize();
        }, 0);

        return this.nodeSize + childrenSize;
    }

    *[Symbol.iterator](): Generator<Node, void, void> {
        yield this;

        for (const c of this.children) {
            yield* c;
        }
    }
}

class Tree {
    head: Node = new Node('/', undefined);

    *[Symbol.iterator]() {
        yield* this.head;
    }

}

function parseCommand(line: string): undefined | { command: string, args: string } {
    if (!line.startsWith('$ ')) {
        return undefined;
    }

    const data = line.split(' ');
    if (data.length < 2) {
        return undefined;
    }

    const command = data[1];

    const args = line.substring('$ '.length + command.length + 1);

    return {
        command,
        args,
    };
}

function parseLs(input: string): { size: number, name: string } {
    const data = input.split(' ');

    const size = data[0] === 'dir' ? 0 : Number(data[0]);

    return {
        size: size,
        name: data[1],
    };
}

function parseTree(input: string): Tree {
    const tree = new Tree();

    const lines = input.split('\r\n');

    let currentNode = tree.head;

    for (let i = 0; i < lines.length; ++i) {
        const line = lines[i];

        const result = parseCommand(line);
        if (result) {
            const { command, args } = result;

            if (command === 'cd') {
                if (args === '..') {
                    currentNode = currentNode.parent as Node;
                } else if (args === '/') {
                    currentNode = tree.head;
                } else {
                    const nextNode = currentNode.children.find(c => {
                        return c.name === args;
                    })!;
    
                    currentNode = nextNode;
                }
            }

            if (command === 'ls') {
                let j = 1;
                for (j; lines[i + j]?.match(/^(dir)|\d+/); ++j) {
                    const line = lines[i + j];

                    const { size, name } = parseLs(line);

                    const existingNode = currentNode.children.find(c => {
                        return c.name === name;
                    });

                    if (!existingNode) {
                        const newNode = new Node(name, currentNode, size);

                        currentNode.children.push(newNode);
                    }
                }
                i += j - 1;
            }

        }
    }

    return tree;
}

namespace First {
    export function run(input: string): number {
        const tree = parseTree(input);
        
        // filter out all non-directories
        const nodes = [...tree].filter(n => n.nodeSize === 0);

        const sum = nodes.reduce((acc, next) => {
            const totalSize = next.totalSize();

            if (totalSize > 100000) {
                return acc;
            }
            
            return acc + totalSize;
        }, 0);

        return sum;
    }
}

namespace Second {
    export function run(input: string): number {
        const tree = parseTree(input);

        // filter out all non-directories
        const nodes = [...tree].filter(n => n.nodeSize === 0);

        const totalUsedSpace = tree.head.totalSize();

        const totalUnusedSpace = 70000000 - totalUsedSpace;

        const sorted = nodes.sort((lhs, rhs) => {
            const lhsTotalSize = lhs.totalSize();
            const rhsTotalSize = rhs.totalSize();

            if (lhsTotalSize < rhsTotalSize) return -1;
            if (lhsTotalSize === rhsTotalSize) return 0;
            return 1;
        });

        const n = sorted.find((node) => {
            return totalUnusedSpace + node.totalSize() >= 30000000;
        })!;

        return n?.totalSize();
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