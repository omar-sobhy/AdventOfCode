import AbstractRunner from "../../types/runner";

const aCharCode = 'a'.charCodeAt(0);
const ACharCode = 'A'.charCodeAt(0);
const ZCharCode = 'Z'.charCodeAt(0);

function priorty(item: string): number {
    const charCode = item.charCodeAt(0);

    if (charCode <= ZCharCode) {
        return charCode - ACharCode + 27;
    }

    return charCode - aCharCode + 1;
}

namespace First {
    function commonItem(s1: string, s2: string): string {
        const item = s1.split('').filter(c => {
            return s2.indexOf(c) !== -1;
        })[0];
    
        return item;
    }

    export function run(input: string): number {
        const lines = input.split('\n');
        
        const sum = lines.reduce((acc, next) => {
            const pos = next.length / 2;
    
            const firstHalf = next.slice(0, pos);
            const secondHalf = next.slice(pos);
            
            const item = commonItem(firstHalf, secondHalf);

            return acc + priorty(item);
        }, 0);

        return sum;
    }
}

namespace Second {
    function commonItem(s1: string, s2: string, s3: string): string {
        const chars = s1.split('');

        const commonS1S2 = chars.filter(c => {
            return s2.indexOf(c) !== -1;
        });

        const commonS1S3 = chars.filter(c => {
            return s3.indexOf(c) !== -1;
        });

        const commonS1S2S3 = commonS1S2.filter(c => {
            return commonS1S3.indexOf(c) !== -1;
        })

        const item = commonS1S2S3[0];
    
        return item;
    }

    function group<T, F extends Function>(arr: T[], fn: F)
        : { [k: string]: T[] } {
        
        const groupObj = arr.reduce((acc, next, index) => {
            const groupId =  fn(next, index);

            if (!acc.hasOwnProperty(groupId)) {
                acc[groupId] = [];
            }

            acc[groupId].push(next);

            return acc;
        }, {} as { [k: string]: T[] });

        return groupObj;
    }

    export function run(input: string): number {
        const lines = input.replaceAll('\r', '').split('\n');

        const groupObj = group(lines, (_item: string, index: number) => {
            const groupId = Math.trunc(index / 3);

            return groupId;
        });

        const sum = Object.entries(groupObj).reduce((acc, [_key, value]) => {
            const [ s1, s2, s3 ] = value;

            const item = commonItem(s1, s2, s3);

            return acc + priorty(item);
        }, 0);

        return sum;
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