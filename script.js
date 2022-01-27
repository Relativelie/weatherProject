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

const unsplashApi = {
    endpoint: "https://api.unsplash.com/search/photos?page=1",
    key: "Nicqe4pvm32eeoDtCy6hoVcTux3D0mq4wOtmEV-MNs0",
}

const searchInput = document.querySelector(".cityInput");
searchInput.addEventListener("keyup", enterOrEsc);
searchInput.addEventListener("blur", closeInput);


// press the key ENTER or ESCAPE
async function enterOrEsc(e) {
    if (e.target.value === "") {
        if (e.key === "Enter" || e.key === "Escape")
            closeInput();
    }

    else {
        if (e.key === "Enter") {
            if (await getInfo(e.target.value)) {
                getTime(e.target.value);
                getInfo(e.target.value);
                getWeatherForWholeDay(e.target.value);
                getImage(e.target.value);
                closeInput();
            }
        }
        else if (e.key === "Escape") {
            closeInput();
        }
    }
}


// receiving time data through timeApi
let myTime = new Date(1631740436);


async function getTime(city) {
    
    const resultForTime = await fetch(`${timeApi.endpoint}?api_key=${timeApi.key}&location=${city}`);
    const resultReceivedForTime = await resultForTime.json();
    if (Object.keys(resultReceivedForTime).length != 0) {
        let time = resultReceivedForTime.datetime.replace(/-/g, "/");
        myTime = new Date(time);
    }
    else return
}

// get time on the page
let timeInterval = setInterval(function calculateTime() {
    let timeSelector = document.querySelector("#time");
    myTime.setSeconds(myTime.getSeconds() + 1);
    let a = `${("0" + myTime.getHours()).substr(-2)}:${("0" + myTime.getMinutes()).substr(-2)}:${("0" + myTime.getSeconds()).substr(-2)}`;
    timeSelector.textContent = a;
}, 1000)


// receiving weather data through weatherApi
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


// finding geolocation through geoApi
async function geolocation() {
    const result = await fetch(`${geoApi.endpoint}?api_key=${geoApi.key}`);
    const resultReceived = await result.json();
    getInfo(resultReceived.city);
    getTime(resultReceived.city);
    getImage(resultReceived.city.replace(/[^\w\s]|_/g, ""));
    getWeatherForWholeDay(resultReceived.city);

}

geolocation()
const citySelector = document.querySelector(".cityName");
let tempSelector = document.querySelector(".temperature");
let feelsLikeSelector = document.querySelector(".feelsLike");
const switchSelector = document.querySelector(".switch input");

