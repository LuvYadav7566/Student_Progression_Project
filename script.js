// ================== LOGIN / REGISTER ==================

async function login(event) {
  event.preventDefault();
  const username = document.getElementById("loginUser").value;
  const password = document.getElementById("loginPass").value;

  const res = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();

  document.querySelector('.login-container').style.display = "none";

  if (data.success && data.role === "admin") {
    document.getElementById("admin-panel").style.display = "block";
    loadUsers();
    loadQueries();
  } else if (data.success) {
    document.getElementById("main-content").style.display = "block";
  } else {
    alert("Invalid credentials");
    document.querySelector('.login-container').style.display = "block";
  }
}

async function register() {
  const username = document.getElementById("regUser").value;
  const password = document.getElementById("regPass").value;

  const res = await fetch("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();

  if (data.success) {
    alert("Registration successful. Please log in.");
    showLogin();
  } else {
    alert(data.message);
  }
}

function showRegister() {
  document.getElementById("registerForm").style.display = "block";
}

function showLogin() {
  document.getElementById("registerForm").style.display = "none";
}

document.getElementById("loginForm").addEventListener("submit", login);

// ================== LOGOUT ==================

function logout() {
  // Hide main content & admin panel
  document.getElementById("main-content").style.display = "none";
  document.getElementById("admin-panel").style.display = "none";

  // Show login again
  document.querySelector('.login-container').style.display = "block";

  // Optional: Clear inputs
  document.getElementById("loginForm").reset();
  if (document.getElementById("registerForm")) {
    document.getElementById("regUser").value = "";
    document.getElementById("regPass").value = "";
  }
}

// ================== CONTACT FORM (Student) ==================

document.getElementById("contactForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  const res = await fetch("/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, message })
  });
  const data = await res.json();

  alert(data.message);
  document.getElementById("contactForm").reset();
});

// ================== ADMIN FEATURES ==================

// Load users
async function loadUsers() {
  const res = await fetch("/users");
  const data = await res.json();
  const container = document.getElementById("usersList");
  container.innerHTML = "";

  data.forEach(u => {
    container.innerHTML += `
      <div style="background:#f9f9f9; padding:10px; margin:5px 0; border-radius:8px; box-shadow:0 2px 4px rgba(0,0,0,0.1);">
        <strong>${u.username}</strong> <span style="color:gray">(${u.role})</span>
        <button style="float:right; background:#ff4d4d; color:white; border:none; border-radius:5px; padding:5px 10px; cursor:pointer;"
          onclick="deleteUser('${u.username}')">Delete</button>
      </div>`;
  });
}

// Delete user
async function deleteUser(username) {
  if (!confirm(`Delete user: ${username}?`)) return;
  await fetch(`/users/${username}`, { method: "DELETE" });
  loadUsers();
}

// Load queries
async function loadQueries() {
  const res = await fetch("/queries");
  const data = await res.json();
  const container = document.getElementById("queriesList");
  container.innerHTML = "";

  data.forEach(q => {
    container.innerHTML += `
      <div style="background:#eef6ff; padding:12px; margin:8px 0; border-radius:8px; box-shadow:0 2px 4px rgba(0,0,0,0.1);">
        <strong>${q.name}</strong> (<em>${q.email}</em>)<br>
        <p>${q.message}</p>
        <small style="color:gray">${new Date(q.date).toLocaleString()}</small>
        <button style="float:right; background:#e74c3c; color:white; border:none; border-radius:5px; padding:5px 10px; cursor:pointer;"
          onclick="deleteQuery(${q.id})">Delete</button>
      </div>`;
  });
}

// Delete query
async function deleteQuery(id) {
  if (!confirm(`Delete query #${id}?`)) return;
  await fetch(`/queries/${id}`, { method: "DELETE" });
  loadQueries();
}

// ================== STUDENT FEATURES ==================

