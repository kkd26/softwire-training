import Bank from "../src/Bank";
import { EmptyNameError } from "../src/Models";

const testName = "Test Person";

// test("Add person", () => {
//   // Arrange
//   const bank = new Bank();
//   const expectedStatementList = `${testName}: 0.00`;

//   // Act
//   bank.addPerson(testName);
//   const statementList = bank.listAll();

//   // Assert
//   expect(statementList).toBe(expectedStatementList);
// });

test("Add person - add empty name", () => {
  // Arrange
  const bank = new Bank();
  const addEmptyPerson = () => bank.addPerson("");

  // Act

  // Assert
  expect(addEmptyPerson).toThrow(EmptyNameError);
});

test("Import File - json to json", async () => {
  // Arrange
  const bank = new Bank();
  const inFile = "./data/Transactions2013.json";
  const outFile = "/tmp/test.json";

  await bank.fromJSON(inFile);
  const expectedList = bank.listAll();

  // Act
  bank.exportTransactions(outFile);
  const newBank = new Bank();
  await newBank.fromJSON(outFile);

  const list = newBank.listAll();

  // Assert
  expect(list).toBe(expectedList);
});
