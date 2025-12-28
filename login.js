// Add a class to the body for login-page specific styling
document.body.classList.add('login-page');

// Animation Toggle Logic
const loginTitle = document.querySelector('#login-title');
const signupTitle = document.querySelector('#signup-title');
const loginFormDiv = document.querySelector('.login');
const signupFormDiv = document.querySelector('.signup');

loginTitle.addEventListener('click', () => {
    loginFormDiv.classList.remove('slide-up');
    signupFormDiv.classList.add('slide-up');
});

signupTitle.addEventListener('click', () => {
    loginFormDiv.classList.add('slide-up');
    signupFormDiv.classList.remove('slide-up');
});


// ================== API CALLS ==================

async function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById("loginUser").value;
    const password = document.getElementById("loginPass").value;

    const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });
    const data = await res.json();

    if (data.success && data.role === "admin") {
        window.location.href = "/admin.html";
    } else if (data.success) {
        window.location.href = "/dashboard.html";
    } else {
        alert("Invalid credentials");
    }
}

async function handleRegister(event) {
    event.preventDefault();
    const username = document.getElementById("regUser").value;
    const password = document.getElementById("regPass").value;

    if (!username || !password) {
        alert("Please enter both username and password.");
        return;
    }

    const res = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });
    const data = await res.json();

    if (data.success) {
        alert("Registration successful. Please log in.");
        // Switch to the login view
        loginTitle.click();
        document.getElementById("registerForm").reset();
    } else {
        alert(data.message);
    }
}

document.getElementById("loginForm").addEventListener("submit", handleLogin);
document.getElementById("registerForm").addEventListener("submit", handleRegister);