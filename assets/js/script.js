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
  document.getElementById("results").innerHTML = info; // info is a string container all the html table code

  var table = "";
  data = [];
  labels= [];

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

  var current_balance = loan_amt;
  var payment_counter = 1;
  var total_interest = 0;
  monthly_payment = monthly_payment + extra;

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
    data.push(current_balance);
    labels.push(payment_counter);
  }
  table += "</tbody></table>";

  document.getElementById("loan-info").innerHTML = table;

  //The schedule data has been created, render the graph.

  drawGraph();
  
}


function drawGraph() {
  line.destroy();
  line = new Chart(context, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Repayments",
          data,
          fill: true,
          backgroundColor: "rgba(12, 141, 0, 0.7)",
          borderWidth: 3,
        },
      ],
    },
  });
}

function round(num, dec) {
  return (Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec)).toFixed(dec);
}