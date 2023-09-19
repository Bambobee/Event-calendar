const calendar = document.querySelector(".calendar"),
    date = document.querySelector(".date"),
    daysContainer = document.querySelector(".days"),
    prev = document.querySelector(".prev"),
    next = document.querySelector(".next"),
    todayBtn = document.querySelector(".today-btn"),
    gotoBtn = document.querySelector(".goto-btn"),
    dateInput = document.querySelector(".date-input"),
    eventDay = document.querySelector(".event-day"),
    eventDate = document.querySelector(".event-date"),
    eventsContainer = document.querySelector(".events"),
    addEventSubmit = document.querySelector(".add-event-btn");

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

//default event array
// const eventsArr = [
//     {
//         day: 18,
//         month: 9,
//         year: 2023,
//         events: [
//             {
//                 title: "Event 1 This is my First event  ",
//                 time: "10:00 AM",
//             },
//             {
//                 title: "Event 2  ",
//                 time: "11:00 AM",
//             },
//         ],
//     },
//     {
//         day: 16,
//         month: 9,
//         year: 2023,
//         events: [
//             {
//                 title: "Event 1 This is my First event  ",
//                 time: "10:00 AM",
//             },
//             {
//                 title: "Event 2  ",
//                 time: "11:00 AM",
//             },
//         ],
//     }
// ]

//set an empty array
let eventsArr = [];
//then call get
getEvents();

// Function to add days
function initCalendar() {
    // To get previous month days and current month all days remaining next days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    const prevDays = prevLastDay.getDate();
    const lastDate = lastDay.getDate();
    const day = firstDay.getDay();
    const nextDays = 7 - lastDay.getDay() - 1;

    // Update date to the top calendar
    date.innerHTML = months[month] + " " + year;

    // Adding days on the DOM
    let days = "";
    // Prev month days
    for (let x = day; x > 0; x--) {
        days += `<div class="day prev-date">${prevDays - x + 1} </div>`;
    }
    // Current month days
    for (let i = 1; i <= lastDate; i++) {
        //if event present on the current date
        let event = false;
        eventsArr.forEach((eventObj) => {
            if (
                eventObj.day === i &&
                eventObj.month === month + 1 &&
                eventObj.year === year
            ) {
                //if event found true
                event = true;
            }
        })

        // If the day is today, add the class 'today'
        if (i === new Date().getDate() &&
            year === new Date().getFullYear() &&
            month === new Date().getMonth()) {
            activeDay = i;
            getActiveDay(i);
            UpdateEvents(i);
            //if event found also add event class
            //add active on today at start up
            if (event) {
                days += `<div class="day today active event">${i} </div>`;
            }
            else {
                days += `<div class="day today active">${i} </div>`;
            }
        }
        // Add the remaining as it is
        else {
            if (event) {
                days += `<div class="day event">${i} </div>`;
            }
            else {
                days += `<div class="day ">${i} </div>`;
            }
        }
    }

    // Next month days
    for (let j = 1; j <= nextDays; j++) {
        days += `<div class="day next-date">${j} </div>`;
    }
    daysContainer.innerHTML = days;
    //addLiistener after the calendar is being initialized
    addListener();
}

initCalendar();

//prev month
function prevMonth() {
    month--;
    if (month < 0) {
        month = 11;
        year--;
    }
    initCalendar();
}

//next month
function nextMonth() {
    month++;
    if (month > 11) {
        month = 0;
        year++;
    }
    initCalendar();
}

//add event linstener on the prev and next
prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

//goto date 
todayBtn.addEventListener("click", () => {
    today = new Date();
    month = today.getMonth();
    year = today.getFullYear();
    initCalendar();
});

dateInput.addEventListener("input", (e) => {
    // Allow only numbers and remove any non-numeric characters
    dateInput.value = dateInput.value.replace(/[^0-9]/g, "");

    // Format the input as "mm/yyyy"
    if (dateInput.value.length === 2 && e.inputType !== "deleteContentBackward") {
        dateInput.value += "/";
    } else if (dateInput.value.length > 2 && dateInput.value.charAt(2) !== '/') {
        // Ensure that a slash is always present at the third position
        dateInput.value = dateInput.value.slice(0, 2) + "/" + dateInput.value.slice(2);
    }

    if (dateInput.value.length > 7) {
        // Limit the input to 7 characters (mm/yyyy)
        dateInput.value = dateInput.value.slice(0, 7);
    }
});

