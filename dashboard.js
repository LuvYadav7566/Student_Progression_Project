// ================== LOGOUT ==================
function logout() {
  window.location.href = "/index.html";
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

// ================== EXAM FILTER POPUP ==================
document.getElementById('openExamFilter').addEventListener('click', function() {
  document.getElementById('examFilterPopover').classList.toggle('active');
});

document.getElementById('applyExamFilter').addEventListener('click', function() {
  const selectedStreams = Array.from(
    document.querySelectorAll('#examFilterPopover input[name="streamFilter"]:checked')
  ).map(cb => cb.value);

  let suggestions = "";
  if (selectedStreams.includes("Science")) {
    suggestions += "<h3>Science Exams:</h3><ul><li>JEE</li><li>NEET</li><li>NATA</li></ul>";
  }
  if (selectedStreams.includes("Commerce")) {
    suggestions += "<h3>Commerce Exams:</h3><ul><li>CA</li><li>IPMAT</li><li>CMA</li></ul>";
  }
  if (selectedStreams.includes("Arts")) {
    suggestions += "<h3>Arts Exams:</h3><ul><li>NID</li><li>CUET</li><li>NIFT</li></ul>";
  }
  if (suggestions === "") suggestions = "<p>No exams selected.</p>";

  document.getElementById("examSuggestions").innerHTML = suggestions;
  document.getElementById('examFilterPopover').classList.remove('active');
});

document.addEventListener('click', function(event) {
  const filterContainer = document.querySelector('.filter-container');
  const popover = document.getElementById('examFilterPopover');
  if (popover.classList.contains('active') && !filterContainer.contains(event.target)) {
    popover.classList.remove('active');
  }
});

// ================== COLLEGE SUGGESTIONS ==================
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

// ================== COURSES AFTER GRADUATION ==================
document.getElementById('graduationForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const graduationType = document.getElementById('graduationType').value;
  const container = document.getElementById('courseSuggestions');

  let courses = [];
  switch (graduationType) {
    case 'B.Tech': courses = ['M.Tech','MBA','Data Science','AI & ML','Software Dev']; break;
    case 'B.Com': courses = ['M.Com','MBA (Finance)','CA','CS','CFP']; break;
    case 'BA': courses = ['MA','MBA','Civil Services','Journalism']; break;
    case 'B.Sc': courses = ['M.Sc','MBA','Clinical Research']; break;
    default: courses = ['MBA','Entrepreneurship'];
  }

  container.innerHTML = courses.map(c => `<p>${c}</p>`).join('');
});

// ================== GOVERNMENT EXAMS ==================
document.getElementById('govtExamForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const level = document.getElementById('qualificationLevel').value;
  const container = document.getElementById('govtExamSuggestions');

  let exams = level === '12th'
    ? ['NDA','SSC CHSL','RRB','Police']
    : ['UPSC','IBPS PO','SSC CGL','CDS'];

  container.innerHTML = exams.map(e => `<p>${e}</p>`).join('');
});

// ================== PERCENTAGE BASED ==================
document.getElementById("percentageForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const percentage = parseInt(document.getElementById("percentage").value);
  const examType = document.getElementById("examTypePercentage").value;
  let suggestions = "";

  if (examType === "JEE") {
    suggestions = percentage >= 95
      ? "<ul><li>IITs</li><li>NITs</li></ul>"
      : "<ul><li>Private Colleges</li></ul>";
  } else {
    suggestions = percentage >= 85
      ? "<ul><li>AIIMS</li></ul>"
      : "<ul><li>Private Medical Colleges</li></ul>";
  }

  document.getElementById("percentageSuggestions").innerHTML = suggestions;
});

// ================== SUBJECT BASED COURSES ==================
document.getElementById("courseForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const subject = document.getElementById("subject").value;
  let suggestions = "";

  if (subject === "Biology") suggestions = "<ul><li>MBBS</li><li>Pharmacy</li></ul>";
  if (subject === "Mathematics") suggestions = "<ul><li>B.Tech</li><li>Data Science</li></ul>";
  if (subject === "Commerce") suggestions = "<ul><li>B.Com</li><li>CA</li></ul>";
  if (subject === "Arts") suggestions = "<ul><li>Design</li><li>Journalism</li></ul>";

  document.getElementById("courseSuggestions2").innerHTML = suggestions;
});

// ================== 🔥 SKILL PROGRESSION ENGINE (NEW) ==================
document.getElementById("skillForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const career = document.getElementById("careerGoal").value;
  const skills = document.getElementById("currentSkills").value
    .toLowerCase()
    .split(",")
    .map(s => s.trim());

  const res = await fetch("/skill-roadmap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ career, skills })
  });

  const data = await res.json();

  let output = `
    <p><strong>Career Readiness:</strong> ${data.readiness}%</p>
    <h3>Missing Skills</h3>
    <ul>${data.missing.map(s => `<li>${s}</li>`).join("")}</ul>
    <h3>Personalized Learning Roadmap</h3>
    <ol>${data.missing.map((s, i) => `<li>Week ${i + 1}: Learn ${s}</li>`).join("")}</ol>
  `;

  document.getElementById("skillOutput").innerHTML = output;
});
