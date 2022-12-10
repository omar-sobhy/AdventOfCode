

// F extends is inlined for better intellisense

export function group<T, F extends (el: T, index: number, arr: T[]) => string>(arr: T[], fn: F): { [k: string]: T[] };

export function group<T, F extends (el: T, index: number) => string>(arr: T[], fn: F): { [k: string]: T[] };

export function group<T, F extends (el: T) => string>(arr: T[], fn: F): { [k: string]: T[] };

export function group<T, F extends (el: T, index?: number, arr?: T[]) => string>(arr: T[], fn: F) {
    const groupObj = arr.reduce((acc, next, index) => {
        const groupId = fn(next, index);

        if (!acc.hasOwnProperty(groupId)) {
            acc[groupId] = [];
        }

        acc[groupId].push(next);

        return acc;
    }, {} as { [k: string]: T[] });

    return groupObj;

}

export { default as HashMap } from "./hashMap";