gotoBtn.addEventListener("click", gotoDate);

//function to go to enter date
function gotoDate() {
    const dateArr = dateInput.value.split("/");
    //some date validation
    if (dateArr.length === 2) {
        if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) {
            month = dateArr[0] - 1;
            year = dateArr[1];
            initCalendar();
            return;
        }
    }
    //if invalid date
    alert("invalid date");
}

const addEventBtn = document.querySelector(".add-event"),
    addEventContainer = document.querySelector(".add-event-wrapper"),
    addEventCloseBtn = document.querySelector(".close"),
    addEventTitle = document.querySelector(".event-name"),
    addEventFrom = document.querySelector(".event-time-from"),
    addEventTo = document.querySelector(".event-time-to");

addEventBtn.addEventListener("click", () => {
    addEventContainer.classList.toggle("active");
});
addEventCloseBtn.addEventListener("click", () => {
    addEventContainer.classList.remove("active");
});

document.addEventListener("click", (e) => {
    //if click outside
    if (e.target !== addEventBtn && !addEventContainer.contains(e.target)) {
        addEventContainer.classList.remove("active");
    }
})

//allow from 50 characters in title
addEventTitle.addEventListener("input", (e) => {
    addEventTitle.value = addEventTitle.value.slice(0, 50);
})
//time format in from and to time
addEventFrom.addEventListener("input", (e) => {
    //remove anything else numbers
    addEventFrom.value = addEventFrom.value.replace(/[^0-9:]/g, "");
    //if two numbers entered auto add :
    if (addEventFrom.value.length === 2) {
        addEventFrom.value += ":";
    }
    //dont let user enter more than five characters
    if (addEventFrom.value.length > 5) {
        addEventFrom.value = addEventFrom.value.slice(0, 5);
    }
})

//same with to time
addEventTo.addEventListener("input", (e) => {
    //remove anything else numbers
    addEventTo.value = addEventTo.value.replace(/[^0-9:]/g, "");
    //if two numbers entered auto add :
    if (addEventTo.value.length === 2) {
        addEventTo.value += ":";
    }
    //dont let user enter more than five characters
    if (addEventTo.value.length > 5) {
        addEventTo.value = addEventTo.value.slice(0, 5);
    }
})

//lets  create function to add listener on days after renders
function addListener() {
    const days = document.querySelectorAll(".day");
    days.forEach((day) => {
        day.addEventListener("click", (e) => {
            //set current days as active day
            activeDay = Number(e.target.innerHTML);
            //call active day after click
            getActiveDay(e.target.innerHTML);
            UpdateEvents(Number(e.target.innerHTML));
            //remove active from already active days
            days.forEach((day) => {
                day.classList.remove("active");
            })

            //if prev month day clicked goto prev month and add active
            if (e.target.classList.contains("prev-date")) {
                prevMonth();
                setTimeout(() => {
                    //select all days of that month
                    const days = document.querySelectorAll(".day");

                    //after going to prev month add active to clicked
                    days.forEach((day) => {
                        if (!day.classList.contains("prev-date") && day.innerHTML === e.target.innerHTML) {
                            day.classList.add("active");
                        }
                    })
                }, 100);
            }
            else if (e.target.classList.contains("next-date")) {
                nextMonth();
                setTimeout(() => {
                    //select all days of that month
                    const days = document.querySelectorAll(".day");

                    //after going to prev month add active to clicked
                    days.forEach((day) => {
                        if (!day.classList.contains("next-date") && day.innerHTML === e.target.innerHTML) {
                            day.classList.add("active");
                        }
                    })
                }, 100);
            }
            else {
                //remaining current month days
                e.target.classList.add("active");
            }
        })
    })
}

//lets show active day event and date at the top

function getActiveDay(date) {
    const day = new Date(year, month, date);
    const dayName = day.toString().split(" ")[0];
    eventDay.innerHTML = dayName;
    eventDate.innerHTML = date + " " + months[month] + " " + year;
}

