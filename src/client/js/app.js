/* Global Variables */
//Geolocations API
const geoNamesBaseURL = 'http://api.geonames.org/postalCodeSearchJSON?';
const geoNamesUserName = '&username=martinmit';
//WeatherBit API - to avoid cors-errors it runs via cors-anywhere
const weatherbitBaseURL = 'https://cors-anywhere.herokuapp.com/http://api.weatherbit.io/v2.0/history/daily?';
const weatherbitAPIKey = '&key=045bab365c5c4e1d92276c3a4fb63205';
//pixabay API - to avoid cors-errors it runs via cors-anywhere
const pixaBayAPIKey = '16331094-8019aa7939ed63cad531dbbaf'
const pixaBayBaseURL ='https://cors-anywhere.herokuapp.com/https://pixabay.com/api/?key=' + pixaBayAPIKey;
//Variable for holding the travel data
var travelData = {};

// Set up the local storage for saving trip data and get trips saved in the past and update the view to make them accessible
var tripsArray = localStorage.getItem('trips') ? JSON.parse(localStorage.getItem('trips')) : [];
function displayPastTrips(){
    tripsArray.forEach(trip => {
        let li = document.createElement("li");
        let a = document.createElement("a");
        let link = document.createTextNode(trip.date + ':' + trip.destination);
        a.appendChild(link);
        a.addEventListener("click", () => {
            travelData.destination = trip.destination;
            travelData.maxTemp = trip.maxTemp;
            travelData.minTemp = trip.minTemp;
            travelData.date = trip.date
            travelData.pictureURL = trip.pictureURL;
            travelData.caption = trip.caption
            updateView();
        });
        li.appendChild(a);
        li.classList.add("past-trips-list-item");
        document.getElementById("pastTrips").appendChild(li); 
     });
}

displayPastTrips();

//make API calls to geo names,to weatherbit and to pixabay and adopt the UI
function getLocationData(){
    const newLocation =  'placename=' + document.getElementById('location').value + '&maxRows=1';
    travelData.destination = document.getElementById('location').value;
    getAPIData(geoNamesBaseURL,newLocation,geoNamesUserName)
    .then(function(data){
        console.log(data.postalCodes[0]);
        travelData.lat = data.postalCodes[0].lat;
        travelData.lng = data.postalCodes[0].lng
        travelData.country = data.postalCodes[0].countryCode;
        travelData.date = document.getElementById('date').value;
        let dateBase = document.getElementById('date').valueAsDate;
        let startDate = new Date(dateBase.setFullYear(dateBase.getFullYear() - 1));
        let endDate = new Date(dateBase.setDate(startDate.getDate() + 1));
        let startingDate = startDate.toISOString();
        startingDate = startingDate.slice(0,10);
        let endingDate = endDate.toISOString();
        endingDate = endingDate.slice(0,10);
        console.log(startingDate + '    ' + endingDate + '    ' + dateBase);
        const newForecast =  'lat=' + data.postalCodes[0].lat + '&lon=' + data.postalCodes[0].lng + '&start_date=' +  startingDate  + '&end_date=' + endingDate;
        console.log((weatherbitBaseURL + newForecast + weatherbitAPIKey))
        return getAPIData(weatherbitBaseURL,newForecast,weatherbitAPIKey)
    })
    .then(function(data){
        console.log(data);
        travelData.maxTemp = data.data[0].max_temp;
        travelData.minTemp = data.data[0].min_temp;
        const newPicture =  '&q=' + document.getElementById('location').value + '&image_type=photo';
        return getAPIData(pixaBayBaseURL,newPicture,'')
    })
    .then(function(data){
        let randomizer = Math.random() * data.hits.length;
        let randomIndex = Math.floor(randomizer)
        travelData.pictureURL = data.hits[randomIndex].largeImageURL;
        travelData.caption = data.hits[randomIndex].tags.slice(0, data.hits[randomIndex].tags.search(','));
        travelData.caption = travelData.caption.toUpperCase();
        console.log(travelData.date);
        updateView();
// push the data to the local storage
        tripsArray.push(travelData);
        localStorage.setItem('trips', JSON.stringify(tripsArray));
        console.log(tripsArray);
        document.getElementById("pastTrips").innerHTML = '';
        displayPastTrips();
    })
}

//general function to update the view with the loaded data or with the data from past travels
function updateView(){
    document.getElementById('travel_date').innerHTML = 'Your adventure will start on ' + travelData.date;
        document.getElementById('temp_max').innerHTML = 'The highest temperature this day was ' + travelData.maxTemp + "° C";
        document.getElementById('temp_min').innerHTML = 'While the lowest temperature this day was ' + travelData.minTemp + "° C";
        document.getElementById('picture').src = travelData.pictureURL;
        document.getElementById('picture').alt = travelData.caption;
        document.getElementById('caption').innerHTML = travelData.caption;
}

//attach event handler to generate button as soon as the dom is loaded
document.addEventListener('DOMContentLoaded', function () {
    let button = document.getElementById('generate');
    button.addEventListener('click', getLocationData);
});


//general function for API calls
const getAPIData = async (URL, search, userName)=>{
  const response = await fetch(URL + search + userName)
    try {
        const data = await response.json();
    return data;
    }  
    catch(error) {
    console.log("error", error);
    window.alert('Call to API failed because of ' + error);
  }
}


export {getLocationData , getAPIData, displayPastTrips, updateView}

