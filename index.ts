for (var i = 0; i <= 100; i++) {
    // if (i % 3 == 0) {
    //     if (i % 5 == 0) console.log("FizzBuzz");
    //     else console.log("Fizz");
    // }
    // else {
    //     if (i % 5 == 0) console.log("Buzz");
    //     else console.log(i);
    // }

    console.log(i % 3 ? (i % 5 ? i : "Buzz") : (i % 5 ? "Fizz" : "FizzBuzz"));
}
