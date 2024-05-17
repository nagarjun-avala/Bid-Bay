let userId = window.localStorage.getItem("userId");

let userData = {};

let nums = [];

const home = async () => {
  if (!userId) {
    window.location.assign("/login.html");
  } else {
    fetch(`http://localhost:3000/users?id=${userId}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((val) => {
        return val.json();
      })
      .then((data) => {
        userData = { ...data[0] };
        console.log(userData);
        let userProfile = document.getElementById("profile");
        let name = userData["fullname"][0].toUpperCase() + userData["fullname"].slice(1);
        userProfile.innerText = name
          
        showBidData();
      });
  }
};
const showBidData = async () => {
  let container = document.createElement("div");
  container.setAttribute("id", "container");
  document.body.append(container);

  fetch(`http://localhost:3000/bids`, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((val) => {
      return val.json();
    })
    .then((data) => {
      nums = [...data];

      nums = nums.filter((number) => number.isActive === true);
      // console.log(nums);

      if(nums.length > 0)
      {
        for (let i = 0; i < nums.length; i++) {
            prdt = document.createElement("div");
            prdt.setAttribute("class", "prdt");
            container.appendChild(prdt);
    
            let h1 = document.createElement("h1");
            h1.innerText = nums[i]["number"];
            prdt.append(h1);
            h1.style.fontFamily = " sans-serif";
    
            let pd = document.createElement("div");
            pd.setAttribute("class", "pd");
            prdt.append(pd);
    
            let p = document.createElement("p");
            p.innerText = "₹ " + nums[i]["price"] + " /-";
            pd.append(p);
    
            let d = document.createElement("footer");
            d.setAttribute("class", "d");
            prdt.append(d);
    
            let btn = document.createElement("button");
            btn.setAttribute("type", "submit");
            btn.innerText = "BID";
            btn.style.marginBottom = "5px";
            btn.style.width = "120px";
            btn.style.height = "30px";
            btn.style.borderRadius = "10px";
            d.append(btn);
    
            prdt.addEventListener("click", () => {
              details = {
                ...nums[i]
              };
              a = JSON.stringify(details);
              console.log(a);
              localStorage.setItem("bid", a);
              window.location.assign("/bid.html");
            });
          }
      }
      else{
        prdt = document.createElement("h1");
            prdt.setAttribute("class", "prdt");
            prdt.innerText = "No Data"
            container.appendChild(prdt);
      }
      
    });
};

home();