//to show events of the day
function UpdateEvents(date){
    let events = "";
    eventsArr.forEach((event) =>{
        if(date === event.day && 
            month + 1 === event.month &&
            year === event.year){
                //then show event on the document
                event.events.forEach((event) => {
                    events += `
                    <div class="event">
                    <div class="title">
                        <i class="bx bx-circle"></i>
                        <h3 class="event-title">${event.title}</h3>
                    </div>
                    <div class="event-time">${event.time}</div>
                </div>
                    ` ;
                })
            }
    })
    //if nothing found 
    if((events === "")){
        events = `
        <div class="no-event">
        <h3>No Events</h3>
        </div> 
        `;
    }
    eventsContainer.innerHTML = events;
    //save events update events called
    saveEvents();
}

//lets create a function to add events
addEventSubmit.addEventListener("click", () =>{
    const eventTitle = addEventTitle.value;
    const eventTimeFrom = addEventFrom.value;
    const eventTimeTo = addEventTo.value;

    //some validations
    if(eventTitle === "" || eventTimeFrom === "" || eventTimeTo === ""){
        alert("Please fill in the fields");
        return; 
    }

    const timeFromArr = eventTimeFrom.split(":");
    const timeToArr = eventTimeTo.split(":");

    if(
        timeFromArr.length !== 2 ||
        timeToArr.length !== 2 ||
        timeFromArr[0] > 23 ||
        timeFromArr[1] > 59 ||
        timeToArr[0] > 23 ||
        timeToArr[1] > 59 
    ){
        alert("Invalid Time Format");
        return;
    }

    const timeFrom = convertTime(eventTimeFrom);
    const timeTo = convertTime(eventTimeTo);

    const newEvent = {
        title: eventTitle,
        time: timeFrom + " - " + timeTo,
    };

    let eventAdded = false;
    //check if the eventsarr not empty
    if(eventsArr.lenght > 0){
        //check if the current days has  already any event then add to that
        eventsArr.forEach((item) =>{
            if(item.day === activeDay && 
                item.month === month + 1 &&
                item.year === year){
                    item.events.push(newEvent);
                    eventAdded = true;
                }
        })
    }

    //if event array empty or current day has no event create new 
    if(!eventAdded){
        eventsArr.push({
            day: activeDay,
            month: month + 1,
            year: year,
            events : [newEvent] 
        })
    }

    //remove active from add event form
    addEventContainer.classList.remove("active")
    //clear the fields 
    addEventTitle.value = "";
    addEventFrom.value = "";
    addEventTo.value = "";

    //Show current added events
    UpdateEvents(activeDay);

    //also add event class to newly added day it not added
    const activeDayElem = document.querySelector(".day.active");
    if(!activeDayElem.classList.contains("event")){
        activeDayElem.classList.add("event")
    }
});

function convertTime(time){
    let timeArr = time.split(":");
    let timeHour = timeArr[0];
    let timeMin = timeArr[1];
    let timeFormat = timeHour >= 12 ? "PM" : "AM";
    timeHour = timeHour % 12 || 12;
    time = timeHour + ":" + timeMin + " " + timeFormat;
    return time; 
}

//lets create a function to remove events onclick
eventsContainer.addEventListener("click", (e) => {
    if(e.target.classList.contains("event")){
        const eventTitle = e.target.children[0].children[1].innerHTML;
        //get the title of the event then search in the array by title and delete
        eventsArr.forEach((event) => {
            if(event.day === activeDay 
                && event.month === month + 1 
                && event.year === year){
                event.events.forEach((item, index) => {
                    if(item.title === eventTitle){
                        event.events.splice(index, 1);
                    }
                });

                //if no event remaing on that remove complete  day
                if(event.events.length === 0){
                    eventsArr.splice(eventsArr.indexOf(event), 1);
                    //after remove complete days also remove active class of that day
                    const activeDayElem = document.querySelector(".day.active");
                    if(activeDayElem.classList.contains("event")){
                        activeDayElem.classList.remove("event");
                    } 
                }
            }
        });
        //after removing from the array update event
        UpdateEvents(activeDay);
    }
});

//lets store the events in the local variable
function saveEvents(){
    localStorage.setItem("events", JSON.stringify(eventsArr));
}

function getEvents(){
    if(localStorage.getItem("events" === null)){
       return;
    }
    eventsArr.push(... JSON.parse(localStorage.getItem("events")));
}