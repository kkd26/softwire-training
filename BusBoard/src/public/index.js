const root = document.getElementById("root");
const form = document.getElementById("form");

form.onsubmit = submitForm;

function submitForm(e) {
  e.preventDefault();
  const target = e.target;
  const postcodeInput = target.children.postcode;
  const postcode = postcodeInput.value;

  getBuses(postcode);
}

function getBuses(postcode) {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", `http://localhost:3000/departureBoards/${postcode}`, true);

  xhttp.setRequestHeader("Content-Type", "application/json");

  xhttp.onload = function () {
    const busData = JSON.parse(this.responseText);

    if (this.status >= 400) {
      displayError(busData);
    } else {
      loadData(busData);
    }
  };

  xhttp.send();
}

function loadData(busData) {
  root.innerText = "";

  if (isEmpty(busData)) {
    root.innerText = "There are no bus stops near your location";
    return;
  }

  for (const stopName in busData) {
    if (Object.hasOwnProperty.call(busData, stopName)) {
      const busList = busData[stopName];
      const ul = createUl(stopName, busList);
      root.appendChild(ul);
    }
  }
}

function createUl(stopName, busList) {
  const ul = document.createElement("ul");
  ul.innerHTML = `<div class="stopName">${stopName}</div>`;

  for (const busInfo of busList) {
    const li = document.createElement("li");

    const diff = new Date(busInfo.expectedArrival) - new Date();

    const time = new Date(Math.max(0, diff));

    const minutes = time.getMinutes();

    const formattedTime = `${
      minutes ? `${minutes} min${minutes == 1 ? "" : "s"}` : "due"
    }`;

    li.innerHTML = `<div class="lineName">${busInfo.lineName}</div><div class="destinationName">${busInfo.destinationName}</div><div class="expectedArrival">${formattedTime}</div>`;
    ul.appendChild(li);
  }

  return ul;
}

function displayError({ message }) {
  alert(message);
}

function isEmpty(obj) {
  return obj && Object.keys(obj).length === 0;
}
