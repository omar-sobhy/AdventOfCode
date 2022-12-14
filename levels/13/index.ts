import AbstractRunner from "../../types/runner";
import { group } from "../../util";

type Packet = (Packet | number)[];

function lexicographicalCompare(
    lhs: Packet | number,
    rhs: Packet | number): number {
    if (typeof lhs === 'number' && typeof rhs === 'number') {
        if (lhs < rhs) {
            return -1;
        }

        if (lhs > rhs) {
            return 1;
        }

        return 0;
    }

    if (typeof lhs == 'number') {
        return lexicographicalCompare([lhs], rhs);
    }

    if (typeof rhs === 'number') {
        return lexicographicalCompare(lhs, [rhs]);
    }

    let i = 0;
    for (i; i < lhs.length && i < rhs.length; ++i) {
        const l = lhs[i];
        const r = rhs[i];

        const c = lexicographicalCompare(l, r);

        if (c === -1) {
            return -1;
        }

        if (c === 1) {
            return 1;
        }
    }

    if (lhs.length !== rhs.length) {
        if (i === lhs.length) {
            return -1;
        } else {
            return 1;
        }
    }

    return 0;
}

function parsePacket(s: string): Packet {
    const packet: Packet = [];
    
    let currentPackets: Packet[] = [];

    let first = true;

    let i = 0;

    while (true) {
        if (s[i] === '[') {
            if (first) {
                currentPackets.push(packet);
                first = false;
            } else {
                const current = currentPackets[currentPackets.length - 1];
                current.push([]);
                const last = current[current.length - 1] as Packet;
                currentPackets.push(last);
            }
            ++i;
        } else if (s[i] === ']') {
            currentPackets.pop();
            ++i;
        } else if (/\d/.test(s[i])) {
            const nStartIndex = i;
            let nEndIndex = i;
            while (/\d/.test(s[i])) {
                ++nEndIndex;
                ++i;
            }

            const n = Number(s.slice(nStartIndex, nEndIndex));

            currentPackets[currentPackets.length - 1].push(n);
        } else {
            ++i;
        }

        if (i >= s.length) {
            break;
        }
    }

    return packet;
}

namespace First {
    export function run(input: string): number {
        const lines = input.split('\r\n');

        const groups = group(lines, (_el, idx) => {
            return String(Math.trunc(idx / 3));
        });

        const packetGroups = Object.values(groups);

        let orderedPacketIndices = [];
        for (let i = 0; i < packetGroups.length; ++i) {
            const [first, second] = packetGroups[i];

            const [lhs, rhs] = [parsePacket(first), parsePacket(second)];

            if (lexicographicalCompare(lhs, rhs) === -1) {
                orderedPacketIndices.push(i + 1);
            }
        }

        return orderedPacketIndices.reduce((acc, next) => acc + next);
    }
}


namespace Second {
    export function run(input: string): number {
        const lines = input.split('\r\n').filter(l => l !== '');

        const packets = lines.map(l => parsePacket(l));

        packets.push([[2]]);
        packets.push([[6]]);

        packets.sort(lexicographicalCompare);
        
        const firstIndex = packets.findIndex(p => {
            if (p.length) {
                if (typeof p[0] !== 'number') {
                    if (typeof p[0][0] === 'number') {
                        if (p[0][0] === 2) {
                            return true;
                        }
                    }
                }
            }

            return false;
        }) + 1;

        const secondIndex = packets.findIndex(p => {
            if (p.length) {
                if (typeof p[0] !== 'number') {
                    if (typeof p[0][0] === 'number') {
                        if (p[0][0] === 6) {
                            return true;
                        }
                    }
                }
            }

            return false;
        }) + 1;

        return firstIndex * secondIndex;
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