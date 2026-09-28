class Converter {
  constructor() {
    this.rates = {
      USD: 1,
      JPY: 11.5,
      GBP: 0.75,
      RUB: 74.36,
      EUR: 0.89,
    };

    this.amountInput = document.getElementById("amount");
    this.currencySelect = document.getElementById("currency");
    this.resultText = document.getElementById("result");
    this.button = document.getElementById("convertBtn");

    this.button.addEventListener("click", () => this.convertCurrency());
  }

  convertCurrency() {
    const currency = this.currencySelect.value;
    const amount = Number(this.amountInput.value);

    if (this.rates[currency] !== undefined) {
      const convertedAmount = amount * this.rates[currency];
      this.resultText.textContent = `Converted amount: ${convertedAmount.toFixed(2)} ${currency}`;
    } else {
      this.resultText.textContent = "Unknown currency";
    }
  }
}

$("#convertBtn"). on("click" , () => {
  const amount = parseFloat($("#amount").val());
  const fromCurrency = $("#fromCurrency").val();
  const toCurrency = $("#toCurrency").val();

  if ()
}

new Converter();