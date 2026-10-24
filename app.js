// =========================
// TODAY'S DATE
// =========================


const SUPABASE_URL = "https://ebaqbraghwkytznubgow.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_hwovr6hWjb-pOuPx6sw_tw_GFbrd7tJ";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);



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

let selectedWorkout = localStorage.getItem("workout-" + today) || "";

function selectWorkout(answer) {

    selectedWorkout = answer;

    const yesButton = document.getElementById("workout-yes");
    const noButton = document.getElementById("workout-no");

    yesButton.classList.remove("selected");
    noButton.classList.remove("selected");

    if (answer === "Yes") {
        yesButton.classList.add("selected");
    } else {
        noButton.classList.add("selected");
    }
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

let selectedMood = localStorage.getItem("mood-" + today) || "";

function selectMood(mood) {

    selectedMood = mood;

    const moodButtons =
        document.querySelectorAll(".mood-buttons button");

    moodButtons.forEach(button => {
        button.classList.remove("selected");
    });

    moodButtons[mood - 1].classList.add("selected");
}

// =========================
// HISTORY
// =========================


async function showHistory() {
    document.getElementById("today-page").style.display = "none";
    document.getElementById("history-page").style.display = "block";

    const history = document.getElementById("history");
    history.innerHTML = "<h1>HISTORY</h1><p>Loading your check-ins...</p>";

    try {
        const { data: { user }, error: userError } =
            await supabaseClient.auth.getUser();

        if (userError || !user) {
            throw new Error("Please log in again.");
        }

        const { data, error } = await supabaseClient
            .from("check_ins")
            .select("*")
            .eq("user_id", user.id)
            .order("check_in_date", { ascending: false });

        if (error) {
            throw error;
        }

        history.innerHTML = "<h1>HISTORY</h1>";

        if (!data || data.length === 0) {
            history.innerHTML += "<p>No check-ins yet.</p>";
            return;
        }

        data.forEach(entry => {
            const sleep = entry.sleep_hours ?? "-";
            const workout = entry.workout ?? "-";
            const study = entry.study_minutes ?? "-";
            const coffee = entry.coffee_cups ?? "-";
            const mood = entry.mood ?? "-";
            const note = entry.note ?? "";

            let score = 0;

            if (sleep !== "-") {
                if (sleep >= 7) score += 30;
                else if (sleep >= 6) score += 20;
                else if (sleep >= 5) score += 10;
            }

            if (workout === "Yes") score += 20;

            if (study !== "-") {
                if (study >= 60) score += 20;
                else if (study >= 30) score += 10;
            }

            if (coffee !== "-") {
                if (coffee <= 3) score += 10;
                else if (coffee <= 4) score += 5;
            }

            if (mood !== "-") score += mood * 4;

            const card = document.createElement("div");
            card.className = "history-card";

            const heading = document.createElement("h3");
            heading.textContent = entry.check_in_date;
            card.appendChild(heading);

            const scoreElement = document.createElement("div");
            scoreElement.className = "history-score";
            scoreElement.textContent = score + "/100";
            card.appendChild(scoreElement);

            const details = [
                `😴 Sleep: ${sleep} hours`,
                `💪 Workout: ${workout}`,
                `📚 Study: ${study} minutes`,
                `☕ Coffee: ${coffee} cups`,
                `🙂 Mood: ${mood}/5`
            ];

            details.forEach(detail => {
                const p = document.createElement("p");
                p.textContent = detail;
                card.appendChild(p);
            });

            if (note) {
                const p = document.createElement("p");
                p.textContent = "📝 " + note;
                card.appendChild(p);
            }

            history.appendChild(card);
        });

    } catch (error) {
        console.error("History loading failed:", error);
        history.innerHTML =
            "<h1>HISTORY</h1><p>Could not load your check-ins: " +
            error.message + "</p>";
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


async function saveCheckIn() {
    const sleep = document.getElementById("sleep").value;
    const study = document.getElementById("study").value;
    const coffee = document.getElementById("coffee").value;
    const note = document.getElementById("daily-note").value;

    const message = document.getElementById("message");
    const button = document.getElementById("save-checkin-button");

    if (
        sleep === "" ||
        study === "" ||
        coffee === "" ||
        !selectedWorkout ||
        !selectedMood
    ) {
        message.textContent =
            "Please complete all sections before saving.";
        return;
    }

    button.disabled = true;
    message.textContent = "Saving your check-in...";

    try {
        const {
            data: { user },
            error: userError
        } = await supabaseClient.auth.getUser();

        if (userError || !user) {
            throw new Error("Please log in again before saving.");
        }

        const { error } = await supabaseClient
            .from("check_ins")
            .upsert(
                {
                    user_id: user.id,
                    check_in_date: today,
                    sleep_hours: Number(sleep),
                    workout: selectedWorkout,
                    study_minutes: Number(study),
                    coffee_cups: Number(coffee),
                    mood: Number(selectedMood),
                    note: note
                },
                {
                    onConflict: "user_id,check_in_date"
                }
            );

        if (error) {
            throw error;
        }

        // Keep a local copy for now, so we don't lose
        // your existing browser-based data during migration.
        localStorage.setItem("sleep-" + today, sleep);
        localStorage.setItem("workout-" + today, selectedWorkout);
        localStorage.setItem("study-" + today, study);
        localStorage.setItem("coffee-" + today, coffee);
        localStorage.setItem("mood-" + today, selectedMood);
        localStorage.setItem("note-" + today, note);

        updateDashboard();
        updateWeeklyProgress();

        message.textContent = "Check-in saved to your account!";
        button.classList.add("saved");
        button.textContent = "✓ CHECK-IN SAVED";

    } catch (error) {
        console.error("Check-in save failed:", error);
        message.textContent =
            "Could not save online: " + error.message;
    } finally {
        button.disabled = false;
    }
}




const savedNote = localStorage.getItem("note-" + today);

if (savedNote !== null) {
    document.getElementById("daily-note").value = savedNote;
}


const authPage = document.getElementById("auth-page");
const todayPage = document.getElementById("today-page");
const historyPage = document.getElementById("history-page");
const authForm = document.getElementById("auth-form");
const authMessage = document.getElementById("auth-message");

const resetPasswordPage = document.getElementById("reset-password-page");
const resetPasswordMessage = document.getElementById("reset-password-message");
const resetPasswordForm = document.getElementById("reset-password-form");



async function showSignedInApp() {
    authPage.style.display = "none";
    todayPage.style.display = "block";
    historyPage.style.display = "none";

    const nav = document.querySelector("nav");
    if (nav) nav.style.display = "flex";

    const welcomeName = document.getElementById("welcome-name");

    const { data: { user }, error } =
        await supabaseClient.auth.getUser();

    if (welcomeName) {
        const name = user?.user_metadata?.full_name;

        if (error || !user) {
            welcomeName.textContent = "Welcome!";
        } else if (user.user_metadata?.has_signed_in_before) {
            welcomeName.textContent = name
                ? `Welcome back, ${name}! 👋`
                : "Welcome back! 👋";
        } else {
            welcomeName.textContent = name
                ? `Welcome, ${name}! 👋`
                : "Welcome! 👋";

            const { error: updateError } =
                await supabaseClient.auth.updateUser({
                    data: { has_signed_in_before: true }
                });

            if (updateError) {
                console.error(
                    "Could not save first sign-in status:",
                    updateError
                );
            }
        }
    }

    await loadTodayFromSupabase();
}


function showSignedOutApp() {
    authPage.style.display = "block";
    todayPage.style.display = "none";
    historyPage.style.display = "none";

    const nav = document.querySelector("nav");
    if (nav) nav.style.display = "none";
}

authForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("auth-email").value.trim();
    const password = document.getElementById("auth-password").value;

    authMessage.textContent = "Signing in...";

    const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        authMessage.textContent = error.message;
        return;
    }

    authMessage.textContent = "";
});

