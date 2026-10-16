const currentOperandElement = document.querySelector("#current-operand");
const previousOperandElement = document.querySelector("#previous-operand");
const keys = document.querySelector(".keys");

let currentInput = "0";
let previousValue = null;
let selectedOperator = null;
let shouldStartNewNumber = false;
let hasError = false;

function formatNumber(value) {
  if (!Number.isFinite(value)) return "Error";
  const rounded = Number.parseFloat(value.toPrecision(12));
  return String(rounded);
}

function updateDisplay() {
  currentOperandElement.textContent = currentInput;
  previousOperandElement.textContent =
    previousValue !== null && selectedOperator
      ? `${formatNumber(previousValue)} ${selectedOperator}`
      : "";
}

function resetCalculator() {
  currentInput = "0";
  previousValue = null;
  selectedOperator = null;
  shouldStartNewNumber = false;
  hasError = false;
  updateDisplay();
}

function enterNumber(number) {
  if (hasError || shouldStartNewNumber) {
    currentInput = number;
    shouldStartNewNumber = false;
    hasError = false;
    updateDisplay();
    return;
  }

  if (currentInput === "0") {
    currentInput = number;
  } else if (currentInput.length < 16) {
    currentInput += number;
  }
  updateDisplay();
}

function enterDecimal() {
  if (hasError || shouldStartNewNumber) {
    currentInput = "0.";
    shouldStartNewNumber = false;
    hasError = false;
  } else if (!currentInput.includes(".")) {
    currentInput += ".";
  }
  updateDisplay();
}

function calculate(first, operator, second) {
  switch (operator) {
    case "+": return first + second;
    case "−": return first - second;
    case "×": return first * second;
    case "÷":
      if (second === 0) return null;
      return first / second;
    default: return second;
  }
}

function showError(message) {
  currentInput = message;
  previousValue = null;
  selectedOperator = null;
  shouldStartNewNumber = true;
  hasError = true;
  updateDisplay();
}

function chooseOperator(operator) {
  if (hasError) resetCalculator();

  const inputValue = Number(currentInput);
  if (selectedOperator && !shouldStartNewNumber) {
    const result = calculate(previousValue, selectedOperator, inputValue);
    if (result === null) {
      showError("Cannot divide by 0");
      return;
    }
    if (!Number.isFinite(result)) {
      showError("Error");
      return;
    }
    currentInput = formatNumber(result);
    previousValue = result;
  } else {
    previousValue = inputValue;
  }

  selectedOperator = operator;
  shouldStartNewNumber = true;
  updateDisplay();
}

function showResult() {
  if (!selectedOperator || previousValue === null || shouldStartNewNumber) return;

  const result = calculate(previousValue, selectedOperator, Number(currentInput));
  if (result === null) {
    showError("Cannot divide by 0");
    return;
  }
  if (!Number.isFinite(result)) {
    showError("Error");
    return;
  }

  currentInput = formatNumber(result);
  previousValue = null;
  selectedOperator = null;
  shouldStartNewNumber = true;
  hasError = false;
  updateDisplay();
}

function deleteLastDigit() {
  if (hasError || shouldStartNewNumber) {
    currentInput = "0";
    shouldStartNewNumber = false;
    hasError = false;
  } else {
    currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : "0";
    if (currentInput === "-") currentInput = "0";
  }
  updateDisplay();
}

keys.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.number !== undefined) {
    enterNumber(button.dataset.number);
  } else if (button.dataset.operator) {
    chooseOperator(button.dataset.operator);
  } else {
    switch (button.dataset.action) {
      case "clear": resetCalculator(); break;
      case "delete": deleteLastDigit(); break;
      case "decimal": enterDecimal(); break;
      case "equals": showResult(); break;
    }
  }
});

document.addEventListener("keydown", (event) => {
  if (/^[0-9]$/.test(event.key)) {
    enterNumber(event.key);
  } else if (event.key === ".") {
    enterDecimal();
  } else if (event.key === "+") {
    chooseOperator("+");
  } else if (event.key === "-") {
    chooseOperator("−");
  } else if (event.key === "*") {
    chooseOperator("×");
  } else if (event.key === "/") {
    event.preventDefault();
    chooseOperator("÷");
  } else if (event.key === "Enter" || event.key === "=") {
    event.preventDefault();
    showResult();
  } else if (event.key === "Backspace") {
    deleteLastDigit();
  } else if (event.key === "Escape" || event.key === "Delete") {
    resetCalculator();
  }
});

updateDisplay();
