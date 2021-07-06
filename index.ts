const readline = require('readline');
const chalk = require('chalk');

function FizzBuzz(i: number) {
    let s: string[] = [];

    if (i % 3 == 0) s.push("Fizz");
    if (i % 5 == 0) s.push("Buzz");
    if (i % 7 == 0) s.push("Bang");
    if (i % 11 == 0) s = ["Bong"];
    if (i % 13 == 0) {
        const pos = s.findIndex(i => i.startsWith("B"));
        if (pos >= 0) s.splice(pos, 0, "Fezz");
        else s.push("Fezz");
    }
    if (i % 17 == 0) s.reverse();

    return s.length ? s.join("") : i;
}

function test(num: number, ans: string): boolean {
    const out = FizzBuzz(num);
    const result = out == ans;

    const color = result ? chalk.green : chalk.red;

    console.log(color(`${num} out: ${out}`));
    return result;
}

function tests() {
    test(21, "FizzBang");
    test(33, "Bong");
    test(65, "FezzBuzz");
    test(143, "FezzBong");
    test(195, "FizzFezzBuzz");
    test(255, "BuzzFizz");
}

function propmt() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question("Please input number: ", (num: number) => {
        for (var i = 1; i <= num; i++) console.log(FizzBuzz(i));
        rl.close();
    })
}

tests();
propmt();