document.getElementById("signup-button").addEventListener("click", async function () {
    const email = document.getElementById("auth-email").value.trim();
    const name = document.getElementById("signup-name").value.trim();
    const password = document.getElementById("auth-password").value;

    if (!name) {
        authMessage.textContent = "Please enter your name.";
        return;
    }

    if (!email || password.length < 6) {
        authMessage.textContent = "Enter your email and a password with at least 6 characters.";
        return;
    }

    authMessage.textContent = "Creating account...";

    const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
        data: {
            full_name: name
        }
      }
    });

    if (error) {
        authMessage.textContent = error.message;
        return;
    }

    if (data.session) {
        authMessage.textContent = "Account created!";
    } else {
        authMessage.textContent = "Account created. Check your email to confirm, then log in.";
    }
});


async function checkAuthSession() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
        const { error } =
            await supabaseClient.auth.exchangeCodeForSession(code);

        if (error) {
            console.error("Recovery code exchange failed:", error);
            showSignedOutApp();
            return;
        }

        // Remove the one-time code from the address bar.
        window.history.replaceState(
            {},
            document.title,
            window.location.pathname
        );
    }

    const { data, error } = await supabaseClient.auth.getSession();

    if (error) {
        console.error("Could not get session:", error);
        showSignedOutApp();
        return;
    }

    const isRecovery =
        params.get("type") === "recovery" ||
        window.location.hash.includes("type=recovery");

    if (isRecovery) {
        authPage.style.display = "none";
        todayPage.style.display = "none";
        historyPage.style.display = "none";

        const nav = document.querySelector("nav");
        if (nav) nav.style.display = "none";

        resetPasswordPage.style.display = "flex";
        return;
    }

    resetPasswordPage.style.display = "none";

    if (data.session) {
        showSignedInApp();
    } else {
        showSignedOutApp();
    }
}



