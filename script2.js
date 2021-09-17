const weatherApi = {
    endpoint: "https://api.openweathermap.org/data/2.5/",
    key: "039a49846f20e6eb5224c123a6c69dcc",
}

const timeApi = {
    endpoint: "https://timezone.abstractapi.com/v1/current_time/",
    key: "cdcbe10650b345799a29947de85a108a",
}

const geoApi = {
    endpoint: "https://ipgeolocation.abstractapi.com/v1/",
    key: "811570baed564b3eb661c38e8c8dd207",
}

const searchInput = document.querySelector(".cityInput");
searchInput.addEventListener("keyup", enterOrEsc);
searchInput.addEventListener("blur", inputBlur);


async function enterOrEsc(e) {
    if (searchInput.value.length === 0) {
        if (e.key === "Enter" || e.key === "Escape")
            closeInput();
    }
    
    else {
        if (e.key === "Enter") {
            if (await getInfo(searchInput.value)) {
                getTime(searchInput.value);
                closeInput();
            }
        }
        else if (e.key === "Escape") {
            closeInput();
        }
    }
}

function inputBlur() {
    closeInput();
}


let myTime = new Date(1631740436);
async function getTime(city) {
    const resultForTime = await fetch(`${timeApi.endpoint}?api_key=${timeApi.key}&location=${city}`);
    const resultReceivedForTime = await resultForTime.json();
    if (Object.keys(resultReceivedForTime).length != 0) {
        let time = resultReceivedForTime.datetime;
        myTime = new Date(time);
    }
    else return
}


let timeInterval = setInterval(function calculateTime() {
    let timeSelector = document.querySelector("#time");
    myTime.setSeconds(myTime.getSeconds() + 1);
    let a = `${("0" + myTime.getHours()).substr(-2)}:${("0" + myTime.getMinutes()).substr(-2)}:${("0" + myTime.getSeconds()).substr(-2)}`;
    timeSelector.textContent = a;
}, 1000)

async function getInfo(city) {

    const result = await fetch(`${weatherApi.endpoint}weather?q=${city}&units=metric&appID=${weatherApi.key}`);
    const resultReceived = await result.json();

    if (result.status === 404) {
        searchInput.classList.add("redBorder");
        return false;
    }
    else {
        displayResult(resultReceived);
        searchInput.classList.remove("redBorder");
        return true;
    };
}

async function geolocation() {
    const result = await fetch(`${geoApi.endpoint}?api_key=${geoApi.key}`);
    const resultReceived = await result.json();

    getInfo(resultReceived.city);
    getTime(resultReceived.city);

}

// geolocation()
const citySelector = document.querySelector(".cityName");


// display value on the page
function displayResult(resultReceived) {


    let dateSelector = document.querySelector("#date");
    let tempSelector = document.querySelector(".temperature");
    let feelsLikeSelector = document.querySelector(".feelsLike");
    let conditionsSelector = document.querySelector(".conditions");

    citySelector.textContent = `${resultReceived.name}, ${resultReceived.sys.country}`;
    dateSelector.textContent = resultReceived.dt;
    tempSelector.innerHTML = `${Math.round(resultReceived.main.temp)}<span>°</span>`;
    feelsLikeSelector.innerHTML = `Feels like: ${Math.round(resultReceived.main.feels_like)}<span>°</span>`;
    conditionsSelector.textContent = resultReceived.weather[0].description;



    document.querySelector(".currentWeather img").src = `https://openweathermap.org/img/wn/${resultReceived.weather[0].icon}@2x.png`


    // field of date
    getDate(dateSelector, resultReceived.dt);
}

// calculate date of city
function getDate(date, value) {

    const myDate = new Date(new Date(value * 1000).toUTCString().slice(0, -3));
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    date.textContent = weekdays[myDate.getDay()] + " " + myDate.getDate() + " " + months[myDate.getMonth()] + " " + myDate.getFullYear();
}


// input of city
const closeButton = document.querySelector(".questionText img");
const questionBlock = document.querySelector(".questionBlock");
const cityAnswerNo = document.querySelector(".answerNo");
const cityAnswerYes = document.querySelector(".answerYes");
const cityBlock = document.querySelector(".cityBlock");

searchInput.addEventListener("mouseover", inputAnimation);
citySelector.addEventListener("click", inputAnimation);
closeButton.addEventListener("click", closeCityQuestion);
cityAnswerYes.addEventListener("click", closeCityQuestion);
cityAnswerNo.addEventListener("click", inputAnimation);


function inputAnimation() {
    searchInput.classList.remove("cityInputSmall");
    searchInput.style.width = "400px";
    questionBlock.style.display = "none";
    cityBlock.style.zIndex = -1;
    let myInterval = setInterval(() => {
        searchInput.classList.add("emergence");
        searchInput.focus();
        clearInterval(myInterval)
    }, 510);
}

function closeCityQuestion() {
    questionBlock.style.opacity = 0;
    cityAnswerNo.disabled = "true";
    cityAnswerYes.disabled = "true";
    let myInterval = setInterval(() => {
        questionBlock.style.display = "none";
        clearInterval(myInterval);
    }, 1010);
}

function closeInput() {
    searchInput.style.width = "80px";
    searchInput.blur();
    searchInput.classList.remove("emergence");
    searchInput.value = "";
    searchInput.classList.remove("redBorder");
}





const labels = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
  ];
  const data = {
    labels: labels,
    datasets: [{
      label: 'My First dataset',
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgb(255, 99, 132)',
      data: [0, 10, 5, 2, 20, 30, 45],
    }]
  };


  const config = {
    type: 'line',
    data: data,
    options: {}
  };


  var myChart = new Chart(
    document.getElementById('myChart'),
    config
  );