// display value on the page
function displayResult(resultReceived) {


    let dateSelector = document.querySelector("#date");

    let conditionsSelector = document.querySelector(".conditions");

    citySelector.textContent = `${resultReceived.name}, ${resultReceived.sys.country}`;
    dateSelector.textContent = resultReceived.dt;

    conditionsSelector.textContent = resultReceived.weather[0].description;


    if (switchSelector.checked) {
        tempSelector.innerHTML = `${Math.round(resultReceived.main.temp * 9 / 5 + 32)}<span>°F</span>`;
        feelsLikeSelector.innerHTML = `Feels like: ${Math.round(resultReceived.main.feels_like * 9 / 5 + 32)}<span>°F</span>`;
    }
    else {
        tempSelector.innerHTML = `${Math.round(resultReceived.main.temp)}<span>°C</span>`;
        feelsLikeSelector.innerHTML = `Feels like: ${Math.round(resultReceived.main.feels_like)}<span>°C</span>`;
    }


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


// animation for opening input
function inputAnimation() {
    searchInput.classList.remove("cityInputSmall");
    questionBlock.style.display = "none";
    cityBlock.style.zIndex = -1;

    if (screen.width >= 300 && screen.width <= 430) {
        searchInput.style.width = "280px";
    }
    else if (screen.width < 300) {
        searchInput.style.width = "250px";
    }
    else {
        searchInput.style.width = "400px";
    }

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
    searchInput.blur();
    searchInput.classList.remove("emergence");
    searchInput.value = "";
    searchInput.classList.remove("redBorder");
    cityBlock.style.zIndex = 1;

    if (screen.width <= 550) {
        searchInput.style.width = "50px";
    }

    else {
        searchInput.style.width = "80px";
    }
}

let temperature = [];
async function getWeatherForWholeDay(city) {
    temperature = [];
    let result = await fetch(`${weatherApi.endpoint}forecast?q=${city}&appid=${weatherApi.key}`);
    let resultReceived = await result.json();
    for (let i = 0; i < resultReceived.list.length; i++) {
        temperature.push([resultReceived.list[i].dt_txt, resultReceived.list[i].main.temp, resultReceived.list[i].weather[0].main, resultReceived.list[i].weather[0].icon]);
    }

    showValueForWholeDay()
    showValueForFiveDays(resultReceived)
}



function showValueForWholeDay() {
    const timeForTempWholeDay = document.querySelectorAll(".timeForTempWholeDay");
    const tempForTempWholeDay = document.querySelectorAll(".tempForTempWholeDay");
    const image = document.querySelectorAll(".duringTheDayItem img");


    if (switchSelector.checked) {
        for (let i = 0; i < 5; i++) {
            timeForTempWholeDay[i].textContent = temperature[i][0].slice(11, 16);
            tempForTempWholeDay[i].textContent = `${Math.round(temperature[i][1] * 9 / 5 - 459.67)}°F`;
            image[i].src = `https://openweathermap.org/img/wn/${temperature[i][3]}@2x.png`;
        }
    }

    else {
        for (let i = 0; i < 5; i++) {
            timeForTempWholeDay[i].textContent = temperature[i][0].slice(11, 16);
            tempForTempWholeDay[i].textContent = `${Math.round(temperature[i][1] - 273.15)}°C`;
            image[i].src = `https://openweathermap.org/img/wn/${temperature[i][3]}@2x.png`
        }
    }
}
const allDays = document.querySelectorAll(".day");
const allMin = document.querySelectorAll(".tempForDayMin span");
const allMax = document.querySelectorAll(".tempForDayMax span");


function showValueForFiveDays(value) {
    let allTemp = [];
    allTemp.push([value.list[0].dt_txt.slice(0, 10), value.list[0].main.temp]);
    let currentDay = 0;
    let icons = [];
    icons.push([value.list[0].weather[0].icon]);
    while (currentDay < 5) {
        for (let currentRecording = 1; currentRecording < 40; currentRecording++)
            if (allTemp[currentDay][0] === value.list[currentRecording].dt_txt.slice(0, 10)) {
                allTemp[currentDay].push(value.list[currentRecording].main.temp);
                icons[currentDay].push(value.list[currentRecording].weather[0].icon);

            }
            else {
                currentDay++;
                allTemp.push([value.list[currentRecording].dt_txt.slice(0, 10), value.list[currentRecording].main.temp]);
                icons.push([value.list[currentRecording].weather[0].icon])
            }
    }
    let minAndMaxTemp = [];
    let countOfRange = [];
    for (let i = 0; i < allTemp.length; i++) {
        let counts = {};
        let minTemp = Math.min.apply(Math, allTemp[i].slice(-(allTemp[i].length - 1)));
        let maxTemp = Math.max.apply(Math, allTemp[i].slice(-(allTemp[i].length - 1)));
        icons[i].forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });
        minAndMaxTemp.push([allTemp[i][0], maxTemp, minTemp]);
        countOfRange.push(counts)
    }

    let resultOfIcon = [];
    for (let item = 0; item < countOfRange.length; item++) {
        countOfRange[item];
        let dailyIcons = [];
        for (let iconName in countOfRange[item]) {
            dailyIcons.push([iconName, countOfRange[item][iconName]]);
        }
        dailyIcons.sort(function (a, b) {
            return b[1] - a[1];
        });
        resultOfIcon.push(dailyIcons[0][0])
    }
    const fiveDaysItemIcon = document.querySelectorAll(".fiveDaysItem img")

    for (let resultOfIconItem = 0; resultOfIconItem < resultOfIcon.length - 1; resultOfIconItem++) {
        fiveDaysItemIcon[resultOfIconItem].src = `https://openweathermap.org/img/wn/${resultOfIcon[resultOfIconItem]}@2x.png`
    }


    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    for (let selector = 0; selector < allDays.length; selector++) {
        allDays[selector].textContent = `${months[parseInt(minAndMaxTemp[selector][0].slice(5, 7)) - 1]} ${minAndMaxTemp[selector][0].slice(-2)}`;
        allMin[selector].textContent = `${Math.round((minAndMaxTemp[selector][2] - 273.15) * 9 / 5 + 32)}°F`;
        allMax[selector].textContent = `${Math.round((minAndMaxTemp[selector][1] - 273.15) * 9 / 5 + 32)}°F`;
    }
}

