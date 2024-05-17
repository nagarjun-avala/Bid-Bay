let userId = window.localStorage.getItem("userId");

if (userId) {
  window.location.assign("./home.html");
}

let arr = {};
document.forms[0].addEventListener("submit", (e) => {
  e.preventDefault();
  let data = {
    email: e.target[0].value,
    password: e.target[1].value,
  };

  fetch(`http://localhost:3000/users?email=${data.email}`, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((val) => {
      return val.json();
    })
    .then((val) => {
      arr = val[0];
      // console.log(arr);
      let id = "";

      if (!arr) {
        alert("Email does not exsist!. Please Register now");
      } else {
        if (data.password !== arr.password) {
          alert("Check your email and password!. Invalid credentials");
        } else {
          // alert("log in successfully")
          window.localStorage.setItem("userId", arr.id);
          window.localStorage.setItem("userName", arr.fullname);
          window.location.assign("./home.html");
        }
      }
    });
});
