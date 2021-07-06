const readline = require('readline');

function FizzBuzz(i: number) {
    let s: string[] = [];

    if (i % 3 == 0) s.push("Fizz");
    if (i % 5 == 0) s.push("Buzz");
    if (i % 7 == 0) s.push("Bang");
    if (i % 11 == 0) s = ["Bong"];
    if (i % 13 == 0) {
        const pos = s.findIndex(i => i.startsWith("B"));
        s.splice(pos, 0, "Fezz");
    }
    if (i % 17 == 0) s.reverse();

    return s.length ? s.join("") : i;
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Please input number: ", (num: number) => {
    for (var i = 0; i <= num; i++) console.log(FizzBuzz(i));
    rl.close();
})