supabaseClient.auth.onAuthStateChange(function (event, session) {
    const isRecovery =
    event === "PASSWORD_RECOVERY" ||
    new URLSearchParams(window.location.search).get("type") === "recovery" ||
    new URLSearchParams(window.location.search).has("code") ||
    window.location.hash.includes("type=recovery");

    if (isRecovery) {
        authPage.style.display = "none";
        todayPage.style.display = "none";
        historyPage.style.display = "none";

        const nav = document.querySelector("nav");
        if (nav) nav.style.display = "none";

        resetPasswordPage.style.display = "flex";
        return;
    }

    resetPasswordPage.style.display = "none";

    if (session) {
        showSignedInApp();
    } else {
        showSignedOutApp();
    }
});



async function loadTodayFromSupabase() {
    const { data: { user }, error: userError } =
        await supabaseClient.auth.getUser();

    if (userError || !user) {
        console.error("Could not get logged-in user:", userError);
        return;
    }

    const { data, error } = await supabaseClient
        .from("check_ins")
        .select("*")
        .eq("user_id", user.id)
        .eq("check_in_date", today)
        .maybeSingle();

    if (error) {
        console.error("Could not load today's check-in:", error);
        return;
    }

    if (!data) {
        document.getElementById("sleep").value = "";
        document.getElementById("study").value = "";
        document.getElementById("coffee").value = "";
        document.getElementById("daily-note").value = "";

        selectedWorkout = "";
        selectedMood = "";

        document.getElementById("workout-yes").classList.remove("selected");
        document.getElementById("workout-no").classList.remove("selected");

        document.querySelectorAll(".mood-buttons button")
            .forEach(button => button.classList.remove("selected"));

        updateDashboard();
        updateWeeklyProgress();
        return;
    }

    document.getElementById("sleep").value = data.sleep_hours ?? "";
    document.getElementById("study").value = data.study_minutes ?? "";
    document.getElementById("coffee").value = data.coffee_cups ?? "";
    document.getElementById("daily-note").value = data.note ?? "";

    selectedWorkout = data.workout ?? "";
    selectedMood = data.mood ?? "";

    document.getElementById("workout-yes").classList.toggle(
        "selected", selectedWorkout === "Yes"
    );
    document.getElementById("workout-no").classList.toggle(
        "selected", selectedWorkout === "No"
    );

    document.querySelectorAll(".mood-buttons button")
        .forEach((button, index) => {
            button.classList.toggle(
                "selected", index + 1 === Number(selectedMood)
            );
        });

    localStorage.setItem("sleep-" + today, data.sleep_hours ?? "");
    localStorage.setItem("workout-" + today, data.workout ?? "");
    localStorage.setItem("study-" + today, data.study_minutes ?? "");
    localStorage.setItem("coffee-" + today, data.coffee_cups ?? "");
    localStorage.setItem("mood-" + today, data.mood ?? "");
    localStorage.setItem("note-" + today, data.note ?? "");

    updateDashboard();
    updateWeeklyProgress();
}


