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


console.log(FizzBuzz(21)); // "FizzBang"
console.log(FizzBuzz(33)); // "Bong"
console.log(FizzBuzz(65)); // "FezzBuzz"
console.log(FizzBuzz(143)); // "FezzBong"
console.log(FizzBuzz(195)); // "FizzFezzBuzz"
console.log(FizzBuzz(255)); // "BuzzFizz"