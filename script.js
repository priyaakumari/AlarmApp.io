const currentTime = document.getElementById("current-time");
const setHrs = document.getElementById("hours");
const setMin = document.getElementById("minutes");
const setSec = document.getElementById("seconds");
const setAmPm = document.getElementById("am-pm");
const setAlarmBtn = document.getElementById("submitButton");
const alarmContainer = document.getElementById("alarms-container");
//const ringTone = new Audio('files_ringtone.mp3');
// Adding Hours, Minutes, Seconds in DropDown Menu
window.addEventListener("DOMContentLoaded", (event) => {
  
    dropDownValues(1, 12, setHrs);
 
    dropDownValues(0, 59, setMin);

    dropDownValues(0, 59, setSec);

  setInterval(getCurrentTime, 1000);
  getAlarm();
});

// Event Listener added to Set Alarm Button
setAlarmBtn.addEventListener("click", getInput);


function dropDownValues(start, end, element) {
  for (let i = start; i <= end; i++) {
    const dropDown = document.createElement("option");
    dropDown.value = i < 10 ? "0" + i : i;
    dropDown.innerHTML = i < 10 ? "0" + i : i;
    element.appendChild(dropDown);
  }
}


function getCurrentTime() {
  let time = new Date();
  time = time.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });
  currentTime.innerHTML = time;

  return time;
}


function getInput(e) {
  e.preventDefault();
  const hourValue = setHrs.value;
  const minuteValue = setMin.value;
  const secondValue = setSec.value;
  const amPmValue = setAmPm.value;

  const alarmTime = convertToTime(
    hourValue,
    minuteValue,
    secondValue,
    amPmValue
  );
  setAlarm(alarmTime);
}

// Converting time to 24 hour format
function convertToTime(hour, minute, second, amPm) {
  return `${parseInt(hour)}:${minute}:${second} ${amPm}`;
}


function setAlarm(time, fetching = false) {
  const alarm = setInterval(() => {
    if (time === getCurrentTime()) {
       // ringTone.play();
      alert("Alarm Ringing");
     // ringTone.pause();
    }
    
  }, 500);

  addAlaramToDom(time, alarm);
  if (!fetching) {
    saveAlarm(time);
  }
}

// Alarms set by user Dislayed in HTML
function addAlaramToDom(time, intervalId) {
  const alarm = document.createElement("div");
  alarm.classList.add("alarm", "mb", "d-flex");
  alarm.innerHTML = `
              <div class="time">${time}</div>
              <button class="btn delete-alarm" data-id=${intervalId}>Delete</button>
              `;
  const deleteButton = alarm.querySelector(".delete-alarm");
  deleteButton.addEventListener("click", (e) => deleteAlarm(e, time, intervalId));

  alarmContainer.prepend(alarm);
}

// Is alarms saved in Local Storage?
function checkAlarams() {
  let alarms = [];
  const isPresent = localStorage.getItem("alarms");
  if (isPresent) alarms = JSON.parse(isPresent);

  return alarms;
}

// save alarm to local storage
function saveAlarm(time) {
  const alarms = checkAlarams();

  alarms.push(time);
  localStorage.setItem("alarms", JSON.stringify(alarms));
}

// Fetching data of alarms from local storage
function getAlarm() {
  const alarms = checkAlarams();

  alarms.forEach((time) => {
    setAlarm(time, true);
  });
}


function deleteAlarm(event, time, intervalId) {
  const self = event.target;

  clearInterval(intervalId);

  const alarm = self.parentElement;
  console.log(time);

  deleteAlarmFromLocalStorage(time);
  alarm.remove();
}

function deleteAlarmFromLocalStorage(time) {
  const alarms = checkAlarams();

  const index = alarms.indexOf(time);
  alarms.splice(index, 1);
  localStorage.setItem("alarms", JSON.stringify(alarms));
}