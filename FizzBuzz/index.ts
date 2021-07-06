const readline = require("readline");
const chalk = require("chalk");

interface ConfigI {
  rules: {
    [key: string]: {
      active: boolean;
    };
  };
}

interface TestsI {
  [num: number]: string;
}

const config: ConfigI = {
  rules: {
    "3": {
      active: true,
    },
    "5": {
      active: true,
    },
    "7": {
      active: true,
    },
    "11": {
      active: true,
    },
    "13": {
      active: true,
    },
    "17": {
      active: true,
    },
  },
};

function FizzBuzz(i: number) {
  let s: string[] = [];

  if (i % 3 == 0 && (!config || config.rules["3"].active)) s.push("Fizz");
  if (i % 5 == 0 && (!config || config.rules["5"].active)) s.push("Buzz");
  if (i % 7 == 0 && (!config || config.rules["7"].active)) s.push("Bang");
  if (i % 11 == 0 && (!config || config.rules["11"].active)) s = ["Bong"];
  if (i % 13 == 0 && (!config || config.rules["13"].active)) {
    const pos = s.findIndex((i) => i.startsWith("B"));
    if (pos >= 0) s.splice(pos, 0, "Fezz");
    else s.push("Fezz");
  }
  if (i % 17 == 0 && (!config || config.rules["17"].active)) s.reverse();

  return s.length ? s.join("") : i;
}

const tests: TestsI = {
  3: "Fizz",
  4: "4",
  21: "FizzBang",
  33: "Bong",
  65: "FezzBuzz",
  143: "FezzBong",
  195: "FizzFezzBuzz",
  255: "BuzzFizz",
};

function test(num: number, ans: string): boolean {
  const out = FizzBuzz(num);
  const result = out == ans;

  const color = result ? chalk.green : chalk.red;

  console.log(color(`${num} out: ${out}`));
  return result;
}

function testAll() {
  for (const num in tests) {
    if (Object.prototype.hasOwnProperty.call(tests, num)) {
      const out = tests[num];
      test(Number(num), out);
    }
  }
}

async function prompt() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  function ask(question: string): Promise<string> {
    return new Promise((res, rej) => {
      rl.question(question, (answer: string) => {
        res(answer);
      });
    });
  }

  async function editRule(num: string) {
    if (config.rules.hasOwnProperty(num)) {
      while (true) {
        const ans = await ask("Set active?(y/n): ");
        switch (ans) {
          case "y":
            return (config.rules[num].active = true);
          case "n":
            return (config.rules[num].active = false);
          default:
            console.log("Answer y or n.");
        }
      }
    } else {
      console.log(
        chalk.red("Incorrect rule number. Press any key to continue")
      );
      await ask("");
    }
  }

  function displayConfig() {
    console.log("\n---------------------");
    for (const key in config.rules) {
      if (Object.prototype.hasOwnProperty.call(config.rules, key)) {
        const element = config.rules[key];
        const active = element.active;
        const color = active ? chalk.green : chalk.red;
        const status = active ? "ACTIVE" : "INACTIVE";
        console.log(color(`${key} ${status}`));
      }
    }
    console.log("---------------------");
  }

  async function menu() {
    while (true) {
      displayConfig();
      const num = await ask("Rule number or (quit): ");
      switch (num) {
        case "quit":
          return;
        default:
          await editRule(num);
      }
    }
  }

  while (true) {
    const ans = await ask(
      "Please input number or type (menu) or (test) or (exit): "
    );
    switch (ans) {
      case "menu":
        await menu();
        break;
      case "test":
        testAll();
        break;
      case "exit":
        rl.close();
        return;
      default:
        for (var i = 1; i <= Number(ans); i++) console.log(FizzBuzz(i));
    }
  }
}

prompt();
