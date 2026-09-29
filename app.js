// =========================
// TODAY'S DATE
// =========================

const today = new Date().toISOString().split("T")[0];


// =========================
// SLEEP
// =========================

function saveSleep() {

    const sleep = document.getElementById("sleep").value;

    if (sleep === "") {
        document.getElementById("message").textContent =
            "Please enter your sleep hours.";
        return;
    }

    localStorage.setItem("sleep-" + today, sleep);

    document.getElementById("message").textContent =
        "Saved! You slept " + sleep + " hours.";
}


// Load saved sleep
const savedSleep = localStorage.getItem("sleep-" + today);

if (savedSleep !== null) {
    document.getElementById("sleep").value = savedSleep;
}


// =========================
// WORKOUT
// =========================

function saveWorkout(answer) {

    localStorage.setItem("workout-" + today, answer);

    document.getElementById("workout-message").textContent =
        "Workout: " + answer;
}


// Load saved workout
const savedWorkout = localStorage.getItem("workout-" + today);

if (savedWorkout !== null) {
    document.getElementById("workout-message").textContent =
        "Workout: " + savedWorkout;
}


// =========================
// STUDY
// =========================

function saveStudy() {

    const study = document.getElementById("study").value;

    if (study === "") {
        document.getElementById("study-message").textContent =
            "Please enter your study time.";
        return;
    }

    localStorage.setItem("study-" + today, study);

    document.getElementById("study-message").textContent =
        "Saved! You studied " + study + " minutes.";
}


// Load saved study
const savedStudy = localStorage.getItem("study-" + today);

if (savedStudy !== null) {
    document.getElementById("study").value = savedStudy;
}


// =========================
// COFFEE
// =========================

function saveCoffee() {

    const coffee = document.getElementById("coffee").value;

    if (coffee === "") {
        document.getElementById("coffee-message").textContent =
            "Please enter the number of coffees.";
        return;
    }

    localStorage.setItem("coffee-" + today, coffee);

    document.getElementById("coffee-message").textContent =
        "Saved! You had " + coffee + " coffees.";
}


// Load saved coffee
const savedCoffee = localStorage.getItem("coffee-" + today);

if (savedCoffee !== null) {
    document.getElementById("coffee").value = savedCoffee;
}


// =========================
// MOOD
// =========================

function saveMood(mood) {

    localStorage.setItem("mood-" + today, mood);

    document.getElementById("mood-message").textContent =
        "Mood saved: " + mood + "/5";
}


// Load saved mood
const savedMood = localStorage.getItem("mood-" + today);

if (savedMood !== null) {
    document.getElementById("mood-message").textContent =
        "Mood saved: " + savedMood + "/5";
}


// =========================
// HISTORY
// =========================

function showHistory() {

    document.getElementById("today-page").style.display = "none";
    document.getElementById("history-page").style.display = "block";

    const history = document.getElementById("history");

    history.innerHTML = "<h1>HISTORY</h1>";

    const dates = new Set();

    // Find dates stored in localStorage
    for (let i = 0; i < localStorage.length; i++) {

        const key = localStorage.key(i);

        // Example:
        // sleep-2026-09-30
        // workout-2026-09-30
        // study-2026-09-30

        const match = key.match(
            /^(sleep|workout|study|coffee|mood)-(\d{4}-\d{2}-\d{2})$/
        );

        if (match) {
            dates.add(match[2]);
        }
    }

    // Newest date first
    const sortedDates = Array.from(dates).sort().reverse();


    // Show each day
    for (const date of sortedDates) {

        const sleep =
            localStorage.getItem("sleep-" + date) || "-";

        const workout =
            localStorage.getItem("workout-" + date) || "-";

        const study =
            localStorage.getItem("study-" + date) || "-";

        const coffee =
            localStorage.getItem("coffee-" + date) || "-";

        const mood =
            localStorage.getItem("mood-" + date) || "-";


        history.innerHTML += `
            <div class="history-card">

                <h3>${date}</h3>

                <p>😴 Sleep: ${sleep} hours</p>

                <p>💪 Workout: ${workout}</p>

                <p>📚 Study: ${study} minutes</p>

                <p>☕ Coffee: ${coffee} cups</p>

                <p>🙂 Mood: ${mood}/5</p>

            </div>
        `;
    }


    // If there is no history
    if (sortedDates.length === 0) {

        history.innerHTML +=
            "<p>No check-ins yet.</p>";
    }
}


// =========================
// TODAY PAGE
// =========================

function showToday() {

    document.getElementById("today-page").style.display = "block";

    document.getElementById("history-page").style.display = "none";
}