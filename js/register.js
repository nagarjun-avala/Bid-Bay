let userId = window.localStorage.getItem("userId");

if (userId) {
  window.location.assign("./home.html");
}

let arr = {};
// let forms=document.getElementsByTagName("form");
document.forms[0].addEventListener("submit", (e) => {
  e.preventDefault();

  var credentials = {
    fullname: e.target[0].value,
    email: e.target[1].value,
    mobile: e.target[2].value,
    password: e.target[3].value,
    cpassword: e.target[4].value,
    amount: 1000000,
  };

  let error = document.getElementById("error");
  let lp = document.getElementById("lp");

  fetch(`http://localhost:3000/users?email=${credentials.email}`, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((val) => {
      return val.json();
    })
    .then((val) => {
      if (val.length !== 0) {
        error.style.display = "block";
      } else {
        if (credentials.password != credentials.cpassword) {
          lp.style.display = "block";
        } else {
          fetch("http://localhost:3000/users", {
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fullname,
              email,
              mobile,
              password,
              amount,
            }),
          });
          window.location.assign("./login.html");
        }
      }
    });
});
