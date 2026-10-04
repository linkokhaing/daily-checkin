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

        updateDashboard();
        updateWeeklyProgress();
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

        updateDashboard();
        updateWeeklyProgress();
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

        updateDashboard();
        updateWeeklyProgress();
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

        updateDashboard();
        updateWeeklyProgress();
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

        updateDashboard();
        updateWeeklyProgress();
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


            // Calculate daily score
let score = 0;

// Sleep
if (sleep !== "-") {
    const sleepNumber = Number(sleep);

    if (sleepNumber >= 7) {
        score += 30;
    } else if (sleepNumber >= 6) {
        score += 20;
    } else if (sleepNumber >= 5) {
        score += 10;
    }
}

// Workout
if (workout === "Yes") {
    score += 20;
}

// Study
if (study !== "-") {
    const studyNumber = Number(study);

    if (studyNumber >= 60) {
        score += 20;
    } else if (studyNumber >= 30) {
        score += 10;
    }
}

// Coffee
if (coffee !== "-") {
    const coffeeNumber = Number(coffee);

    if (coffeeNumber <= 3) {
        score += 10;
    } else if (coffeeNumber <= 4) {
        score += 5;
    }
}

// Mood
if (mood !== "-") {
    const moodNumber = Number(mood);
    score += moodNumber * 4;
}


        history.innerHTML += `
            <div class="history-card">

                <h3>${date}</h3>

                <div class="history-score">
    ${score}/100
</div>

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


// =========================
// DASHBOARD
// =========================

function updateDashboard() {

    // Date
    const date = new Date();

    const options = {
        weekday: "long",
        month: "short",
        day: "numeric"
    };

    document.getElementById("dashboard-date").textContent =
        date.toLocaleDateString("en-US", options);


    // Get today's data
    const sleep =
        localStorage.getItem("sleep-" + today);

    const workout =
        localStorage.getItem("workout-" + today);

    const study =
        localStorage.getItem("study-" + today);

    const coffee =
        localStorage.getItem("coffee-" + today);

    const mood =
        localStorage.getItem("mood-" + today);


    // Display today's data
    document.getElementById("dashboard-sleep").textContent =
        sleep ? sleep + "h" : "-";

    document.getElementById("dashboard-workout").textContent =
        workout || "-";

    document.getElementById("dashboard-study").textContent =
        study ? study + "m" : "-";

    document.getElementById("dashboard-coffee").textContent =
        coffee || "-";

    document.getElementById("dashboard-mood").textContent =
        mood ? mood + "/5" : "-";


    // =========================
    // CALCULATE SCORE
    // =========================

    let score = 0;


    // Sleep: 30 points
    if (sleep) {

        const sleepNumber = Number(sleep);

        if (sleepNumber >= 7) {
            score += 30;
        } else if (sleepNumber >= 6) {
            score += 20;
        } else if (sleepNumber >= 5) {
            score += 10;
        }
    }


    // Workout: 20 points
    if (workout === "Yes") {
        score += 20;
    }


    // Study: 20 points
    if (study) {

        const studyNumber = Number(study);

        if (studyNumber >= 60) {
            score += 20;
        } else if (studyNumber >= 30) {
            score += 10;
        }
    }


    // Coffee: 10 points
    if (coffee) {

        const coffeeNumber = Number(coffee);

        if (coffeeNumber <= 3) {
            score += 10;
        } else if (coffeeNumber <= 4) {
            score += 5;
        }
    }


    // Mood: 20 points
    if (mood) {

        const moodNumber = Number(mood);

        score += moodNumber * 4;
    }


    // Show score
    document.getElementById("daily-score").textContent =
        score + "/100";
}


// Update dashboard when page loads
updateDashboard();

// =========================
// WEEKLY PROGRESS
// =========================

function updateWeeklyProgress() {

    let totalScore = 0;
    let totalSleep = 0;
    let totalStudy = 0;
    let workoutDays = 0;

    let daysWithData = 0;


    // Check the last 7 days
    for (let i = 0; i < 7; i++) {

        const date = new Date();

        date.setDate(date.getDate() - i);

        const dateKey =
            date.toISOString().split("T")[0];


        // Get data
        const sleep =
            localStorage.getItem("sleep-" + dateKey);

        const workout =
            localStorage.getItem("workout-" + dateKey);

        const study =
            localStorage.getItem("study-" + dateKey);

        const coffee =
            localStorage.getItem("coffee-" + dateKey);

        const mood =
            localStorage.getItem("mood-" + dateKey);


        // Skip days with no check-in
        if (
            sleep === null &&
            workout === null &&
            study === null &&
            coffee === null &&
            mood === null
        ) {
            continue;
        }


        daysWithData++;


        // Sleep
        if (sleep !== null) {

            const sleepNumber = Number(sleep);

            totalSleep += sleepNumber;
        }


        // Study
        if (study !== null) {

            const studyNumber = Number(study);

            totalStudy += studyNumber;
        }


        // Workout
        if (workout === "Yes") {

            workoutDays++;
        }


        // Calculate daily score
        let score = 0;


        // Sleep = 30 points
        if (sleep !== null) {

            const sleepNumber = Number(sleep);

            if (sleepNumber >= 7) {
                score += 30;
            } else if (sleepNumber >= 6) {
                score += 20;
            } else if (sleepNumber >= 5) {
                score += 10;
            }
        }


        // Workout = 20 points
        if (workout === "Yes") {
            score += 20;
        }


        // Study = 20 points
        if (study !== null) {

            const studyNumber = Number(study);

            if (studyNumber >= 60) {
                score += 20;
            } else if (studyNumber >= 30) {
                score += 10;
            }
        }


        // Coffee = 10 points
        if (coffee !== null) {

            const coffeeNumber = Number(coffee);

            if (coffeeNumber <= 3) {
                score += 10;
            } else if (coffeeNumber <= 4) {
                score += 5;
            }
        }


        // Mood = 20 points
        if (mood !== null) {

            const moodNumber = Number(mood);

            score += moodNumber * 4;
        }


        totalScore += score;
    }


    // =========================
    // DISPLAY RESULTS
    // =========================

    if (daysWithData === 0) {

        document.getElementById("weekly-score").textContent = "0%";
        document.getElementById("weekly-sleep").textContent = "0h";
        document.getElementById("weekly-study").textContent = "0m";
        document.getElementById("weekly-workout").textContent = "0";

        document.getElementById("weekly-progress-fill").style.width = "0%";

        document.getElementById("weekly-progress-text").textContent =
            "Start checking in every day.";

        return;
    }


    // Average score
    const averageScore =
        Math.round(totalScore / daysWithData);


    // Average sleep
    const averageSleep =
        (totalSleep / daysWithData).toFixed(1);


    // Update HTML
   document.getElementById("weekly-score").textContent =
    averageScore + "%";

    document.getElementById("weekly-sleep").textContent =
        averageSleep + "h";

    document.getElementById("weekly-study").textContent =
        totalStudy + "m";

    document.getElementById("weekly-workout").textContent =
        workoutDays;


    // Progress bar
    document.getElementById("weekly-progress-fill").style.width =
        averageScore + "%";


    // Message
    if (averageScore >= 80) {

    document.getElementById("weekly-progress-text").textContent =
        averageScore + "% — 🔥 Great week! Keep going.";

} else if (averageScore >= 60) {

    document.getElementById("weekly-progress-text").textContent =
        averageScore + "% — 👍 You're doing well. Keep improving.";

} else {

    document.getElementById("weekly-progress-text").textContent =
        averageScore + "% — 💪 Keep going. You can do better.";
}
}


// Update weekly progress
updateWeeklyProgress();