// Exam suggestions
document.getElementById("examForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const stream = document.getElementById("stream").value;
  let suggestions = "";

  if (stream === "Science") {
    suggestions = "<ul><li>JEE (Engineering)</li><li>NEET (Medical)</li><li>NATA (Architecture)</li></ul>";
  } else if (stream === "Commerce") {
    suggestions = "<ul><li>CA Foundation</li><li>IPMAT</li><li>CMA</li></ul>";
  } else if (stream === "Arts") {
    suggestions = "<ul><li>NID (Design)</li><li>CUET</li><li>NIFT</li></ul>";
  }
  document.getElementById("examSuggestions").innerHTML = suggestions;
});

// Courses after graduation
document.getElementById('graduationForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const graduationType = document.getElementById('graduationType').value;
  const container = document.getElementById('courseSuggestions');
  
  let courses = [];
  switch (graduationType) {
    case 'B.Tech': courses = ['M.Tech','MBA','Data Science','AI & ML','Software Dev']; break;
    case 'B.Com': courses = ['M.Com','MBA (Finance)','CA','CS','CFP']; break;
    case 'BA': courses = ['MA','MBA (HR/Marketing)','Civil Services','Journalism']; break;
    case 'B.Sc': courses = ['M.Sc','MBA','PG Diploma in Data Science','Clinical Research']; break;
    case 'Other': courses = ['MBA','Civil Services','Entrepreneurship']; break;
  }
  container.innerHTML = courses.map(c => `<p>${c}</p>`).join('');
});

// Government exam suggestions
document.getElementById('govtExamForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const level = document.getElementById('qualificationLevel').value;
  const container = document.getElementById('govtExamSuggestions');
  
  let exams = [];
  if (level === '12th') exams = ['NDA','SSC CHSL','Railway RRB','State Police','CLAT'];
  if (level === 'Graduation') exams = ['UPSC','IBPS PO','SSC CGL','RRB NTPC','CDS'];
  container.innerHTML = exams.map(e => `<p>${e}</p>`).join('');
});

// Percentage-based college suggestions (JEE/NEET)
document.getElementById("percentageForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const percentage = parseInt(document.getElementById("percentage").value);
  const examType = document.getElementById("examTypePercentage").value;
  let suggestions = "";

  if (examType === "JEE") {
    if (percentage >= 95) suggestions = "<ul><li>IITs</li><li>BITS Pilani</li><li>NITs</li></ul>";
    else if (percentage >= 90) suggestions = "<ul><li>VIT</li><li>SRM</li></ul>";
    else suggestions = "<ul><li>Private Colleges</li></ul>";
  } else if (examType === "NEET") {
    if (percentage >= 85) suggestions = "<ul><li>AIIMS</li><li>JIPMER</li></ul>";
    else if (percentage >= 70) suggestions = "<ul><li>Private Medical Colleges</li></ul>";
    else suggestions = "<ul><li>Local Institutions</li></ul>";
  }
  document.getElementById("percentageSuggestions").innerHTML = suggestions;
});

// College suggestions
document.getElementById("collegeForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const percentage = parseInt(document.getElementById("percentageCollege").value);
  let suggestions = "";
  if (percentage >= 90) suggestions = "<ul><li>IITs</li><li>AIIMS</li><li>NITs</li></ul>";
  else if (percentage >= 75) suggestions = "<ul><li>DU</li><li>VIT</li><li>Symbiosis</li></ul>";
  else if (percentage >= 60) suggestions = "<ul><li>IGNOU</li><li>Parul University</li></ul>";
  else suggestions = "<ul><li>Private Colleges</li></ul>";
  document.getElementById("collegeSuggestions").innerHTML = suggestions;
});

// Subject-based courses
document.getElementById("courseForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const subject = document.getElementById("subject").value;
  let suggestions = "";
  if (subject === "Biology") suggestions = "<ul><li>MBBS</li><li>BDS</li><li>Pharmacy</li></ul>";
  if (subject === "Mathematics") suggestions = "<ul><li>B.Tech</li><li>Data Science</li></ul>";
  if (subject === "Commerce") suggestions = "<ul><li>B.Com</li><li>CA</li><li>CFA</li></ul>";
  if (subject === "Arts") suggestions = "<ul><li>Design</li><li>Fine Arts</li><li>Journalism</li></ul>";
  document.getElementById("courseSuggestions2").innerHTML = suggestions;
});