switchSelector.addEventListener("input", showValueForWholeDay);
switchSelector.addEventListener("input", fahrenheitToCelsius);
switchSelector.addEventListener("input", fahrenheitToCelsius);



function fahrenheitToCelsius() {
    if (switchSelector.checked) {
        // for today weather
        tempSelector.innerHTML = `${Math.round((parseInt(document.querySelector("p.temperature").textContent) * 9 / 5 + 32))}<span>°F</span>`;
        feelsLikeSelector.innerHTML = `Feels like: ${Math.round((parseInt(document.querySelector(".feelsLike").textContent.substring(11, document.querySelector(".feelsLike").textContent.length)) * 9 / 5 + 32))}<span>°F</span>`;
        // for 5 days weather
        let minHeight;
        let maxHeight;
        for (let i = 0; i < allMax.length; i++) {
            minHeight = allMin[i].textContent.length;
            maxHeight = allMax[i].textContent.length;
            allMin[i].textContent = `${Math.round((parseInt(allMin[i].textContent.slice(0, (minHeight - 2))) * 9 / 5 + 32))}°F`;
            allMax[i].textContent = `${Math.round((parseInt(allMax[i].textContent.slice(0, (maxHeight - 2))) * 9 / 5 + 32))}°F`;
        }

    }
    else {
        // for today weather
        tempSelector.innerHTML = `${Math.round((parseInt(document.querySelector("p.temperature").textContent) - 32) * 5 / 9)}<span>°C</span>`;
        feelsLikeSelector.innerHTML = `Feels like: ${Math.round((parseInt(document.querySelector(".feelsLike").textContent.substring(11, document.querySelector(".feelsLike").textContent.length)) - 32) * 5 / 9)}<span>°C</span>`

        // for 5 days weather
        let minHeight;
        let maxHeight;
        for (let i = 0; i < allMax.length; i++) {
            minHeight = allMin[i].textContent.length;
            maxHeight = allMax[i].textContent.length;
            allMin[i].textContent = `${Math.round((parseInt(allMin[i].textContent.slice(0, (minHeight - 2))) - 32) * 5 / 9)}°C`;
            allMax[i].textContent = `${Math.round((parseInt(allMax[i].textContent.slice(0, (maxHeight - 2))) - 32) * 5 / 9)}°C`;
        };
    }
}


// background images
async function getImage(city) {
    const result = await fetch(`${unsplashApi.endpoint}&query=${city}&per_page=1`, {
        headers: {
            'Authorization': 'Client-ID Nicqe4pvm32eeoDtCy6hoVcTux3D0mq4wOtmEV-MNs0'
        }
    }
    );
    const resultReceived = await result.json();
    if (resultReceived.total_pages === 0) {
        document.body.style.backgroundImage = `url("images/backgroundForNonFamousPlaces.jpg")`;
    }

    else document.body.style.backgroundImage = `url("${resultReceived.results[0].urls.full}")`;
}

