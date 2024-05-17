var userId = window.localStorage.getItem("userId");

var bidData = "";

var loggedUser = {};

var usersData = [];

function formatIndianCurrency(number) {
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  });
  return formatter.format(number);
}

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
      loggedUser = { ...data, password: "" };
      document.getElementById("profile").innerHTML =
        loggedUser.fullname[0].toUpperCase() + loggedUser.fullname.slice(1);
      // console.log(loggedUser)
    });
}

function getRandomObjectsFromArray(array, numObjects) {
  const randomObjects = [];

  // Ensure numObjects is not greater than the length of the array
  numObjects = Math.min(numObjects, array.length);

  while (randomObjects.length < numObjects) {
    const randomIndex = Math.floor(Math.random() * array.length);
    const randomObject = array[randomIndex];

    // Check if the object is already selected
    if (!randomObjects.includes(randomObject)) {
      randomObjects.push(randomObject);
    }
  }

  return randomObjects;
}

const getUsers = async () => {
  await fetch(`http://localhost:3000/users`, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((val) => {
      return val.json();
    })
    .then((data) => {
      usersData = [...data];

      usersData = usersData.filter(
        (user) => user.id != 1 && user.id != loggedUser.id
      );

      // console.log("usersData", { usersData });

      usersData = getRandomObjectsFromArray(usersData, 3);

      wonUser = localStorage.getItem("wonUser")

      // console.log("randomObjects", { usersData });
      let usersEle = document.getElementById("users");
      console.log(bidData);
      bidData.isActive ? showUsers() : usersEle.innerHTML = `<h1>Bid Won By ${wonUser.toUpperCase()}</h1>`;
    });
};

const showUsers = () => {
  var usersTag = document.getElementsByClassName("user_name");

  // This is for 1st User
  usersTag[0].innerHTML =
    loggedUser.fullname[0].toUpperCase() + loggedUser.fullname.slice(1);

  // Thsi is for other users
  for (let i = 0; i < usersTag.length; i++) {
    const name = usersData[i].fullname;
    usersTag[i + 1].innerHTML = name[0].toUpperCase() + name.slice(1);
    // console.log(usersData[i],i);
  }
};

bidData = localStorage.getItem("bid");
bidData = JSON.parse(bidData);
// console.log(bidData);
var pr = bidData["price"];

let no = document.getElementById("no");
no.append(bidData["number"]);

let price = document.getElementById("price");
price.innerText = formatIndianCurrency(pr);

let timerElement = document.getElementById("timer");

// Timer function
var timer;
function countdownTimer(bidUserId, amount) {
  let seconds = 10;
  timerElement.innerHTML = `${seconds} s`;
  timer = setInterval(function () {
    if (seconds > 0) {
      timerElement.innerHTML = `${seconds} s`;
      seconds--;
    } else {
      clearInterval(timer);
      timerElement.innerHTML = `0  s`;

      fetchBidClose(bidUserId, amount);
    }
  }, 1000);
}

async function fetchBidClose(bidUserId, bidAmount) {
  var user = {};
  // This Fetch function is for getting the user details - Amount
  await fetch(`http://localhost:3000/users?id=${bidUserId}`, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((val) => {
      return val.json();
    })
    .then(async (data) => {
      user = data[0];

      bidData = {
        ...bidData,
        isActive: false,
        bidAmount,
      };

      var updatedData = {
        ...user,
        amount: user.amount - bidAmount,
        bidsWon: [...user.bidsWon, bidData],
      };

      // TODO: ,bidsWon:[...user.bidsWon,] Add won bid ids
      // Updating bid data: Setting isActive to false
      await fetch(`http://localhost:3000/bids/${bidData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bidData),
      });
      // Then Update Amount
      await fetch(`http://localhost:3000/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      })
        .then((val) => {
          return val.json();
        })
        .then((value) => {
          console.log(value);
          setTimeout(() => {
            confirm(
              `${
                user.fullname[0].toUpperCase() + user.fullname.slice(1)
              } won the bid`
            );
            window.location.assign("/home.html");
          }, 2000);
        });
      localStorage.setItem("bid", JSON.stringify(bidData));
      localStorage.setItem("wonUser", JSON.stringify(user.fullname[0].toUpperCase() + user.fullname.slice(1)));
    });
  window.location.reload();
  // console.log({ bidUserId, amount });
}

// countdownTimer();
// let l_bid=localStorage.getItem("last-bid-amount")
// Stpes
/*
 1.User will Enter Amount
 2.User will hit Bid Button => Onclick Event
 3.Collect Input Values from input field
 4.Check amount with previous bid Value or plate value
 5.Start the Timer
*/

var activebid = document.getElementsByClassName("active_bid");

var user_amount = pr;
// console.log(user_amount);

function user1(e) {
  e.preventDefault();

  if (Number(e.target[0].value) > user_amount) {
    let usersTag = document.getElementsByClassName("user_name");
    let n = localStorage.getItem("userName");
    console.log(usersTag);

    user_amount = Number(e.target[0].value);
    clearInterval(timer);
    console.log(user_amount);
    document.getElementById("bid_amount1").innerText = formatIndianCurrency(
      e.target[0].value
    );

    countdownTimer(loggedUser.id, user_amount);

    activebid[0].classList.add("active");
    activebid[1].classList.remove("active");
    activebid[2].classList.remove("active");
    activebid[3].classList.remove("active");
  }
}

function user2(e) {
  e.preventDefault();

  if (Number(e.target[0].value) > user_amount) {
    user_amount = Number(e.target[0].value);
    clearInterval(timer);
    console.log(user_amount);
    document.getElementById("bid_amount2").innerText = formatIndianCurrency(
      e.target[0].value
    );
    countdownTimer(usersData[0].id, user_amount);

    activebid[1].classList.add("active");
    activebid[0].classList.remove("active");
    activebid[2].classList.remove("active");
    activebid[3].classList.remove("active");
  }
}

function user3(e) {
  e.preventDefault();

  console.log(e.target[0].value);

  if (Number(e.target[0].value) > user_amount) {
    user_amount = Number(e.target[0].value);
    clearInterval(timer);
    console.log(user_amount);
    document.getElementById("bid_amount3").innerText = formatIndianCurrency(
      e.target[0].value
    );
    countdownTimer(usersData[1].id, user_amount);

    activebid[2].classList.add("active");
    activebid[1].classList.remove("active");
    activebid[0].classList.remove("active");
    activebid[3].classList.remove("active");
  }
}

function user4(e) {
  e.preventDefault();

  if (Number(e.target[0].value) > user_amount) {
    user_amount = Number(e.target[0].value);
    clearInterval(timer);
    console.log(user_amount);
    document.getElementById("bid_amount4").innerText = formatIndianCurrency(
      e.target[0].value
    );
    countdownTimer(usersData[2].id, user_amount);

    activebid[3].classList.add("active");
    activebid[1].classList.remove("active");
    activebid[2].classList.remove("active");
    activebid[0].classList.remove("active");
  }
}

document.forms[0].addEventListener("submit", user1);

document.forms[1].addEventListener("submit", user2);

document.forms[2].addEventListener("submit", user3);

document.forms[3].addEventListener("submit", user4);

profile();
getUsers();