async function loadTodayFromSupabase() {
    const { data: { user }, error: userError } =
        await supabaseClient.auth.getUser();

    if (userError || !user) {
        console.error("Could not get logged-in user:", userError);
        return;
    }

    const { data, error } = await supabaseClient
        .from("check_ins")
        .select("*")
        .eq("user_id", user.id)
        .eq("check_in_date", today)
        .maybeSingle();

    if (error) {
        console.error("Could not load today's check-in:", error);
        return;
    }

    if (!data) {
        document.getElementById("sleep").value = "";
        document.getElementById("study").value = "";
        document.getElementById("coffee").value = "";
        document.getElementById("daily-note").value = "";

        selectedWorkout = "";
        selectedMood = "";

        document.getElementById("workout-yes").classList.remove("selected");
        document.getElementById("workout-no").classList.remove("selected");

        document.querySelectorAll(".mood-buttons button")
            .forEach(button => button.classList.remove("selected"));

        updateDashboard();
        updateWeeklyProgress();
        return;
    }

    document.getElementById("sleep").value = data.sleep_hours ?? "";
    document.getElementById("study").value = data.study_minutes ?? "";
    document.getElementById("coffee").value = data.coffee_cups ?? "";
    document.getElementById("daily-note").value = data.note ?? "";

    selectedWorkout = data.workout ?? "";
    selectedMood = data.mood ?? "";

    document.getElementById("workout-yes").classList.toggle(
        "selected", selectedWorkout === "Yes"
    );
    document.getElementById("workout-no").classList.toggle(
        "selected", selectedWorkout === "No"
    );

    document.querySelectorAll(".mood-buttons button")
        .forEach((button, index) => {
            button.classList.toggle(
                "selected", index + 1 === Number(selectedMood)
            );
        });

    localStorage.setItem("sleep-" + today, data.sleep_hours ?? "");
    localStorage.setItem("workout-" + today, data.workout ?? "");
    localStorage.setItem("study-" + today, data.study_minutes ?? "");
    localStorage.setItem("coffee-" + today, data.coffee_cups ?? "");
    localStorage.setItem("mood-" + today, data.mood ?? "");
    localStorage.setItem("note-" + today, data.note ?? "");

    updateDashboard();
    updateWeeklyProgress();
}

checkAuthSession();


const togglePasswordButton = document.getElementById("toggle-password");
const passwordInput = document.getElementById("auth-password");

togglePasswordButton.addEventListener("click", function () {
    const isHidden = passwordInput.type === "password";

    passwordInput.type = isHidden ? "text" : "password";
    togglePasswordButton.textContent = isHidden ? "Hide" : "Show";
});


document.querySelectorAll(".toggle-reset-password").forEach(function (button) {
    button.addEventListener("click", function () {
        const input = button.previousElementSibling;

        const isHidden = input.type === "password";
        input.type = isHidden ? "text" : "password";
        button.textContent = isHidden ? "Hide" : "Show";
    });
});



const forgotPasswordButton = document.getElementById("forgot-password-button");

forgotPasswordButton.addEventListener("click", async function () {
    const email = document.getElementById("auth-email").value.trim();
    const authMessage = document.getElementById("auth-message");

   
    if (!email) {
        authMessage.textContent = "Please enter your email address first.";
        document.getElementById("auth-email").focus();
        return;
    }

    authMessage.textContent = "Sending password reset email...";

    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + window.location.pathname
    });

    if (error) {
        authMessage.textContent = error.message;
        return;
    }

    authMessage.textContent =
        "If an account exists for this email, you may receive a password reset link. Check your inbox.";
});




resetPasswordForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const newPassword = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (newPassword.length < 6) {
        resetPasswordMessage.textContent =
            "Your password must be at least 6 characters long.";
        return;
    }

    if (newPassword !== confirmPassword) {
        resetPasswordMessage.textContent =
            "The passwords do not match.";
        return;
    }

    resetPasswordMessage.textContent = "Updating your password...";

    const { error } = await supabaseClient.auth.updateUser({
        password: newPassword
    });

    if (error) {
        resetPasswordMessage.textContent = error.message;
        return;
    }

    resetPasswordMessage.textContent =
        "Password updated successfully! You can now sign in with your new password.";

    resetPasswordForm.reset();

await supabaseClient.auth.signOut();

resetPasswordPage.style.display = "none";
showSignedOutApp();

authMessage.textContent =
    "Password updated successfully. Please sign in with your new password.";
});
