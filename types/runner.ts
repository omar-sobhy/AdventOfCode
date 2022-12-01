import { readFile } from "fs/promises";

abstract class AbstractRunner {
    abstract run(input: string): Promise<{
        first: string,
        second: string
    }>;
}

export default AbstractRunner;
