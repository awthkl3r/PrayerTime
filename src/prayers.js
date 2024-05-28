let city = null
let country = null

let date = new Date()
let month = 0 + (date.getMonth() + 1).toString()
let day = date.getDate().toString()
let year = date.getFullYear().toString()

let count = 0

const fajr = document.getElementById("Fajr")
const dhuhr = document.getElementById("Dhuhr")
const asr = document.getElementById("Asr")
const maghrib = document.getElementById("Maghrib")
const isha = document.getElementById("Isha")
const dateText = document.getElementById("date")
const timeText = document.getElementById("time")
const warningText = document.getElementById("warning")
const placeText = document.getElementById("place")
const card1 = document.getElementById("card1")
const card2 = document.getElementById("card2")
const card3 = document.getElementById("card3")
const card4 = document.getElementById("card4")
const card5 = document.getElementById("card5")
const card1iconA = document.getElementById("card1iconA")
const card2iconA = document.getElementById("card2iconA")
const card3iconA = document.getElementById("card3iconA")
const card4iconA = document.getElementById("card4iconA")
const card5iconA = document.getElementById("card5iconA")
const card1iconB = document.getElementById("card1iconB")
const card2iconB = document.getElementById("card2iconB")
const card3iconB = document.getElementById("card3iconB")
const card4iconB = document.getElementById("card4iconB")
const card5iconB = document.getElementById("card5iconB")
const locationBtn = document.getElementById("location")

let data 
let geo

let hours = date.getHours()
let minutes = date.getMinutes()
let seconds = date.getSeconds()
let date_formatted = `${month}/${day}/${year} \n \n ${hours >= 12 ? hours : hours-12}:${minutes <= 9 ? 0 + minutes.toString() : minutes}:${seconds <= 9 ? 0 + seconds.toString() : seconds} `

const x = document.getElementById("demo");
let lat
let long

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition);
	} else {
		console.log('not supported')
	}
}
async function showPosition(position) {
	lat = position.coords.latitude
	long = position.coords.longitude

	// const url2 = `https://trueway-geocoding.p.rapidapi.com/ReverseGeocode?location=${lat}%2C${long}&language=en`;
	const url2 = `https://maptoolkit.p.rapidapi.com/geocode/reverse?lat=${lat}&lon=${long}`;
	const options2 = {
		method: 'GET',
		headers: {	
			Accept: 'application/json',
			'X-RapidAPI-Key': '432de292afmshb50fe55fde71a2ep1ba370jsn088a4004a8d7',
			'X-RapidAPI-Host': 'maptoolkit.p.rapidapi.com'
		}
	};
	try {
		const response = await fetch(url2, options2);
		const result = await response.text();

		geo = JSON.parse(result);
	} catch (error) {
		console.error(error);
	}

	// console.log()

	city = geo.address.town
	country = geo.address.state

	placeText.innerText = `${city}, ${country}`
}

locationBtn.addEventListener("click", ()=>{
	getLocation()
	history.go(0)
})
locationBtn.addEventListener("touchstart", ()=>{
	getLocation()
	history.go(0)
}) 	

let prayerTimes
let prayers

let finalTime
let newPrayers = []

async function getPrayers(){
	const url = `https://prayer-times11.p.rapidapi.com/timingsByCity/${month+day+year}?method=2&city=${city}&country=${country}`;
	const options = {
		method: 'GET',
		headers: {	
			Accept: 'application/json',
			'X-RapidAPI-Key': '432de292afmshb50fe55fde71a2ep1ba370jsn088a4004a8d7',
			'X-RapidAPI-Host': 'prayer-times11.p.rapidapi.com'
		}
	};
	try {
		const response1 = await fetch(url, options);
		const result1 = await response1.text();
	
		data = JSON.parse(result1);
		prayerTimes = data.data.timings

		prayers = [prayerTimes.Fajr, prayerTimes.Dhuhr, prayerTimes.Asr, prayerTimes.Maghrib, prayerTimes.Isha]

		for (let i = 0; i < prayers.length; i++){
			let hrs = prayers[i].split(":")[0]
			finalTime = (parseInt(hrs <= 12 ? hrs : hrs-12) + ":" + prayers[i].split(":")[1]).toString()
			newPrayers[i] = finalTime
		}

		fajr.innerText = newPrayers[0]
		dhuhr.innerText = newPrayers[1]
		asr.innerText = newPrayers[2]
		maghrib.innerText = newPrayers[3]
		isha.innerText = newPrayers[4]
		
	} catch (error) {
		console.error(error);
	}
}getPrayers()

const cards = [card1, card2, card3, card4, card5]
const cardiconsA = [card1iconA, card2iconA, card3iconA, card4iconA, card5iconA]
const cardiconsB = [card1iconB, card2iconB, card3iconB, card4iconB, card5iconB]

