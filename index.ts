import { readdir, readFile } from "fs/promises";
import { argv } from "process";
import prompts, { Choice, PromptObject } from 'prompts';
import Runner from "./levels/01";

async function interactivePrompt() {
    const mainLevelsDirFiles = await readdir('./levels', { encoding: 'utf-8' });
    
    const filteredLevelsDirFiles = mainLevelsDirFiles.filter((fileName) => {
        return /\d\d/.test(fileName);
    });

    const choicesForLevelPrompt: Choice[] = filteredLevelsDirFiles.map(
        (dirName) => {
            return {
                title: `Level ${dirName}`,
                value: dirName,
            };
        }
    );
    
    const levelResponse = await prompts({
        type: 'select',
        message: 'Pick level',
        name: 'level',
        choices: choicesForLevelPrompt,
    });

    const level = levelResponse.level;

    const choicesForInputPrompt: Choice[] = 
        (await readdir(`./levels/${level}/inputs`, {
            encoding: 'utf-8' 
        })).map((fileName) => {
            return {
                title: `Input ${fileName}`,
                value: fileName,
            }
        });

    const inputResult = await prompts({
        type: 'select',
        message: 'Pick input file',
        name: 'inputFileName',
        choices: choicesForInputPrompt,
    });

    const { inputFileName } = inputResult;

    const input = await readFile(
        `./levels/${level}/inputs/${inputFileName}`,
        {
            encoding: 'utf-8'
        }
    );

    const { default: defaultExport } = await import(`./levels/${level}`);
    const runner = new defaultExport() as Runner;
    
    const result = await runner.run(input);

    console.log(`Result of running level ${level} using input file ${inputFileName}`);
    console.log('-------------------------');
    console.log(result);
    console.log('-------------------------');
}


if (argv.length < 3) {
    interactivePrompt();
} else {

}