import { readdir, readFile } from "fs/promises";
import { argv, exit } from "process";
import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';
import prompts, { Choice } from 'prompts';
import AbstractRunner from "./types/runner";

const sections = [
    {
        header: 'AoC runner',
        content: 'A level runner for Advent of Code',
    },
    {
        header: 'Options',
        optionList: [
            {
                name: 'level',
                typeLabel: '{underline number}',
                description: 'The level to run.',
            },
            {
                name: 'input',
                typeLabel: '{underline fileName}',
                description: 'Which input file to run. Enter \'main\' or a number corresponding to a test case.',
            },
        ],
    },
];

const usage = commandLineUsage(sections);

function normalise(n: string): string | undefined {
    if (n.toLowerCase() === 'main') {
        return 'main';
    }
    
    const nNumber = Number(n);
    if (isNaN(nNumber)) {
        return undefined;
    }

    if (1 <= nNumber && nNumber <= 9) {
        return `0${nNumber}`;
    }

    return n;
}

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
    const runner = new defaultExport() as AbstractRunner;

    const result = await runner.run(input);

    console.log(`Result of running level \`${level}\` using input file \`${inputFileName}\``);
    console.log('-------------------------');
    console.log(result);
    console.log('-------------------------');
}

async function uninteractivePrompt() {
    const optionsDefinitions = [
        { name: 'level', alias: 'l', type: String },
        { name: 'input', alias: 'i', type: String },
        { name: 'help', alias: 'h', type: Boolean },
    ];

    const options = commandLineArgs(optionsDefinitions);

    const { level, input, help } = options;

    if (help) {
        console.log(usage);
        exit();
    }

    const mainLevelsDirFiles = await readdir('./levels', { encoding: 'utf-8' });

    const filteredLevelsDirFiles = mainLevelsDirFiles.filter((fileName) => {
        return /\d\d/.test(fileName);
    });

    const normalisedLevel = normalise(level);
    if (!normalisedLevel) {
        console.log(`Invalid value for \`level\` (got \`${level}\`).`);
        exit();
    }

    if (!filteredLevelsDirFiles.find(l => l === normalisedLevel)) {
        console.log(`Invalid value for \`level\` (got \`${level}\`).`);
        exit();
    }


    const inputs = await readdir(`./levels/${normalisedLevel}/inputs`, {
        encoding: 'utf-8'
    });
    
    const normalisedInputNumber = normalise(input);

    if (input.toLowerCase() !== 'main') {
        if (!normalisedInputNumber) {
            console.log(`Invalid value for \`input\` (got \`${input}\`).`);
            exit();
        }
        
        if (!inputs.find(i => i === normalisedInputNumber)) {
            console.log(`Invalid value for \`input\` (got \`${input}\`).`);
            exit();
        }
    }

    // console.log("?", normalisedLevel, normalisedInputNumber);

    const input_ = await readFile(
        `./levels/${normalisedLevel}/inputs/${normalisedInputNumber}`,
        {
            encoding: 'utf-8',
        }
    );

    const { default: defaultExport } = await import(`./levels/${normalisedLevel}`);
    const runner = new defaultExport() as AbstractRunner;

    const result = await runner.run(input_);

    console.log(`Result of running level \`${normalisedLevel}\` using input file \`${normalisedInputNumber}\``);
    console.log('-------------------------');
    console.log(result);
    console.log('-------------------------');
}

if (argv.length < 3) {
    interactivePrompt();
} else {
    uninteractivePrompt();
}