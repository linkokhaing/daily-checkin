function saveSleep() {
    
    const today = new Date().toISOString().split("T")[0];
    const sleep = document.getElementById("sleep").value;

    if (sleep === "") {
        document.getElementById("message").textContent =
            "Please enter your sleep hours.";
        return;
    }

    // Save the sleep data
localStorage.setItem("sleep-" + today, sleep);
    document.getElementById("message").textContent =
        "Saved! You slept " + sleep + " hours.";
}


// Load saved data when the app opens
const savedSleep = localStorage.getItem("sleep-" + today);

if (savedSleep !== null) {
    document.getElementById("sleep").value = savedSleep;
}

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


// Load saved study time
const savedStudy = localStorage.getItem("study-" + today);

if (savedStudy !== null) {
    document.getElementById("study").value = savedStudy;
}

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

function showHistory() {

    document.getElementById("today-page").style.display = "none";

    document.getElementById("history-page").style.display = "block";

    const history = document.getElementById("history");

    history.innerHTML = "<h1>HISTORY</h1>";

    for (let i = 0; i < localStorage.length; i++) {

        const key = localStorage.key(i);

        if (key.startsWith("sleep-")) {

            const date = key.replace("sleep-", "");
            const sleep = localStorage.getItem(key);

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
    }
}

function showToday() {

    document.getElementById("today-page").style.display = "block";

    document.getElementById("history-page").style.display = "none";
}