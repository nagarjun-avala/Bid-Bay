var userId = window.localStorage.getItem("userId");
var loggedUser = {};

async function profile() {
  await fetch(`http://localhost:3000/users/${userId}`, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((val) => {
      return val.json();
    })
    .then((data) => {
      loggedUser = { ...data };
      // call showProfile()
      showProfile();
    });
}

function showProfile() {
  let profileCard = document.getElementById("card");

  console.log(loggedUser.bidsWon[0]);

  let profileContent = `
    <div class="row">
        <div class="col key">Name:</div>
        <div class="col value capitalize">${loggedUser.fullname}</div>
    </div>
    <div class="row">
        <div class="col key">Email:</div>
        <div class="col value">${loggedUser.email}</div>
    </div>
    <div class="row">
        <div class="col key">Balence:</div>
        <div class="col value">${formatIndianCurrency(loggedUser.amount)}</div>
    </div>
    <div class="row">
        <div class="col key">Mobile:</div>
        <div class="col value">+91 ${loggedUser.mobile}</div>
    </div>
    <div class="row">
        <div class="col key">Password:</div>
        <div class="col value">"${loggedUser.password}"</div>
    </div>
    <div class="row">
        <div class="col key">Bids Won:</div>
        <div class="col value">${
          loggedUser.bidsWon.length !== 0
            ? loggedUser.bidsWon.length
            : "No bids won"
        }</div>
    </div>
`;

  var card = "";

  if (loggedUser.bidsWon.length > 0) {
    console.log("Bids Wom");
    loggedUser.bidsWon.forEach((bid) => {
      card += `
        <div class="card">
          <h3>${bid.number}</h3>
          <div class="row">
            <div class="col">Price:</div>
            <div class="col">${formatIndianCurrency(bid.price)}</div>
          </div>
          <div class="row">
            <div class="col">Bid Cost:</div>
            <div class="col">${formatIndianCurrency(bid.bidAmount)}</div>
          </div>
          <div class="row">
            <div class="col">Difference:</div>
            <div class="col">${formatIndianCurrency(bid.bidAmount - bid.price)}</div>
          </div>
        </div>
      `;
    });
  }

  let loopBids = `
  <hr />
  <div class="container">
      <h2>Won Bids</h2>
      <div class="card-container">
      ${card}
      </div>
  </div>
`;

  console.log("card", card);

  profileCard.innerHTML = `
  ${profileContent} 
  ${loggedUser.bidsWon.length > 0 ? loopBids : ""}
  `;
}

function formatIndianCurrency(number) {
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  });
  return formatter.format(number);
}

profile();
