const CALC_BUTTON = document.querySelector(".input-group button");
let loanAmountInput = document.getElementById("loan-amount");
let interestRateInput = document.getElementById("interest-rate");
let loanTenureInput = document.getElementById("loan-tenure");
let chartContext = document.getElementById("data-set").getContext("2d");
let line = new Chart(chartContext, {});
let data = [];
let labels = [];
let paidToDate = [];

CALC_BUTTON.addEventListener("click", start);

function start(event) {
  event.preventDefault();
  checkInputs();
  createPaymentSchedule();
  drawGraph();
}

function createPaymentSchedule() {
i = interestRateInput.value / 100;
loan_amt = loanAmountInput.value;
months = loanTenureInput.value;
rate = interestRateInput.value;

const regexNumber = /^[0-9]*(\.[0-9]{0,2})?$/;
if (!loan_amt.match(regexNumber)) {
  loanAmountInput.value = "10000";
}
let monthly_payment =
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
info += "<tr><td>Total Payment:</td>";
info +=
  "<td align='right'>$" + round(monthly_payment, 2) + "</td></tr>";
info += "</table>";
document.getElementById("results").innerHTML = info; // info is a string container all the html table code

var table = "";
data = [];
labels= [];
paidToDate = [];

table += "<table class='tableFixHead'";
table += '<thead><tr><th><span class="text">Month</span></th><th><span class="text">Payment</span></th><th><span class="text">Towards<br/>Principal</span></th><th><span class="text">Towards<br/>Interest</span></th><th><span class="text">Interest Paid<br/>to Date</span></th><th><span class="text">Loan Balance</span></th></tr></thead>';
table += "<tbody><tr>";
table += "<td align='center'>0</td>";
table += "<td></td>";
table += "<td></td>";
table += "<td></td>";
table += "<td></td>";
table += "<td align='center'>" + round(loan_amt, 2) + "</td>";
table += "</tr>";

let current_balance = loan_amt;
let payment_counter = 1;
let total_interest = 0;
data.push(current_balance);
labels.push(payment_counter);
paidToDate.push(monthly_payment);

while (current_balance > 0) {
  //create rows

  towards_interest = (i / 12) * current_balance; //this calculates the portion of your monthly payment that goes towards interest

  if (monthly_payment > current_balance) {
    monthly_payment = current_balance + towards_interest;
  }

  towards_balance = monthly_payment - towards_interest;
  total_interest = total_interest + towards_interest;
  current_balance = current_balance - towards_balance;

  // display row

  table += "<tr>";
  table += "<td align='center'>" + payment_counter + "</td>";
  table += "<td align='center'>" + round(monthly_payment, 2) + "</td>";
  table += "<td align='center'>" + round(towards_balance, 2) + "</td>";
  table += "<td align='center'>" + round(towards_interest, 2) + "</td>";
  table += "<td align='center'>" + round(total_interest, 2) + "</td>";
  table += "<td align='center'>" + round(current_balance, 2) + "</td>";
  table += "</tr>";

  payment_counter++;

  if (current_balance != 0) {
    data.push(current_balance);
    labels.push("Month " + payment_counter);
    paidToDate.push(loan_amt - current_balance)
  }

}
table += "</tbody></table>";

document.getElementById("loan-info").innerHTML = table;

//The schedule data has been created, render the graph.

}


  


function checkInputs() {
  
  let regexFilter = /^[1-9]\d*$/;
  if (!loanAmountInput.value.match(regexFilter)) {
    setErrorFor(loanAmountInput, "Invalid amount entered.");
	}else{
    setSuccessFor(loanAmountInput);
  }

  regexFilter = /^(?!(?:0|0\.0|0\.00)$)[+]?\d+(\.\d|\.\d[0-9])?$/;
  if (!interestRateInput.value.match(regexFilter)) {
    setErrorFor(interestRateInput, "Invalid rate entered.");
	}else{
    setSuccessFor(interestRateInput);
  }

  regexFilter = /^[1-9]\d*$/;
  if (!loanTenureInput.value.match(regexFilter)) {
    setErrorFor(loanTenureInput, "Invalid term entered.");
	}else{
    setSuccessFor(loanTenureInput);
  }

}

function setErrorFor(input, message) {
	let formControl = input.parentElement;
	formControl.className = 'input-group error';
}

function setSuccessFor(input) {
	const formControl = input.parentElement;
	formControl.className = 'input-group success';
}

function drawGraph() {
  line.destroy();
  line = new Chart(chartContext, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Amount Owing",
          data,
          fill: true,
          backgroundColor: "rgba(12, 141, 0, 0.7)",
          borderWidth: 3,
        },
        {
          label: "Payments Made",
          backgroundColor: "rgba(104, 158, 217, 0.8)",
          data: paidToDate,
        },
      ],
    },
  });
}

function round(num, dec) {
  return (Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec)).toFixed(dec);
}