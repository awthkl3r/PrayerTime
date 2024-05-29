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
const dateTextAr = document.getElementById("date-ar")
const timeTextAr = document.getElementById("time-ar")
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
const card1iconC = document.getElementById("card1iconC")
const card2iconC = document.getElementById("card2iconC")
const card3iconC = document.getElementById("card3iconC")
const card4iconC = document.getElementById("card4iconC")
const card5iconC = document.getElementById("card5iconC")
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
const lunarMonthsAr = ['محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الأولى', 'جمادى الثانية', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'];
const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

async function getDate(){
	fetch('http://api.aladhan.com/v1/gToH/' + (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear())
		.then(response => response.json())
		.then(data => {
			const hijriDate = data.data.hijri;
			const hijriMonth = hijriDate.month.number - 1; // Adjusting to array index
			const hijriDay = hijriDate.day;
			const hijriYear = hijriDate.year;

			// Function to add leading zero if needed
			const addLeadingZero = (number) => {
				return toString(number < 10 ? '0' + number : number)
			};

			// Convert Hijri day and year to Arabic numerals
			const arabicHijriDay = String(hijriDay).split('').map(digit => arabicNumerals[digit]).join('');
			const arabicHijriYear = String(hijriYear).split('').map(digit => arabicNumerals[digit]).join('');
			const arabicHours = String(hours).split('').map(digit => arabicNumerals[digit]).join('');
			const arabicMinutes = String(minutes).split('').map(digit => arabicNumerals[digit]).join('');
			// const arabicHoursF = addLeadingZero(arabicHours).split('').map(digit => arabicNumerals[digit]).join('');
			// const arabicMinutesF = addLeadingZero(arabicMinutes).split('').map(digit => arabicNumerals[digit]).join('');
			// console.log(arabicMinutesF)

			// Display Hijri date with Arabic numerals
			dateTextAr.innerText = `${arabicHijriDay} ${lunarMonthsAr[hijriMonth]} ${arabicHijriYear} هـ`;

			// Display current time
			timeTextAr.innerText = `${arabicHours}:${arabicMinutes}`;
		})
		.catch(error => {
			console.error('Error fetching Hijri date:', error);
		});
}getDate()

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

	const url2 = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}&localityLanguage=en`;
	try {
		const response = await fetch(url2);
		const result = await response.text();

		geo = JSON.parse(result);
	} catch (error) {
		console.error(error);
	}

	// console.log(geo)

	city = geo.city
	country = geo.countryCode

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
	const url = `https://api.aladhan.com/v1/timingsByCity/${day}-${month}-${year}?city=${city}&country=${country}&method=4&adjustment=1`;
	try {
		const response1 = await fetch(url);
		const result1 = await response1.text();
	
		data = JSON.parse(result1);
		// console.log(data.data.timings)
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
const cardiconsC = [card1iconC, card2iconC, card3iconC, card4iconC, card5iconC]

function parseTime(timeStr) {
	const [hours, minutes] = timeStr.split(":").map(Number);
	const now = new Date();
	return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
}

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
	getDate()
	if(count < 1){
		getLocation()
		getPrayers()
	}
	
	
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
							// console.log("yes")
							cardiconsB[i+1].classList.remove("d-none")
						}
					}
					if(
						!cards[i+1].classList.contains("secondary-dark") && 
						!cards[i+1].classList.contains("text-white") && 
						!cards[i+1].classList.contains("float") && 
						!cards[i+1].classList.contains("delay")
					){
						
						// console.log("before time added")
						cards[i+1].classList.add("secondary-dark")
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
					!cards[i].classList.contains("secondary") && 
					!cards[i].classList.contains("text-white") && 
					!cards[i].classList.contains("float")
				){
					if(cards[i] != null && cardiconsA[i] != null){
						// console.log("NOW time added")
						cards[i].classList.add("secondary")
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
						cards[i+1].classList.contains("secondary-dark") &&
						cards[i+1].classList.contains("text-white") &&
						cards[i+1].classList.contains("float") &&
						cards[i+1].classList.contains("delay") 
					  )
					{
						// console.log("later time removed")
						cardiconsB[i+1].classList.add("d-none")
						cards[i+1].classList.remove("secondary-dark")
						cards[i+1].classList.remove("text-white")
						cards[i+1].classList.remove("float")
						cards[i+1].classList.remove("delay")
					}
					if(
						cardiconsA[i].classList.contains("d-none") == false &&
						cards[i].classList.contains("secondary") &&
						cards[i].classList.contains("text-white") &&
						cards[i].classList.contains("float")
					  )
					{
						// console.log("NOW time removed")
						cardiconsA[i].classList.add("d-none")
						cards[i].classList.remove("secondary") 
						cards[i].classList.remove("text-white") 
						cards[i].classList.remove("float")
					}
				}
			}

			if(prayers[i] < findClosestTime(prayers, `${hours}:${minutes}`)){
				if(cardiconsC[i].classList.contains("d-none") == false){
					cardiconsC[i].classList.remove("d-none")
				}
			}
			if(prayers[i] > findClosestTime(prayers, `${hours}:${minutes}`)){
				if(cardiconsC[i].classList.contains("d-none")){
					cardiconsC[i].classList.add("d-none")
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


for (let i = 0; i < 6; i++) {
	setTimeout(function() {
		step();
	}, i * 1000);
}



setInterval(()=>{
	step()
}, 10 * 60 * 1000)


