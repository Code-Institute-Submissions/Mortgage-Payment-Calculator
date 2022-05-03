const context = document.getElementById("data-set").getContext("2d");
const calcButton = document.querySelector(".input-group button");
let line = new Chart(context, {});

let data = [];
let labels = [];

calcButton.addEventListener("click", calculate);

function calculate(e) {
  e.preventDefault();
  const loanAmountInput = document.getElementById("loan-amount");
  const interestRateInput = document.getElementById("interest-rate");
  const loanTenureInput = document.getElementById("loan-tenure");

  //let interest = interestRate / 12 / 100;
  let extra = 0.0;
  i = interestRateInput.value / 100;
  loan_amt = loanAmountInput.value;
  months = loanTenureInput.value;
  rate = interestRateInput.value;

  let regexNumber = /^[0-9]*(\.[0-9]{0,2})?$/;
  if (!loan_amt.match(regexNumber)) {
    loanAmountInput.value = "10000";
  }
  var monthly_payment =
    (loan_amt * (i / 12) * Math.pow(1 + i / 12, months)) /
    (Math.pow(1 + i / 12, months) - 1);

  var info = "";
  info += "<table class='results'>";
  info += "<tr><td>Loan Amount:</td>";
  info += "<td align='right'>$" + loan_amt + "</td></tr>";
  info += "<tr><td>Num of Months:</td>";
  info += "<td align='right'>" + months + "</td></tr>";
  info += "<tr><td>Interest Rate:</td>";
  info += "<td align='right'>" + rate + "%</td></tr>";
  info += "<tr><td>Monthly Payment:</td>";
  info += "<td align='right'>$" + round(monthly_payment, 2) + "</td></tr>";
  info += "<tr><td>+Extra:</td>";
  info += "<td align='right'>$" + extra + "</td></tr>";
  info += "<tr><td>Total Payment:</td>";
  info +=
    "<td align='right'>$" + round(monthly_payment + extra, 2) + "</td></tr>";
  info += "</table>";
  document.getElementById("results").innerHTML = info; /* info is a string container all the html table code*/