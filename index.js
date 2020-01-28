const BASE_URL = (city) => `http://api.openweathermap.org/data/2.5/forecast?q=${city}&mode=xml,&APPID=6a9e16a2ab58e42c8c16225c97d3a129`
const temperature = document.getElementById('temperature');
const city = document.getElementById('city');
const displayCity = document.getElementById('displayCity');
const temperatureAll = document.getElementById('temperature-all');

    // fetch initial data
const urlDefault = BASE_URL('London,uk')

fetch(urlDefault)
    .then((response) =>
        response.json()
    )
    .then((data) => {
        setValuesFromFetchedData(data)
    })
    

    // search city and fetch data from api
document.getElementById('search-btn').addEventListener('click', searchCity)
function searchCity(){
    const searchInputCity = document.getElementById('searchInput').value;
    const url = BASE_URL(searchInputCity)
    fetch(url)
    .then((response) => response.json())
    .then((data) => {
        console.log(data)
        if(data.city.name){
            ClearAllData();          
            setValuesFromFetchedData(data)            
        }
    })
}   

function setValuesFromFetchedData(data){
    let fetchedTemperature = createNode('h1');
    fetchedTemperature.innerHTML = toCelcius(data.list[0].main.temp);
    fetchedTemperature.setAttribute("id" , "currentTemperature")
    append(temperature, fetchedTemperature)

    let selectedCity = createNode('h2');
    selectedCity.innerHTML = data.city.name
    selectedCity.setAttribute("id" , "displayCity")
    append(city , selectedCity)

    currentTime()

    return data.list.map((info) => {
        let h5 = createNode('h5');
        let date = info.dt_txt.split(' ');
        if(date[1] === '15:00:00'){
            h5.innerHTML = toCelcius(info.main.temp)
            h5.setAttribute('class', 'temperatureOfAllDays')
            append(temperatureAll, h5)
            getWeatherIcons(info)
            getFutureDays(info);
            
        } 
    })
}

function currentTime(){
    const getDate = document.getElementById('date')

    let date = new Date()
    let hour = date.getHours()
    let minutes = date.getMinutes()
    let morningOrNight = ''

    if(hour>=0 && hour<12){
        morningOrNight = 'am'
    } else {
        morningOrNight = 'pm'
    }
    
    let h3 = createNode('h3');
    h3.setAttribute('id', 'time')
    h3.innerHTML = `Today ${hour}:${minutes} ${morningOrNight}`
    append(getDate,h3)

}
function getFutureDays(info){
    let date = info.dt_txt.split(' ')[0].toString().split('-')
    // reduce the value of month by 1 to calculate the right month
    date[1]= String(date[1]-1)

    let event = new Date(Date.UTC(date[0],date[1],date[2]))
    let options = { weekday: 'short'};
    let allFutureDays = (event.toLocaleDateString('us-en', options))

    const showAllDays= document.getElementById('days')
    let h4 = createNode('h4');
    h4.innerHTML = allFutureDays
    h4.setAttribute('class', 'next-days')
    append(showAllDays, h4)
}

function toCelcius(event){
    return Math.round(event-273.15)+ '°'
}

function getWeatherIcons(info){
    const temperatureIcons = document.getElementById('temperature-icons')
    let h4 = createNode('h4');
    let img = createNode('img');
    imgURL = info.weather[0].icon
    img.src = `http://openweathermap.org/img/w/${imgURL}.png`
    h4.setAttribute('class', 'weather-icons')
    append(h4, img);
    append(temperatureIcons, h4);
}

function createNode(element){
    return document.createElement(element)
}

function append(parent, el) {
    return parent.appendChild(el);
}

function removeElement(elementId){
    elementId.parentNode.removeChild(elementId)
}
function ClearAllData(){
    const currentTemperature = document.getElementById('currentTemperature')
    const getTime = document.getElementById('time')
    const displayCity = document.getElementById('displayCity')
    const temperatureOfAllDays = document.querySelectorAll('.temperatureOfAllDays')
    const weatherIcons = document.querySelectorAll('.weather-icons')
    const nextDays = document.querySelectorAll('.next-days')
    for(let x = 0; x<5; x++){
        removeElement(temperatureOfAllDays[x])
        removeElement(weatherIcons[x])
        removeElement(nextDays[x])
    }        
    removeElement(currentTemperature)   
    removeElement(getTime)
    removeElement(displayCity)
}
    