function parseTime(timeStr) {
	const [hours, minutes] = timeStr.split(":").map(Number);
	const now = new Date();
	return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
}
  
// Function to check if current time is within a given time frame
function isWithinTimeFrame(startTime, endTime) {
	const now = new Date();
	return now >= startTime && now <= endTime;
}

function timeToMinutes(time) {
    let [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

function findClosestTime(times, target) {
    const targetMinutes = timeToMinutes(target);

    let closestTime = times[0];
    let closestDifference = Math.abs(timeToMinutes(times[0]) - targetMinutes);

    for (let i = 1; i < times.length; i++) {
        let currentMinutes = timeToMinutes(times[i]);
        let currentDifference = Math.abs(currentMinutes - targetMinutes);

        if (currentDifference < closestDifference) {
            closestTime = times[i];
            closestDifference = currentDifference;
        }
    }

    return closestTime;
}

function step(){
	getLocation()
	getPrayers()
	
	date = new Date()
	hours = date.getHours()
	minutes = date.getMinutes()
	
	month = 0 + (date.getMonth() + 1).toString()
	day = date.getDate().toString()
	year = date.getFullYear().toString()

	let daySuffix = '';
	if (day === 1 || day === 21 || day === 31) {
		daySuffix = 'st';
	} else if (day === 2 || day === 22) {
		daySuffix = 'nd';
	} else if (day === 3 || day === 23) {
		daySuffix = 'rd';
	} else {
		daySuffix = 'th';
	}

	
	dateText.innerText = `${day}${daySuffix} of ${months[month - 1]}, ${year}`
	timeText.innerText = `${hours <= 12 ? hours : hours-12}:${minutes <= 9 ? 0 + minutes.toString() : minutes}`

	if (city != null && country != null && count > 0){
		for (let i = 0; i < prayers.length; i++){
			if(prayers[i] == findClosestTime(prayers, `${hours}:${minutes}`)){
				
				if(cards[i+1] != null && cardiconsB[i+1] != null){
					if(cardiconsB[i+1].classList.contains("d-none")){
						if(cards[i+1] != null && cardiconsB[i+1] != null){
							cardiconsB[i+1].classList.remove("d-none")
						}
					}
					if(
						!cards[i+1].classList.contains("bg-black") && 
						!cards[i+1].classList.contains("text-white") && 
						!cards[i+1].classList.contains("float") && 
						!cards[i+1].classList.contains("delay")
					){
						
						// console.log("before time added")
						cards[i+1].classList.add("bg-black")
						cards[i+1].classList.add("text-white")
						cards[i+1].classList.add("float")
						cards[i+1].classList.add("delay")
					}
				}
				
	
				if(cardiconsA[i].classList.contains("d-none")){
					if(cards[i] != null && cardiconsA[i] != null){	
						cardiconsA[i].classList.remove("d-none")
					}
				}
				if(
					!cards[i].classList.contains("bg-dark") && 
					!cards[i].classList.contains("text-white") && 
					!cards[i].classList.contains("float")
				){
					if(cards[i] != null && cardiconsA[i] != null){
						// console.log("NOW time added")
						cards[i].classList.add("bg-dark")
						cards[i].classList.add("text-white")
						cards[i].classList.add("float")
					}
				}
				
			}
			if(prayers[i] != findClosestTime(prayers, `${hours}:${minutes}`)){
				// console.log("not in time")
				if(cardiconsB[i+1] != null){
					if(
						!cardiconsB[i+1].classList.contains("d-none") &&
						cards[i+1].classList.contains("bg-black") &&
						cards[i+1].classList.contains("text-white") &&
						cards[i+1].classList.contains("float") &&
						cards[i+1].classList.contains("delay") 
					  )
					{
						// console.log("later time removed")
						cardiconsB[i+1].classList.add("d-none")
						cards[i+1].classList.remove("bg-black")
						cards[i+1].classList.remove("text-white")
						cards[i+1].classList.remove("float")
						cards[i+1].classList.remove("delay")
					}
					if(
						cardiconsA[i].classList.contains("d-none") == false &&
						cards[i].classList.contains("bg-dark") &&
						cards[i].classList.contains("text-white") &&
						cards[i].classList.contains("float")
					  )
					{
						// console.log("NOW time removed")
						cardiconsA[i].classList.add("d-none")
						cards[i].classList.remove("bg-dark") 
						cards[i].classList.remove("text-white") 
						cards[i].classList.remove("float")
					}
				}
			}
		}
	}
	if((city == null || country == null) && count == 2){
		warningText.innerText = "Please Press The Button Below To Get Your Prayer Times."
	}
	else{
		warningText.innerText = " "
	}
	count += 1
}


for (let i = 0; i < 10; i++) {
	setTimeout(function() {
		step();
	}, i * 1000);
}



setInterval(()=>{
	step()
}, 10 * 60 * 1000)

