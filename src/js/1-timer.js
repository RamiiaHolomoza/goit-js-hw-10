import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const datetimePicker = document.querySelector("#datetime-picker");
const startButton = document.querySelector("[data-start]");
const daysElement = document.querySelector("[data-days]");
const hoursElement = document.querySelector("[data-hours]");
const minutesElement = document.querySelector("[data-minutes]");
const secondsElement = document.querySelector("[data-seconds]");

let userSelectedDate = new Date();
let timerInterval = 0;

const options = {
    enableTime: true,
    dateFormat: "Y-m-d  H:i",
    time_24hr: true,    
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    if (userSelectedDate < new Date()) {
        iziToast.error({
            title: "Error",
            message: "Please choose a date in the future",
        });
        startButton.disabled = true;
    } else {
        startButton.disabled = false;
    }
    },
};

flatpickr("#datetime-picker", options);

startButton.addEventListener("click", startTimer);

function startTimer() {
    // this.isActive = true
    startButton.disabled = true;
    datetimePicker.disabled = true;

    timerInterval = setInterval(() => {
    const now = new Date();
    const timeRemaining = userSelectedDate - now;

    if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        iziToast.success({
        title: "Completed",
        message: "The countdown has finished!",
        });
    resetTimer();
    return;
    }

    const { days, hours, minutes, seconds } = convertMs(timeRemaining);
    updateTimer({ days, hours, minutes, seconds });
    }, 1000);
}

function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor((ms % hour) / minute);
    const seconds = Math.floor((ms % minute) / second);

    return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
    return String(value).padStart(2, "0");
}

function updateTimer({ days, hours, minutes, seconds }) {
    daysElement.textContent = addLeadingZero(days);
    hoursElement.textContent = addLeadingZero(hours);
    minutesElement.textContent = addLeadingZero(minutes);
    secondsElement.textContent = addLeadingZero(seconds);
}

function resetTimer() {
    startButton.disabled = false;
    datetimePicker.disabled = false;
    daysElement.textContent = "00";
    hoursElement.textContent = "00";
    minutesElement.textContent = "00";
    secondsElement.textContent = "00";
}
