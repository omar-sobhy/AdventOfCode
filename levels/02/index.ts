import AbstractRunner from '../../types/runner';

const DRAW_SCORE = 3;
const WIN_SCORE = 6;
const LOSS_SCORE = 0;

const ROCK_SCORE = 1;
const PAPER_SCORE = 2;
const SCISSORS_SCORE = 3;

namespace First {
    function roundScore(opponent: string, recommendation: string): number {
        if (opponent === 'A' && recommendation === 'X'
         || opponent === 'B' && recommendation === 'Y'
         || opponent === 'C' && recommendation === 'Z') {
            return DRAW_SCORE;
        } else if (opponent === 'A' && recommendation === 'Z'
                || opponent === 'B' && recommendation === 'X'
                || opponent === 'C' && recommendation === 'Y') {
            return LOSS_SCORE;
       } else {
            return WIN_SCORE;
       }
    }

    function shapeScore(recommendation: string): number {
        if (recommendation === 'X') {
            return ROCK_SCORE;
        } else if (recommendation === 'Y') {
            return PAPER_SCORE;
        } else {
            return SCISSORS_SCORE;
        }
    }

    function totalScore(opponent: string, recommendation: string): number {
        return roundScore(opponent, recommendation) 
                + shapeScore(recommendation);
    }

    export function run(input: string): number {
        const rounds = input.split('\n');
            
        const sum = rounds.reduce<number>((acc, next) => {
            const [opponent, recommendation] = next.replaceAll(/\r/g, '')
                                                   .split(' ');
                                                   
            return acc + totalScore(opponent, recommendation);
        }, 0);

        return sum;
    }
}

namespace Second {
    const LOSS_RECOMMENDATION = 'X';
    const DRAW_RECOMMENDATION = 'Y';
    const WIN_RECOMMENDATION = 'Z';
    
    function roundScore(recommendation: string): number {
        if (recommendation === DRAW_RECOMMENDATION) {
            return DRAW_SCORE;
        } else if (recommendation === LOSS_RECOMMENDATION) {
            return LOSS_SCORE;
        } else {
            return WIN_SCORE;
        }
    }

    function shapeScore(shape: string): number {
        if (shape === 'X') {
            return ROCK_SCORE;
        } else if (shape === 'Y') {
            return PAPER_SCORE;
        } else {
            return SCISSORS_SCORE;
        }
    }

    function shapeForRound(opponent: string, recommendation: string): string {
        if (recommendation === DRAW_RECOMMENDATION) {
            if (opponent === 'A') {
                return 'X';
            } else if (opponent === 'B') {
                return 'Y';
            } else {
                return 'Z';
            }
        } else if (recommendation === WIN_RECOMMENDATION) {
            if (opponent === 'A') {
                return 'Y';
            } else if (opponent === 'B') {
                return 'Z';
            } else {
                return 'X';
            }
        } else {
            if (opponent === 'A') {
                return 'Z';
            } else if (opponent === 'B') {
                return 'X';
            } else {
                return 'Y';
            }
        }
    }

    function totalScore(opponent: string, recommendation: string): number {
        const shape = shapeForRound(opponent, recommendation);

        return roundScore(recommendation) 
                + shapeScore(shape);
    }

    export function run(input: string): number {
        const rounds = input.split('\n');

        const sum = rounds.reduce<number>((acc, next) => {
            const [opponent, recommendation] = next.replaceAll(/\r/g, '')
                                                   .split(' ');
                                                   
            return acc + totalScore(opponent, recommendation);
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