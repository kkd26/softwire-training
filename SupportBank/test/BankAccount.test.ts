import BankAccount from "../src/BankAccount";
import { EmptyNameError } from "../src/Models";

const testName = "Test Person";
const testAmount = 10;

test("Add person - check name", () => {
  // Arrange
  const bankAccount = new BankAccount(testName);
  const expectedName = testName;

  // Act
  const name = bankAccount.name;

  // Assert
  expect(name).toBe(expectedName);
});

test("Add person - check amount to be 0.00", () => {
  // Arrange
  const bankAccount = new BankAccount(testName);

  // Act
  const amount = bankAccount.amount;

  // Assert
  expect(amount).toBe(0);
});

test("Add person - check initial statement", () => {
  // Arrange
  const bankAccount = new BankAccount(testName);
  const expectedString = `${testName}: 0.00`;

  // Act
  const statement = bankAccount.statement();

  // Assert
  expect(statement).toBe(expectedString);
});

test("Add person - check amount after credit", () => {
  // Arrange
  const bankAccount = new BankAccount(testName);
  const expectedAmount = -testAmount;

  // Act
  bankAccount.credit(testAmount, new Date(), "Test credit");
  const amount = bankAccount.amount;

  // Assert
  expect(amount).toBe(expectedAmount);
});

test("Add person - check statement after credit", () => {
  // Arrange
  const bankAccount = new BankAccount(testName);
  const expectedStatement = `${testName}: -${testAmount.toFixed(2)}`;

  // Act
  bankAccount.credit(testAmount, new Date(), "Test credit");
  const statement = bankAccount.statement();

  // Assert
  expect(statement).toBe(expectedStatement);
});

test("Add person - empty name throws an error", () => {
  // Assert
  expect(() => new BankAccount("")).toThrow(EmptyNameError);
});
