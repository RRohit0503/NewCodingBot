const searchWeatherTab = document.querySelector(".search-weather-tab");
const userWeatherTab = document.querySelector(".user-weather-tab");
const displayWeather = document.querySelector(".display-weather");
const inputSearch = document.querySelector(".input-search");
const searchText = document.querySelector(".search");
const searchBtn = document.querySelector(".search-btn");
const grantAccessContainer = document.querySelector(".grant-access");
const grantAccessBtn = document.querySelector(".grant-access-btn");
const loadingScreen = document.querySelector(".loading-screen");
const errorContainer = document.querySelector(".error-message");
const errorText = document.querySelector(".error-text");
const apiErrorImg = document.querySelector("data-notFound");

const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";

let currentTab = userWeatherTab;
currentTab.classList.add("current-tab");

//Change Tab
function switchTab(clickedTab) {
  errorContainer.classList.add("error");
  //User Tab
  if (clickedTab !== currentTab) {
    currentTab.classList.remove("current-tab");
    currentTab = clickedTab;
    currentTab.classList.add("current-tab");
    if (!inputSearch.classList.contains("in-search")) {
      document.body.style.backgroundImage = "none";
      inputSearch.classList.add("in-search");
      displayWeather.classList.add("dis-weather");
      userWeatherTab.classList.remove(".user-weather-tab");
      getFromSessionStorage();
    }
    //Search Tab
    else {
      document.body.style.backgroundImage = "none";
      displayWeather.classList.add("dis-weather");
      inputSearch.classList.remove("in-search");
      grantAccessContainer.classList.add("grant-acc");
      searchWeatherTab.classList.remove(".search-tab");
      displayWeather.style.padding = "2px";
    }
  }
}

searchWeatherTab.addEventListener("click", () => {
  switchTab(searchWeatherTab);
});

userWeatherTab.addEventListener("click", () => {
  switchTab(userWeatherTab);
});

//Changing Background image According to Weather-Type
function changeBackground(weatherType) {
  if (weatherType === "Clouds") {
    document.body.style.backgroundImage =
      "url('./images/istockphoto-912014918-612x612.jpg')";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = "100% 100%";
  } else if (weatherType === "Clear") {
    document.body.style.backgroundImage =
      "url('./images/Blue-Sky-Opera-Wallpapers.jpg')";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = "100% 100%";
  } else if (weatherType === "Smoke") {
    document.body.style.backgroundImage =
      "url('./images/107252940-1686167710853-Air_Quality_NYC_Canada_Wildfires.jpg')";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = "100% 100%";
  } else if (weatherType === "Rain") {
    document.body.style.backgroundImage = "url('./images/aAtHb4.webp')";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = "100% 100%";
  } else if (weatherType === "Snow") {
    document.body.style.backgroundImage =
      "url('./images/713f694060a1072385c65e00f6429d99.jpg')";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = "100% 100%";
  } else if (weatherType === "Fog"){
    document.body.style.backgroundImage =
      "url('./images/istockphoto-478719667-612x612.jpg')";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = "100% 100%";
  }
  else if (weatherType === "Haze"){
    document.body.style.backgroundImage = 
      "url('./images/Forest-trees-haze-fog-morning_1920x1080.jpg')";
      document.body.style.backgroundRepeat = "no-repeat";
      document.body.style.backdropFilter = "100% 100%";
  }
  else if (weatherType === "Thunderstorm"){
    document.body.style.backgroundImage = 
      "url('./images/pexels-philippe-donn-1114688.jpg')";
      document.body.style.backgroundRepeat = "no-repeat";
      document.body.style.backdropFilter = "100% 100%";
  }
  else if (weatherType === "Mist"){
    document.body.style.backgroundImage = 
      "url('./images/fog-over-the-lake-in-the-morning.jpg')";
      document.body.style.backgroundRepeat = "no-repeat";
      document.body.style.backdropFilter = "100% 100%";
  }
}

function renderWeatherInfo(weatherInfo) {
  const weatherType = document.querySelector(".weather-type");
  const temp = document.querySelector(".temp");
  const windspeed = document.querySelector(".windspeed");
  const humidity = document.querySelector(".humidity");
  const clouds = document.querySelector(".clouds");
  const cityName = document.querySelector(".city-name");
  const countryIcon = document.querySelector("[data-countryIcon]");

  let bgImage = weatherInfo?.weather?.[0]?.main;
  changeBackground(bgImage);
  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  weatherType.innerText = `${weatherInfo?.weather?.[0]?.main}`;
  temp.innerText = `${weatherInfo?.main?.temp} °C`;
  windspeed.innerText = `${weatherInfo?.wind?.speed}km/h`;
  humidity.innerText = `${weatherInfo?.main?.humidity}%`;
  clouds.innerText = `${weatherInfo?.clouds?.all}%`;
  cityName.innerText = `${weatherInfo?.name}`;
}

async function fetchUserWeatherInfo(coordinates) {
  const { lat, lon } = coordinates;
  grantAccessContainer.classList.add("grant-acc");
  loadingScreen.classList.remove("loading");
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    if (!data.sys) {
      throw data;
    }
    displayWeather.classList.remove("dis-weather");
    displayWeather.style.padding = "50px";
    loadingScreen.classList.add("loading");
    renderWeatherInfo(data);
  } catch (error) {
    loadingScreen.classList.add("loading");
    errorText.innerText = `${error?.message}`;
    errorContainer.classList.remove("error");
    apiErrorBtn.classList.remove("retry-btn");
    apiErrorBtn.addEventListener("click", fetchUserWeatherInfo);
  }
}

async function fetchSearchInfo(city) {
  loadingScreen.classList.remove("loading");
  displayWeather.classList.add("dis-weather");
  errorContainer.classList.add("error");
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    if (!data.sys) {
      throw data;
    }
    displayWeather.classList.remove("dis-weather");
    loadingScreen.classList.add("loading");
    renderWeatherInfo(data);
  } catch (error) {
    loadingScreen.classList.add("loading");
    errorContainer.classList.remove("error");
    displayWeather.classList.add("dis-weather");
    errorText.innerText = `${error?.message}`;
  }
}

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (searchText.value === "") return;
  fetchSearchInfo(searchText.value);
  searchText.value = "";
});



// Check if coordinates are already present in Session Storage
function getFromSessionStorage() {
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  if (!localCoordinates) {
    grantAccessContainer.classList.remove("grant-acc");
  } else {
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}

// Get Coordinates using geoLocation
// https://www.w3schools.com/html/html5_geolocation.asp
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    grantAccessContainer.style.display = "none";
  }
}

// Store User Coordinates
function showPosition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };
  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}

getFromSessionStorage();
grantAccessBtn.addEventListener("click", getLocation);
